'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const hasVariants = product.variants.length > 0 && product.variants[0]?.options?.length > 0;
    if (hasVariants) {
      window.location.href = `/products/${product.slug}`;
      return;
    }
    addItem(product);
  };

  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
  const isNew = Date.now() - new Date(product.created_at).getTime() < 14 * 24 * 60 * 60 * 1000;

  const quickAddLabel = product.variants.length > 0 && product.variants[0]?.options?.length > 0
    ? 'Select Options'
    : 'Quick Add';

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-bg-card hover:bg-bg-card-hover transition-colors duration-300 p-5 md:p-6 relative overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-square bg-[#1a1a1a] rounded-[4px] mb-4 md:mb-5 flex items-center justify-center overflow-hidden border border-border relative">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 550px) 100vw, (max-width: 900px) 50vw, 25vw"
          />
        ) : (
          <span className="text-3xl opacity-15">📦</span>
        )}
        {isOnSale && (
          <span className="absolute top-3 left-3 font-mono text-[0.65rem] tracking-[0.1em] uppercase bg-sale text-white px-2.5 py-1 rounded-[3px]">
            Sale
          </span>
        )}
        {!isOnSale && isNew && (
          <span className="absolute top-3 left-3 font-mono text-[0.65rem] tracking-[0.1em] uppercase bg-accent text-bg px-2.5 py-1 rounded-[3px]">
            New
          </span>
        )}
      </div>

      {/* Details */}
      <div className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-text-dim mb-1.5">
        {product.category}
      </div>
      <div className="text-[1rem] font-medium mb-3 leading-snug">
        {product.name}
      </div>
      <div className="font-mono text-[0.9rem] mb-3 md:mb-0">
        {isOnSale ? (
          <>
            <span className="line-through text-text-dim mr-2 text-[0.8rem]">
              {formatPriceFromDecimal(product.compare_at_price!)}
            </span>
            <span className="text-sale">{formatPriceFromDecimal(product.price)}</span>
          </>
        ) : (
          formatPriceFromDecimal(product.price)
        )}
      </div>

      {/* Mobile: persistent button */}
      <div
        onClick={handleQuickAdd}
        className="md:hidden mt-2 bg-accent text-bg font-mono text-[0.75rem] tracking-[0.1em] uppercase text-center py-2.5 rounded-[4px] cursor-pointer active:bg-white transition-colors"
      >
        {quickAddLabel}
      </div>

      {/* Desktop: hover slide-up */}
      <div
        onClick={handleQuickAdd}
        className="hidden md:block absolute bottom-0 left-0 right-0 bg-accent text-bg font-mono text-[0.75rem] tracking-[0.12em] uppercase text-center py-3.5 translate-y-full group-hover:translate-y-0 transition-transform duration-250 ease-out cursor-pointer"
      >
        {quickAddLabel}
      </div>
    </Link>
  );
}
