export const dynamic = 'force-dynamic';

import { stripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';
import ClearCart from './ClearCart';

export const metadata: Metadata = {
  title: 'Order Confirmed',
};

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20 text-center">
        <h1 className="text-2xl font-light mb-4">Something went wrong</h1>
        <p className="text-text-mid mb-8">Invalid session. No order data found.</p>
        <Link
          href="/"
          className="inline-block font-mono text-[0.8rem] tracking-[0.1em] uppercase bg-accent text-bg px-8 py-4 rounded-[4px]"
        >
          Return Home
        </Link>
      </div>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
  } catch {
    return (
      <div className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20 text-center">
        <h1 className="text-2xl font-light mb-4">Something went wrong</h1>
        <p className="text-text-mid mb-8">Could not retrieve order details.</p>
        <Link
          href="/"
          className="inline-block font-mono text-[0.8rem] tracking-[0.1em] uppercase bg-accent text-bg px-8 py-4 rounded-[4px]"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const lineItems = session.line_items?.data || [];

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 pt-32 pb-20">
      <ClearCart />

      <div className="text-center mb-12">
        <div className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-4">
          Order Confirmed
        </div>
        <h1 className="text-3xl font-light mb-3">Thanks for your order.</h1>
        <p className="text-text-mid">
          We&apos;ve received your order and it&apos;s being processed.
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-[4px] p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-[0.85rem]">
          <div>
            <span className="text-text-dim font-mono text-[0.7rem] uppercase tracking-wider">Customer</span>
            <div className="mt-1">{session.customer_details?.name || 'N/A'}</div>
          </div>
          <div>
            <span className="text-text-dim font-mono text-[0.7rem] uppercase tracking-wider">Email</span>
            <div className="mt-1">{session.customer_details?.email || 'N/A'}</div>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <div className="text-text-dim font-mono text-[0.7rem] uppercase tracking-wider">Items</div>
          {lineItems.map((item, i) => (
            <div key={i} className="flex justify-between text-[0.9rem]">
              <span className="text-text-mid">
                {item.description} &times; {item.quantity}
              </span>
              <span className="font-mono">{formatPrice(item.amount_total || 0)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-[1.1rem] font-medium">
            <span>Total</span>
            <span className="font-mono">{formatPrice(session.amount_total || 0)}</span>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-[4px] p-4">
          <div className="font-mono text-[0.7rem] uppercase tracking-wider text-text-mid">
            Estimated delivery: 5–14 business days
          </div>
          <div className="text-[0.7rem] text-text-dim mt-1">
            You&apos;ll receive tracking info via email once your order ships.
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-block font-mono text-[0.8rem] tracking-[0.1em] uppercase bg-accent text-bg px-8 py-4 rounded-[4px] hover:bg-white transition-all duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
