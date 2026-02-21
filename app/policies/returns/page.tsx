import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSPanel from '@/components/lcars/LCARSPanel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return Policy',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <LCARSBar color="pink">Return Policy</LCARSBar>

      <LCARSPanel color="pink" title="Returns & Exchanges">
        <div className="space-y-4 font-sans text-sm text-lcars-text-light/80 leading-relaxed">
          <p>
            We want you to be completely satisfied with your purchase from Mainline Hub.
            If you&apos;re not happy with your order, we&apos;re here to help.
          </p>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Return Window
          </h3>
          <p>
            You have 30 days from the date of delivery to initiate a return. Items must
            be unused, unworn, and in their original packaging.
          </p>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Print-on-Demand Items
          </h3>
          <p>
            Due to the custom nature of print-on-demand products, we can only accept returns
            for items that arrive damaged or with printing defects. Please contact us with
            photos of the defect within 7 days of receiving your order.
          </p>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            How to Return
          </h3>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Contact us at <span className="text-lcars-amber">support@mainlinehub.com</span> with your order number</li>
            <li>We&apos;ll provide you with a return shipping label</li>
            <li>Ship the item back in its original packaging</li>
            <li>Refund will be processed within 5-7 business days of receiving the return</li>
          </ol>

          <h3 className="font-mono text-xs uppercase tracking-widest text-lcars-amber mt-6">
            Refunds
          </h3>
          <p>
            Refunds will be issued to the original payment method. Shipping costs are
            non-refundable unless the return is due to our error.
          </p>
        </div>
      </LCARSPanel>
    </div>
  );
}
