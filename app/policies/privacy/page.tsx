import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSPanel from '@/components/lcars/LCARSPanel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <LCARSBar color="peach">Privacy Policy</LCARSBar>

      <LCARSPanel color="peach" title="Data Protection">
        <div className="space-y-4 font-sans text-sm text-lcars-text-light/80 leading-relaxed">
          <p>
            Your privacy is important to us. This policy describes how Mainline Hub
            collects, uses, and protects your personal information.
          </p>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Information We Collect
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Name and email address (when placing an order)</li>
            <li>Shipping address (for order delivery)</li>
            <li>Payment information (processed securely by Stripe — we never store card details)</li>
            <li>Browsing data and cookies (for site functionality and analytics)</li>
          </ul>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            How We Use Your Information
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>To process and fulfill your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To improve our store and your shopping experience</li>
            <li>To comply with legal requirements</li>
          </ul>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Third-Party Services
          </h3>
          <p>
            We use the following third-party services to operate our store:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong className="text-lcars-peach">Stripe</strong> — Payment processing</li>
            <li><strong className="text-lcars-peach">Supabase</strong> — Database and authentication</li>
            <li><strong className="text-lcars-peach">Printify</strong> — Print-on-demand fulfillment</li>
            <li><strong className="text-lcars-peach">Vercel</strong> — Website hosting</li>
          </ul>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Data Security
          </h3>
          <p>
            We implement industry-standard security measures to protect your personal
            information. All payment transactions are encrypted and processed through Stripe.
          </p>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Contact
          </h3>
          <p>
            If you have questions about this privacy policy, contact us at{' '}
            <span className="text-lcars-amber">support@mainlinehub.com</span>.
          </p>
        </div>
      </LCARSPanel>
    </div>
  );
}
