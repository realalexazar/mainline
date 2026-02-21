'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import QuantitySelector from './QuantitySelector';
import LCARSButton from './lcars/LCARSButton';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemRow({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 p-4 border border-lcars-panel rounded-tl-lcars-sm rounded-br-lcars-sm">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 shrink-0 bg-lcars-panel rounded-lcars-sm overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[8px] text-lcars-orange/40">N/A</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="font-mono text-sm uppercase tracking-wider text-lcars-text hover:text-lcars-peach transition-colors truncate block"
        >
          {item.name}
        </Link>
        {item.variant && (
          <span className="font-mono text-xs text-lcars-light-blue uppercase">
            {item.variant}
          </span>
        )}
        <div className="mt-2 flex items-center gap-4">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(q) => updateQuantity(item.product_id, item.variant, q)}
          />
          <LCARSButton
            color="red"
            size="sm"
            onClick={() => removeItem(item.product_id, item.variant)}
          >
            REMOVE
          </LCARSButton>
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <span className="font-mono text-sm text-lcars-peach">
          {formatPriceFromDecimal(item.price * item.quantity)}
        </span>
        {item.quantity > 1 && (
          <div className="font-mono text-[10px] text-lcars-orange/60">
            {formatPriceFromDecimal(item.price)} each
          </div>
        )}
      </div>
    </div>
  );
}
