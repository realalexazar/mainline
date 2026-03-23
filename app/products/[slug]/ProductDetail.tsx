'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import VariantSelector from '@/components/VariantSelector';
import QuantitySelector from '@/components/QuantitySelector';
import ProductGrid from '@/components/ProductGrid';
import SectionHeader from '@/components/SectionHeader';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const hasVariants = product.variants.length > 0 && product.variants[0]?.options?.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <>
      <div className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square bg-bg-card rounded-[4px] border border-border overflow-hidden relative">
              {product.images[currentImage] ? (
                <Image
                  src={product.images[currentImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-15">📦</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative w-16 h-16 shrink-0 rounded-[4px] overflow-hidden border transition-colors ${
                      i === currentImage ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-text-dim mb-2">
                {product.category}
              </div>
              <h1 className="text-2xl md:text-3xl font-medium leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {isOnSale ? (
                <>
                  <span className="font-mono text-[1rem] line-through text-text-dim">
                    {formatPriceFromDecimal(product.compare_at_price!)}
                  </span>
                  <span className="font-mono text-[1.5rem] text-sale">
                    {formatPriceFromDecimal(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-mono text-[1.5rem]">
                  {formatPriceFromDecimal(product.price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-[0.95rem] text-text-mid leading-relaxed">
                {product.description}
              </p>
            )}

            {hasVariants && (
              <VariantSelector
                variants={product.variants}
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />
            )}

            <div className="space-y-2">
              <label className="block font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text-dim">
                Quantity
              </label>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={hasVariants && !selectedVariant}
              className={`w-full font-mono text-[0.8rem] tracking-[0.1em] uppercase py-4 rounded-[4px] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                added
                  ? 'bg-text text-bg'
                  : 'bg-accent text-bg hover:bg-white'
              }`}
            >
              {added
                ? 'Added to Cart ✓'
                : hasVariants && !selectedVariant
                ? 'Select a Size'
                : 'Add to Cart'}
            </button>

            {/* Specs */}
            <div className="border-t border-border pt-6 mt-8">
              <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text-dim mb-4">
                Details
              </div>
              <div className="grid grid-cols-2 gap-4 text-[0.85rem]">
                <div>
                  <span className="text-text-dim">Category</span>
                  <div className="text-text mt-0.5">{product.category}</div>
                </div>
                <div>
                  <span className="text-text-dim">Availability</span>
                  <div className="text-text mt-0.5">
                    {product.inventory_count === -1 ? 'Made to order' : `${product.inventory_count} in stock`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <>
          <SectionHeader title="You Might Also Like" />
          <ProductGrid products={relatedProducts} columns={4} />
        </>
      )}
    </>
  );
}
