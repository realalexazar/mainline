'use client';

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
          <label className="block font-mono text-[0.7rem] tracking-[0.12em] uppercase text-text-dim mb-2">
            {variant.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                onClick={() => onSelect(option)}
                className={`px-4 py-2 rounded-[4px] font-mono text-[0.75rem] tracking-[0.08em] uppercase transition-all duration-200 border ${
                  selected === option
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-transparent text-text-mid border-border hover:border-border-hover'
                }`}
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
