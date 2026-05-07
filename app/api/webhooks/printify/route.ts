import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendOrderShippedEmail } from '@/lib/email';
import type { Order } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Printify signs webhook deliveries with HMAC-SHA256 of the request
// body using the secret you supplied when registering the webhook.
// Header name varies by docs version; we accept the common variants.
//
// In dev, set PRINTIFY_WEBHOOK_SECRET to anything (and pass the same
// value when registering the webhook). In prod this MUST be set or
// the route returns 503.
function verifySignature(rawBody: string, headerSig: string | null): boolean {
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET;
  if (!secret) return false;
  if (!headerSig) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  // Accept both "sha256=<hex>" and bare hex.
  const provided = headerSig.startsWith('sha256=')
    ? headerSig.slice('sha256='.length)
    : headerSig;

  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

export async function POST(request: NextRequest) {
  if (!process.env.PRINTIFY_WEBHOOK_SECRET) {
    console.error('[printify-webhook] PRINTIFY_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const rawBody = await request.text();
  const headerSig =
    request.headers.get('x-pfy-signature') ||
    request.headers.get('x-printify-signature') ||
    request.headers.get('x-hub-signature-256');

  if (!verifySignature(rawBody, headerSig)) {
    console.warn('[printify-webhook] signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body: { type?: string; resource?: { id?: string; data?: unknown }; created_at?: string };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, resource, created_at } = body;
  if (!type || !resource?.id) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Idempotency: synthetic key from type + resource id + occurred_at.
  const eventId = `${type}:${resource.id}:${created_at || ''}`;
  const { error: dedupeError } = await supabaseAdmin
    .from('printify_events')
    .insert({ id: eventId, type, payload: body });

  if (
    dedupeError &&
    (dedupeError.code === '23505' || /duplicate key/i.test(dedupeError.message))
  ) {
    return NextResponse.json({ received: true, deduped: true });
  }

  try {
    await routeEvent(type, resource);
  } catch (err) {
    console.error(`[printify-webhook] handler for ${type} failed:`, err);
  }

  return NextResponse.json({ received: true });
}

async function routeEvent(
  type: string,
  resource: { id?: string; data?: unknown }
) {
  const orderId = resource.id;
  if (!orderId) return;

  // Printify event names have evolved; accept both old + new forms.
  if (type === 'order:shipped' || type === 'order:shipment:created') {
    const data = (resource.data ?? resource) as { shipments?: Array<{ tracking_number?: string; tracking_url?: string }> };
    const tracking = data.shipments?.[0];

    const { data: order } = await supabaseAdmin
      .from('orders')
      .update({
        fulfillment_status: 'shipped',
        tracking_number: tracking?.tracking_number || null,
        tracking_url: tracking?.tracking_url || null,
        status: 'shipped',
        updated_at: new Date().toISOString(),
      })
      .eq('printify_order_id', orderId)
      .select()
      .single<Order>();

    if (order) {
      sendOrderShippedEmail(
        order,
        tracking?.tracking_number || null,
        tracking?.tracking_url || null
      ).catch((err) => console.error('[printify-webhook] ship email error:', err));
    }
    return;
  }

  if (type === 'order:completed' || type === 'order:shipment:delivered') {
    await supabaseAdmin
      .from('orders')
      .update({
        fulfillment_status: 'fulfilled',
        status: 'delivered',
        updated_at: new Date().toISOString(),
      })
      .eq('printify_order_id', orderId);
    return;
  }

  if (type === 'order:canceled' || type === 'order:cancelled') {
    await supabaseAdmin
      .from('orders')
      .update({
        fulfillment_status: 'unfulfilled',
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('printify_order_id', orderId);
    return;
  }

  console.log(`[printify-webhook] unhandled event type: ${type}`);
}
