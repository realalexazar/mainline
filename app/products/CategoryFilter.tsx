'use client';

import { useRouter, useSearchParams } from 'next/navigation';

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
      <button
        onClick={() => navigate({ category: undefined })}
        className={`px-4 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase rounded-[4px] border transition-all duration-200 ${
          !currentCategory || currentCategory === 'all'
            ? 'bg-accent text-bg border-accent'
            : 'bg-transparent text-text-mid border-border hover:border-border-hover'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => navigate({ category: cat })}
          className={`px-4 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase rounded-[4px] border transition-all duration-200 ${
            currentCategory === cat
              ? 'bg-accent text-bg border-accent'
              : 'bg-transparent text-text-mid border-border hover:border-border-hover'
          }`}
        >
          {cat}
        </button>
      ))}

      <div className="hidden md:block w-px h-5 bg-border mx-2" />

      {[
        { value: 'newest', label: 'Newest' },
        { value: 'price_asc', label: 'Price ↑' },
        { value: 'price_desc', label: 'Price ↓' },
      ].map((opt) => (
        <button
          key={opt.value}
          onClick={() => navigate({ sort: opt.value })}
          className={`px-4 py-1.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase rounded-[4px] border transition-all duration-200 ${
            currentSort === opt.value
              ? 'bg-text text-bg border-text'
              : 'bg-transparent text-text-dim border-border hover:border-border-hover'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
