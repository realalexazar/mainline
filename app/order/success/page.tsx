export const dynamic = 'force-dynamic';

import { stripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/utils';
import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSPanel from '@/components/lcars/LCARSPanel';
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
      <div className="space-y-6">
        <LCARSBar color="red">Error</LCARSBar>
        <p className="font-mono text-sm text-lcars-red">Invalid session. No order data found.</p>
        <Link
          href="/"
          className="inline-block bg-lcars-amber text-lcars-bg font-mono text-sm uppercase tracking-widest px-8 py-3 rounded-full"
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
      <div className="space-y-6">
        <LCARSBar color="red">Error</LCARSBar>
        <p className="font-mono text-sm text-lcars-red">Could not retrieve order details.</p>
        <Link
          href="/"
          className="inline-block bg-lcars-amber text-lcars-bg font-mono text-sm uppercase tracking-widest px-8 py-3 rounded-full"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const lineItems = session.line_items?.data || [];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ClearCart />

      <LCARSBar color="blue">Transmission Received</LCARSBar>

      <LCARSPanel color="blue" title="Order Confirmed">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-mono text-2xl text-lcars-blue tracking-wider">
              ORDER CONFIRMED
            </h1>
            <p className="font-mono text-xs text-lcars-text-light/60 uppercase tracking-widest">
              Your transmission has been received and is being processed
            </p>
          </div>

          {/* Order details */}
          <div className="space-y-3 border-t border-lcars-panel pt-4">
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div>
                <span className="text-lcars-orange/60 uppercase">Customer</span>
                <div className="text-lcars-text">{session.customer_details?.name || 'N/A'}</div>
              </div>
              <div>
                <span className="text-lcars-orange/60 uppercase">Email</span>
                <div className="text-lcars-text">{session.customer_details?.email || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-lcars-panel pt-4 space-y-2">
            <div className="font-mono text-xs text-lcars-orange/60 uppercase">Items</div>
            {lineItems.map((item, i) => (
              <div key={i} className="flex justify-between font-mono text-sm">
                <span className="text-lcars-text-light">
                  {item.description} &times; {item.quantity}
                </span>
                <span className="text-lcars-peach">
                  {formatPrice(item.amount_total || 0)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-lcars-panel pt-4">
            <div className="flex justify-between font-mono text-lg">
              <span className="text-lcars-text-light uppercase">Total Paid</span>
              <span className="text-lcars-peach">
                {formatPrice(session.amount_total || 0)}
              </span>
            </div>
          </div>

          {/* Shipping estimate */}
          <div className="bg-lcars-panel rounded-lcars-sm p-4">
            <div className="font-mono text-xs text-lcars-light-blue uppercase tracking-wider">
              Estimated Delivery: 5-14 Business Days
            </div>
            <div className="font-mono text-[10px] text-lcars-orange/40 mt-1">
              You will receive tracking information via email once your order ships.
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/products"
              className="inline-block bg-lcars-amber text-lcars-bg font-mono text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:brightness-110 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </LCARSPanel>
    </div>
  );
}
