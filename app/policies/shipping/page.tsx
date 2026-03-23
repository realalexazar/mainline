import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shipping Policy' };

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 pt-32 pb-20">
      <div className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text-dim mb-4">Policy</div>
      <h1 className="text-2xl font-light mb-8">Shipping</h1>

      <div className="space-y-6 text-[0.95rem] text-text-mid leading-relaxed">
        <p>
          All orders are processed within 1–3 business days. Print-on-demand items may
          require an additional 2–5 business days for production before shipping.
        </p>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Shipping Methods</h3>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong className="text-text">Standard Shipping:</strong> 5–10 business days — $4.99</li>
          <li><strong className="text-text">Free Shipping:</strong> Available on orders over $50 — 7–14 business days</li>
        </ul>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Shipping Destinations</h3>
        <p>We currently ship to addresses within the United States.</p>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Tracking</h3>
        <p>
          Once your order ships, you&apos;ll receive an email with tracking information.
          Please allow up to 48 hours for tracking numbers to become active.
        </p>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Questions?</h3>
        <p>Contact us at <span className="text-accent">support@mainline-hub.com</span>.</p>
      </div>
    </div>
  );
}
