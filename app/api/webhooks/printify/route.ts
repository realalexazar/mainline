import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, resource } = body;

    if (!type || !resource) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const orderId = resource.id;

    switch (type) {
      case 'order:shipped': {
        const tracking = resource.shipments?.[0];
        await supabaseAdmin
          .from('orders')
          .update({
            fulfillment_status: 'shipped',
            tracking_number: tracking?.tracking_number || null,
            tracking_url: tracking?.tracking_url || null,
            status: 'shipped',
            updated_at: new Date().toISOString(),
          })
          .eq('printify_order_id', orderId);
        break;
      }

      case 'order:completed': {
        await supabaseAdmin
          .from('orders')
          .update({
            fulfillment_status: 'fulfilled',
            status: 'delivered',
            updated_at: new Date().toISOString(),
          })
          .eq('printify_order_id', orderId);
        break;
      }

      case 'order:canceled': {
        await supabaseAdmin
          .from('orders')
          .update({
            fulfillment_status: 'unfulfilled',
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('printify_order_id', orderId);
        break;
      }

      default:
        console.log(`Unhandled Printify webhook type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Printify webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
