import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSPanel from '@/components/lcars/LCARSPanel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <LCARSBar color="lavender">Shipping Policy</LCARSBar>

      <LCARSPanel color="lavender" title="Delivery Information">
        <div className="space-y-4 font-sans text-sm text-lcars-text-light/80 leading-relaxed">
          <p>
            All orders placed through Mainline Hub are processed within 1-3 business days.
            Print-on-demand items may require an additional 2-5 business days for production
            before shipping.
          </p>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Shipping Methods
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong className="text-lcars-peach">Standard Shipping:</strong> 5-10 business days — $4.99
            </li>
            <li>
              <strong className="text-lcars-peach">Free Shipping:</strong> Available on orders over $50 — 7-14 business days
            </li>
          </ul>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Shipping Destinations
          </h3>
          <p>
            We currently ship to addresses within the United States. International shipping
            will be available in a future update.
          </p>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Order Tracking
          </h3>
          <p>
            Once your order ships, you will receive an email with tracking information.
            Please allow up to 48 hours after shipment for tracking numbers to become active.
          </p>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Questions?
          </h3>
          <p>
            If you have any questions about shipping, please contact us at{' '}
            <span className="text-lcars-amber">support@mainlinehub.com</span>.
          </p>
        </div>
      </LCARSPanel>
    </div>
  );
}
