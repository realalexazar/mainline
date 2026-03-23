import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Return Policy' };

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 pt-32 pb-20">
      <div className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text-dim mb-4">Policy</div>
      <h1 className="text-2xl font-light mb-8">Returns & Exchanges</h1>

      <div className="space-y-6 text-[0.95rem] text-text-mid leading-relaxed">
        <p>
          We want you to be happy with your purchase. If something isn&apos;t right,
          we&apos;re here to help.
        </p>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Return Window</h3>
        <p>
          You have 30 days from delivery to initiate a return. Items must be unused,
          unworn, and in original packaging.
        </p>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Print-on-Demand Items</h3>
        <p>
          Due to the custom nature of POD products, we only accept returns for items
          that arrive damaged or with printing defects. Contact us with photos within 7 days.
        </p>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">How to Return</h3>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>Email <span className="text-accent">support@mainline-hub.com</span> with your order number</li>
          <li>We&apos;ll send you a return shipping label</li>
          <li>Ship the item back in its original packaging</li>
          <li>Refund processed within 5–7 business days of receipt</li>
        </ol>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Refunds</h3>
        <p>
          Refunds go to the original payment method. Shipping costs are non-refundable
          unless the return is due to our error.
        </p>
      </div>
    </div>
  );
}
