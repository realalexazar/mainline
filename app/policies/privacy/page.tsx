import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-10 pt-32 pb-20">
      <div className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text-dim mb-4">Policy</div>
      <h1 className="text-2xl font-light mb-8">Privacy</h1>

      <div className="space-y-6 text-[0.95rem] text-text-mid leading-relaxed">
        <p>
          Your privacy matters. This policy describes how Mainline Hub collects,
          uses, and protects your personal information.
        </p>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">What We Collect</h3>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>Name and email address (when placing an order)</li>
          <li>Shipping address (for delivery)</li>
          <li>Payment info (processed securely by Stripe — we never store card details)</li>
          <li>Browsing data and cookies (for site functionality)</li>
        </ul>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">How We Use It</h3>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>To process and fulfill your orders</li>
          <li>To send order confirmations and shipping updates</li>
          <li>To improve our store experience</li>
          <li>To comply with legal requirements</li>
        </ul>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Third Parties</h3>
        <p>We use Stripe (payments), Supabase (database), Printify (fulfillment), and Vercel (hosting).</p>

        <h3 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text mt-8">Contact</h3>
        <p>Questions? Email <span className="text-accent">support@mainline-hub.com</span>.</p>
      </div>
    </div>
  );
}
