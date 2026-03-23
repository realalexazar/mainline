'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart';
import { formatPriceFromDecimal } from '@/lib/utils';
import CartItemRow from '@/components/CartItem';
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
      <div className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <div className="text-center py-20 space-y-6">
          <h1 className="text-2xl font-light">Your cart is empty</h1>
          <p className="text-text-mid text-[0.95rem]">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link
            href="/products"
            className="inline-block font-mono text-[0.8rem] tracking-[0.1em] uppercase bg-accent text-bg px-8 py-4 rounded-[4px] hover:bg-white transition-all duration-200"
          >
            Shop Everything
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-mono text-[0.75rem] tracking-[0.15em] uppercase text-text-mid">
          Cart — {items.length} item{items.length !== 1 && 's'}
        </h1>
        <button
          onClick={clearCart}
          className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-text-dim hover:text-sale transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItemRow key={`${item.product_id}-${item.variant}`} item={item} />
          ))}
        </div>

        <div className="bg-bg-card border border-border rounded-[4px] p-6 h-fit">
          <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text-dim mb-6">
            Order Summary
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[0.9rem]">
              <span className="text-text-mid">Subtotal</span>
              <span>{formatPriceFromDecimal(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[0.9rem]">
              <span className="text-text-mid">Shipping</span>
              <span>
                {shippingCost === 0 ? (
                  <span className="text-accent">FREE</span>
                ) : (
                  formatPriceFromDecimal(shippingCost)
                )}
              </span>
            </div>
            {shippingCost > 0 && (
              <p className="text-[0.7rem] text-text-dim">
                Free shipping on orders over $50
              </p>
            )}
            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-[1.1rem] font-medium">
                <span>Total</span>
                <span>{formatPriceFromDecimal(total)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-4 font-mono text-[0.8rem] tracking-[0.1em] uppercase bg-accent text-bg py-4 rounded-[4px] hover:bg-white transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
