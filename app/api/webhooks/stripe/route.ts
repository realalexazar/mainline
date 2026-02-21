import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createPrintifyOrder } from '@/lib/printify';
import { getVariantId } from '@/lib/utils';
import Stripe from 'stripe';

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
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product'],
      });

      const lineItems = fullSession.line_items?.data || [];
      const customerEmail = fullSession.customer_details?.email || '';
      const customerName = fullSession.customer_details?.name || '';
      const shippingDetails = fullSession.shipping_details;

      // Parse items from metadata
      let cartItems: { product_id: string; variant: string | null; quantity: number }[] = [];
      try {
        cartItems = JSON.parse(session.metadata?.items_json || '[]');
      } catch {
        console.error('Failed to parse items_json from metadata');
      }

      // Fetch products from DB
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

      // Create order in Supabase
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
          status: 'paid',
          fulfillment_status: 'unfulfilled',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Failed to create order:', orderError);
      }

      // Upsert customer
      await supabaseAdmin
        .from('customers')
        .upsert(
          {
            email: customerEmail,
            name: customerName,
          },
          { onConflict: 'email' }
        );

      // Trigger Printify for POD items
      if (order && shippingAddress) {
        const podItems = cartItems.filter((item) => {
          const product = productMap.get(item.product_id);
          return product?.printify_product_id;
        });

        if (podItems.length > 0) {
          try {
            const printifyLineItems = podItems
              .map((item) => {
                const product = productMap.get(item.product_id);
                if (!product?.printify_product_id) return null;

                const variantId = getVariantId(item.variant, product.variants || []);
                if (!variantId) return null;

                return {
                  productId: product.printify_product_id,
                  variantId,
                  quantity: item.quantity,
                };
              })
              .filter(Boolean) as { productId: string; variantId: number; quantity: number }[];

            if (printifyLineItems.length > 0) {
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
            }
          } catch (printifyErr) {
            console.error('Printify order creation failed:', printifyErr);
          }
        }
      }
    } catch (err) {
      console.error('Error processing checkout.session.completed:', err);
    }
  }

  return NextResponse.json({ received: true });
}
