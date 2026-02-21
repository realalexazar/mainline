'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';
import LCARSButton from './lcars/LCARSButton';
import { useCartStore } from '@/stores/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const hasVariants = product.variants.length > 0 && product.variants[0]?.options?.length > 0;
    if (hasVariants) {
      window.location.href = `/products/${product.slug}`;
      return;
    }
    addItem(product);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-lcars-bg border border-lcars-panel rounded-tl-lcars rounded-br-lcars overflow-hidden transition-all hover:border-lcars-amber/50"
    >
      {/* Colored top bar */}
      <div className="h-2 bg-lcars-amber group-hover:bg-lcars-peach transition-colors" />

      {/* Image */}
      <div className="relative aspect-square bg-lcars-panel">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-lcars-orange/40 uppercase">No Image</span>
          </div>
        )}
        {product.compare_at_price && product.compare_at_price > product.price && (
          <div className="absolute top-2 right-2 bg-lcars-red text-white font-mono text-[10px] px-2 py-0.5 rounded-full uppercase">
            Sale
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-mono text-sm uppercase tracking-wider text-lcars-text truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg text-lcars-peach">
            {formatPriceFromDecimal(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="font-mono text-xs text-lcars-orange/50 line-through">
              {formatPriceFromDecimal(product.compare_at_price)}
            </span>
          )}
        </div>
        <LCARSButton
          color="amber"
          size="sm"
          fullWidth
          onClick={handleAddToCart}
        >
          {product.variants.length > 0 && product.variants[0]?.options?.length > 0
            ? 'SELECT OPTIONS'
            : 'ADD TO CART'}
        </LCARSButton>
      </div>
    </Link>
  );
}
