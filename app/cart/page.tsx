'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart';
import { formatPriceFromDecimal } from '@/lib/utils';
import CartItemRow from '@/components/CartItem';
import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSButton from '@/components/lcars/LCARSButton';
import LCARSPanel from '@/components/lcars/LCARSPanel';
import { useState } from 'react';

export default function CartPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const subtotal = getTotal();
  const shippingCost = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            variant: item.variant,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <LCARSBar color="blue">Cargo Bay</LCARSBar>
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="font-mono text-2xl text-lcars-blue tracking-wider">
            CARGO BAY EMPTY
          </div>
          <p className="font-mono text-sm text-lcars-orange/60 uppercase tracking-wider">
            No items detected in your cargo hold
          </p>
          <Link
            href="/products"
            className="inline-block bg-lcars-amber text-lcars-bg font-mono text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:brightness-110 transition-all"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LCARSBar color="blue">Cargo Bay &mdash; {items.length} Item{items.length !== 1 && 's'}</LCARSBar>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItemRow
              key={`${item.product_id}-${item.variant}`}
              item={item}
            />
          ))}
          <div className="pt-2">
            <LCARSButton color="red" size="sm" onClick={clearCart}>
              Clear All
            </LCARSButton>
          </div>
        </div>

        {/* Summary */}
        <div>
          <LCARSPanel color="amber" title="Order Summary">
            <div className="space-y-3">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-lcars-text-light/60 uppercase">Subtotal</span>
                <span className="text-lcars-text">{formatPriceFromDecimal(subtotal)}</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-lcars-text-light/60 uppercase">Shipping</span>
                <span className="text-lcars-text">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    formatPriceFromDecimal(shippingCost)
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="font-mono text-[10px] text-lcars-orange/40 uppercase">
                  Free shipping on orders over $50
                </p>
              )}
              <div className="border-t border-lcars-panel pt-3">
                <div className="flex justify-between font-mono text-lg">
                  <span className="text-lcars-text-light uppercase">Total</span>
                  <span className="text-lcars-peach">{formatPriceFromDecimal(total)}</span>
                </div>
              </div>
              <LCARSButton
                color="amber"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'INITIATING TRANSFER...' : 'PROCEED TO CHECKOUT'}
              </LCARSButton>
            </div>
          </LCARSPanel>
        </div>
      </div>
    </div>
  );
}
