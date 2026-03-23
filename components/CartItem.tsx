'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemRow({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 p-4 bg-bg-card border border-border rounded-[4px]">
      <div className="relative w-20 h-20 shrink-0 bg-[#1a1a1a] rounded-[4px] overflow-hidden border border-border">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg opacity-15">📦</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="text-[0.9rem] font-medium hover:text-accent transition-colors truncate block"
        >
          {item.name}
        </Link>
        {item.variant && (
          <span className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-text-dim">
            {item.variant}
          </span>
        )}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center border border-border rounded-[4px]">
            <button
              onClick={() => updateQuantity(item.product_id, item.variant, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-text-mid hover:text-text transition-colors disabled:opacity-30"
            >
              −
            </button>
            <span className="w-8 h-8 flex items-center justify-center font-mono text-[0.8rem] border-x border-border">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product_id, item.variant, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-text-mid hover:text-text transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(item.product_id, item.variant)}
            className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-text-dim hover:text-sale transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="font-mono text-[0.9rem]">
          {formatPriceFromDecimal(item.price * item.quantity)}
        </span>
        {item.quantity > 1 && (
          <div className="font-mono text-[0.7rem] text-text-dim">
            {formatPriceFromDecimal(item.price)} each
          </div>
        )}
      </div>
    </div>
  );
}
