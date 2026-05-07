import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createPrintifyOrder } from '@/lib/printify';
import { getVariantId } from '@/lib/utils';
import { sendOrderConfirmationEmail } from '@/lib/email';
import type { Order } from '@/types';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Stripe forwards webhooks with the raw request body. The signature
// verification fails if Next has parsed it, so this handler reads
// `await request.text()` directly. App Router does not parse bodies
// for arbitrary content types, so this works as-is.

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency gate. Insert the event id; if it already exists we treat
  // this as a duplicate retry and ack it so Stripe stops re-sending. We
  // do this BEFORE any side-effects so a transient downstream failure
  // can be retried by manually deleting the row (see supabase/db.md).
  const { error: dedupeError } = await supabaseAdmin
    .from('stripe_events')
    .insert({ id: event.id, type: event.type, payload: event as unknown as object });

  if (dedupeError) {
    if (
      dedupeError.code === '23505' || // unique_violation
      /duplicate key/i.test(dedupeError.message)
    ) {
      console.log(`[stripe-webhook] duplicate event ${event.id}, skipping`);
      return NextResponse.json({ received: true, deduped: true });
    }
    console.error('[stripe-webhook] failed to record event:', dedupeError);
    // Don't 500: that would cause Stripe to retry forever. Log and ack.
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'checkout.session.async_payment_failed':
        await handleAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        // Unhandled types are fine; we'll just record + ack.
        break;
    }
  } catch (err) {
    console.error(`[stripe-webhook] handler for ${event.type} failed:`, err);
    // Still 200 - we've recorded the event. Re-processing requires a
    // manual delete from stripe_events.
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // If we've already inserted an order for this session, don't redo work.
  const { data: existing } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('stripe_checkout_session_id', session.id)
    .maybeSingle();
  if (existing) {
    console.log(`[stripe-webhook] order already exists for session ${session.id}`);
    return;
  }

  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  const customerEmail = fullSession.customer_details?.email || '';
  const customerName = fullSession.customer_details?.name || '';
  const shippingDetails = fullSession.shipping_details;

  let cartItems: { product_id: string; variant: string | null; quantity: number }[] = [];
  try {
    cartItems = JSON.parse(session.metadata?.items_json || '[]');
  } catch {
    console.error('[stripe-webhook] failed to parse items_json from metadata');
  }

  const productIds = cartItems.map((i) => i.product_id);
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .in('id', productIds);

  const productMap = new Map((products || []).map((p) => [p.id, p]));

  const orderItems = cartItems.map((item) => {
    const product = productMap.get(item.product_id);
    return {
      product_id: item.product_id,
      name: product?.name || 'Unknown',
      variant: item.variant,
      quantity: item.quantity,
      price: product?.price || 0,
    };
  });

  const shippingAddress = shippingDetails?.address
    ? {
        line1: shippingDetails.address.line1 || '',
        line2: shippingDetails.address.line2 || '',
        city: shippingDetails.address.city || '',
        state: shippingDetails.address.state || '',
        postal_code: shippingDetails.address.postal_code || '',
        country: shippingDetails.address.country || '',
      }
    : null;

  // Decrement inventory atomically. If any item went out of stock between
  // checkout.create and now (rare race), we still record the order but
  // mark it for manual attention.
  let inventoryFailed = false;
  const inventoryItems = cartItems.map((i) => ({
    product_id: i.product_id,
    quantity: i.quantity,
  }));
  const { error: inventoryError } = await supabaseAdmin.rpc('apply_inventory_for_order', {
    items: inventoryItems,
  });
  if (inventoryError) {
    inventoryFailed = true;
    console.error('[stripe-webhook] inventory decrement failed:', inventoryError);
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || null,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: shippingAddress,
      items: orderItems,
      subtotal: (fullSession.amount_subtotal || 0) / 100,
      shipping_cost: (fullSession.total_details?.amount_shipping || 0) / 100,
      total: (fullSession.amount_total || 0) / 100,
      status: inventoryFailed ? 'requires_attention' : 'paid',
      fulfillment_status: 'unfulfilled',
      metadata: inventoryFailed
        ? { inventory_error: inventoryError?.message || 'unknown' }
        : {},
    })
    .select()
    .single<Order>();

  if (orderError || !order) {
    console.error('[stripe-webhook] failed to create order:', orderError);
    return;
  }

  // Upsert customer record. Increment order_count + total_spent.
  await supabaseAdmin.from('customers').upsert(
    {
      email: customerEmail,
      name: customerName,
    },
    { onConflict: 'email' }
  );

  // Fire-and-forget order confirmation email.
  sendOrderConfirmationEmail(order).catch((err) =>
    console.error('[stripe-webhook] email send error:', err)
  );

  // Submit POD items to Printify.
  if (!inventoryFailed && shippingAddress) {
    await submitToPrintify({ order, cartItems, productMap, customerEmail, customerName, shippingAddress });
  }
}

async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  // For payment methods that resolve asynchronously (bank debits, etc).
  await supabaseAdmin
    .from('orders')
    .update({ status: 'cancelled', fulfillment_status: 'unfulfilled' })
    .eq('stripe_checkout_session_id', session.id);
}

async function submitToPrintify(args: {
  order: Order;
  cartItems: { product_id: string; variant: string | null; quantity: number }[];
  productMap: Map<string, { id: string; printify_product_id?: string | null; variants?: unknown[] }>;
  customerEmail: string;
  customerName: string;
  shippingAddress: NonNullable<Order['shipping_address']>;
}) {
  const { order, cartItems, productMap, customerEmail, customerName, shippingAddress } = args;

  const podItems = cartItems.filter((item) => {
    const product = productMap.get(item.product_id);
    return !!product?.printify_product_id;
  });
  if (podItems.length === 0) return;

  try {
    const printifyLineItems = podItems
      .map((item) => {
        const product = productMap.get(item.product_id);
        if (!product?.printify_product_id) return null;

        const variantId = getVariantId(
          item.variant,
          (product.variants as Parameters<typeof getVariantId>[1]) || []
        );
        if (!variantId) return null;

        return {
          productId: product.printify_product_id,
          variantId,
          quantity: item.quantity,
        };
      })
      .filter(Boolean) as { productId: string; variantId: number; quantity: number }[];

    if (printifyLineItems.length === 0) {
      console.warn(
        `[stripe-webhook] order ${order.order_number} has Printify items but no variant ids resolved; skipping POD`
      );
      return;
    }

    const nameParts = customerName.split(' ');
    const printifyResult = await createPrintifyOrder({
      externalId: order.id,
      label: `MLH-${order.order_number}`,
      lineItems: printifyLineItems,
      shippingAddress: {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: customerEmail,
        address1: shippingAddress.line1,
        address2: shippingAddress.line2 || '',
        city: shippingAddress.city,
        region: shippingAddress.state,
        zip: shippingAddress.postal_code,
        country: shippingAddress.country,
      },
    });

    await supabaseAdmin
      .from('orders')
      .update({
        printify_order_id: printifyResult.id,
        fulfillment_status: 'processing',
      })
      .eq('id', order.id);
  } catch (printifyErr) {
    console.error('[stripe-webhook] Printify order creation failed:', printifyErr);
    await supabaseAdmin
      .from('orders')
      .update({
        status: 'requires_attention',
        metadata: { printify_error: String(printifyErr) },
      })
      .eq('id', order.id);
  }
}
