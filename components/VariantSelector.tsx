'use client';

import { cn } from '@/lib/utils';
import { ProductVariant } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export default function VariantSelector({ variants, selected, onSelect }: VariantSelectorProps) {
  if (!variants.length) return null;

  return (
    <div className="space-y-3">
      {variants.map((variant) => (
        <div key={variant.name}>
          <label className="block font-mono text-xs uppercase tracking-widest text-lcars-text-light mb-2">
            {variant.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                onClick={() => onSelect(option)}
                className={cn(
                  'px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all',
                  selected === option
                    ? 'bg-lcars-amber text-lcars-bg'
                    : 'bg-lcars-panel text-lcars-text border border-lcars-amber/30 hover:border-lcars-amber'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
