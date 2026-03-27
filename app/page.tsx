export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Product } from '@/types';
import ProductGrid from '@/components/ProductGrid';
import SectionHeader from '@/components/SectionHeader';
import Ticker from '@/components/Ticker';
import CategoryCard from '@/components/CategoryCard';
import Banner from '@/components/Banner';

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('featured', true)
    .limit(4);

  if (error || !data) return [];
  return data as Product[];
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-36 pb-20 md:pb-24 px-6 md:px-10 max-w-content mx-auto">
        <div
          className="font-mono text-[0.75rem] md:text-[0.8rem] tracking-[0.2em] uppercase text-accent mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          New drops weekly
        </div>
        <h1
          className="text-[clamp(3.2rem,8vw,6.5rem)] font-headline font-medium leading-[0.95] tracking-[-0.05em] max-w-[850px] opacity-0 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          Good stuff.<br />
          <span className="font-headline italic text-text-mid">No theme required.</span>
        </h1>
        <p
          className="mt-8 text-[1.05rem] md:text-[1.15rem] text-text-mid max-w-[500px] leading-relaxed opacity-0 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          Apparel, home goods, accessories, art, and whatever else we think is worth
          owning. Curated for people with taste and no patience for boring stores.
        </p>
        <Link
          href="/products"
          className="group mt-10 inline-flex items-center gap-3 font-mono text-[0.85rem] tracking-[0.1em] uppercase bg-accent text-bg px-8 py-4 rounded-[4px] hover:bg-white transition-all duration-250 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.8s' }}
        >
          Shop Everything
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </Link>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* Featured Products */}
      <SectionHeader title="Featured" linkText="View All →" linkHref="/products" />
      <ProductGrid products={featured} columns={4} />

      {/* Categories */}
      <SectionHeader title="Shop by Category" linkText="All Categories →" linkHref="/products" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border max-w-content mx-auto">
        <CategoryCard icon="👕" name="Apparel" subtitle="Tees, hoodies, hats" href="/products?category=tees" />
        <CategoryCard icon="🏠" name="Home + Goods" subtitle="Kitchen, mugs, decor" href="/products?category=home" />
        <CategoryCard icon="🎨" name="Art + Prints" subtitle="Posters, stickers, patches" href="/products?category=accessories" />
      </div>

      {/* Banner */}
      <Banner />
    </>
  );
}
