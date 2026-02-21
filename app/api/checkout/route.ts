import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { CheckoutRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const productIds = body.items.map((item) => item.product_id);
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .in('id', productIds)
      .eq('active', true);

    if (error || !products) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const lineItems = body.items.map((item) => {
      const product = productMap.get(item.product_id);
      if (!product) throw new Error(`Product not found: ${item.product_id}`);

      const variantLabel = item.variant ? ` (${item.variant})` : '';

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.name}${variantLabel}`,
            images: product.images?.[0] ? [product.images[0]] : [],
            metadata: {
              product_id: product.id,
              variant: item.variant || '',
              printify_product_id: product.printify_product_id || '',
            },
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.price_data.unit_amount * item.quantity,
      0
    );

    const shippingOptions = [
      {
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: { amount: 499, currency: 'usd' },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day' as const, value: 5 },
            maximum: { unit: 'business_day' as const, value: 10 },
          },
        },
      },
    ];

    // Free shipping for orders over $50
    if (subtotal >= 5000) {
      shippingOptions.unshift({
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Free Shipping (Orders over $50)',
          delivery_estimate: {
            minimum: { unit: 'business_day' as const, value: 7 },
            maximum: { unit: 'business_day' as const, value: 14 },
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: shippingOptions,
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        source: 'mainline_hub_web',
        items_json: JSON.stringify(
          body.items.map((item) => ({
            product_id: item.product_id,
            variant: item.variant,
            quantity: item.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
