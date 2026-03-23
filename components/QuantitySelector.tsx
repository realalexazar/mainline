'use client';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
}

export default function QuantitySelector({ quantity, onChange, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-border rounded-[4px]">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-text-mid hover:text-text transition-colors disabled:opacity-30 font-mono"
      >
        −
      </button>
      <span className="w-12 h-10 flex items-center justify-center font-mono text-[0.85rem] border-x border-border">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-text-mid hover:text-text transition-colors disabled:opacity-30 font-mono"
      >
        +
      </button>
    </div>
  );
}
