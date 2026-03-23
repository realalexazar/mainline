'use client';

const categories = [
  'Tees & Apparel',
  'Kitchen Gadgets',
  'Posters & Art',
  'Hats & Headwear',
  'Stickers & Patches',
  'Mugs & Drinkware',
  'Home Goods',
  'Tech Accessories',
];

export default function Ticker() {
  const items = [...categories, ...categories];

  return (
    <div className="border-t border-b border-border overflow-hidden py-4">
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((cat, i) => (
          <span
            key={i}
            className="font-mono text-[0.75rem] tracking-[0.15em] uppercase text-text-dim px-10"
          >
            <span className="inline-block w-1 h-1 bg-accent rounded-full mr-6 align-middle" />
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
