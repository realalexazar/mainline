'use client';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
}

export default function QuantitySelector({ quantity, onChange, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-0">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="bg-lcars-panel border border-lcars-amber/30 text-lcars-amber w-10 h-10 rounded-l-full font-mono text-lg hover:bg-lcars-amber hover:text-lcars-bg transition-colors disabled:opacity-30"
      >
        -
      </button>
      <div className="bg-lcars-panel border-y border-lcars-amber/30 h-10 w-14 flex items-center justify-center font-mono text-sm text-lcars-text">
        {quantity}
      </div>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="bg-lcars-panel border border-lcars-amber/30 text-lcars-amber w-10 h-10 rounded-r-full font-mono text-lg hover:bg-lcars-amber hover:text-lcars-bg transition-colors disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
