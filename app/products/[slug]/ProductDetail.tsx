'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import LCARSButton from '@/components/lcars/LCARSButton';
import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSPanel from '@/components/lcars/LCARSPanel';
import VariantSelector from '@/components/VariantSelector';
import QuantitySelector from '@/components/QuantitySelector';
import ProductGrid from '@/components/ProductGrid';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const hasVariants = product.variants.length > 0 && product.variants[0]?.options?.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    hasVariants ? null : null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-lcars-panel rounded-tl-lcars rounded-br-lcars overflow-hidden border border-lcars-panel">
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
                <span className="font-mono text-sm text-lcars-orange/40 uppercase">
                  No Image Available
                </span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative w-16 h-16 shrink-0 rounded-lcars-sm overflow-hidden border-2 transition-colors ${
                    i === currentImage ? 'border-lcars-amber' : 'border-lcars-panel'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-lcars-orange/60 mb-1">
              {product.category}
            </div>
            <h1 className="font-mono text-2xl md:text-3xl uppercase tracking-wider text-lcars-amber">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-3xl text-lcars-peach">
              {formatPriceFromDecimal(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="font-mono text-lg text-lcars-orange/50 line-through">
                {formatPriceFromDecimal(product.compare_at_price)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="font-sans text-sm text-lcars-text-light/80 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Variants */}
          {hasVariants && (
            <VariantSelector
              variants={product.variants}
              selected={selectedVariant}
              onSelect={setSelectedVariant}
            />
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-widest text-lcars-text-light">
              Quantity
            </label>
            <QuantitySelector quantity={quantity} onChange={setQuantity} />
          </div>

          {/* Add to Cart */}
          <LCARSButton
            color={added ? 'blue' : 'amber'}
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            disabled={hasVariants && !selectedVariant}
          >
            {added
              ? 'ADDED TO CARGO BAY'
              : hasVariants && !selectedVariant
              ? 'SELECT A VARIANT'
              : 'ADD TO CART'}
          </LCARSButton>
        </div>
      </div>

      {/* Specifications */}
      <div>
        <button
          onClick={() => setSpecsOpen(!specsOpen)}
          className="w-full"
        >
          <LCARSBar color="orange">
            <span className="flex-1 text-left">Product Specifications</span>
            <span className="text-lcars-bg/60">{specsOpen ? '▲' : '▼'}</span>
          </LCARSBar>
        </button>
        {specsOpen && (
          <LCARSPanel color="orange" className="mt-2 animate-slide-in-up">
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-lcars-orange/60 uppercase">Category</span>
                <div className="text-lcars-text">{product.category}</div>
              </div>
              <div>
                <span className="text-lcars-orange/60 uppercase">SKU</span>
                <div className="text-lcars-text">{product.id.slice(0, 8).toUpperCase()}</div>
              </div>
              {product.printify_product_id && (
                <div>
                  <span className="text-lcars-orange/60 uppercase">Fulfillment</span>
                  <div className="text-lcars-text">Print-on-Demand</div>
                </div>
              )}
              <div>
                <span className="text-lcars-orange/60 uppercase">Availability</span>
                <div className="text-lcars-text">
                  {product.inventory_count === -1 ? 'Made to Order' : `${product.inventory_count} in Stock`}
                </div>
              </div>
            </div>
          </LCARSPanel>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <LCARSBar color="blue">Related Products</LCARSBar>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
