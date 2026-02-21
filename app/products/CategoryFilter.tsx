'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  currentCategory?: string;
  currentSort?: string;
}

export default function CategoryFilter({
  categories,
  currentCategory,
  currentSort,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
    }
    router.push(`/products?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category pills */}
      <button
        onClick={() => navigate({ category: undefined })}
        className={cn(
          'rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all',
          !currentCategory || currentCategory === 'all'
            ? 'bg-lcars-amber text-lcars-bg'
            : 'bg-lcars-panel text-lcars-text border border-lcars-amber/30 hover:border-lcars-amber'
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => navigate({ category: cat })}
          className={cn(
            'rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all',
            currentCategory === cat
              ? 'bg-lcars-amber text-lcars-bg'
              : 'bg-lcars-panel text-lcars-text border border-lcars-amber/30 hover:border-lcars-amber'
          )}
        >
          {cat}
        </button>
      ))}

      {/* Sort divider */}
      <div className="hidden md:block w-px h-6 bg-lcars-panel mx-2" />

      {/* Sort pills */}
      {[
        { value: 'newest', label: 'Newest' },
        { value: 'price_asc', label: 'Price ↑' },
        { value: 'price_desc', label: 'Price ↓' },
      ].map((opt) => (
        <button
          key={opt.value}
          onClick={() => navigate({ sort: opt.value })}
          className={cn(
            'rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all',
            currentSort === opt.value
              ? 'bg-lcars-blue text-lcars-bg'
              : 'bg-lcars-panel text-lcars-text border border-lcars-blue/30 hover:border-lcars-blue'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
