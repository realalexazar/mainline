export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Product } from '@/types';
import { getStardate } from '@/lib/utils';
import ProductGrid from '@/components/ProductGrid';
import LCARSBar from '@/components/lcars/LCARSBar';

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

async function getProductCount(): Promise<number> {
  const { count } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  return count || 0;
}

export default async function HomePage() {
  const [featured, productCount] = await Promise.all([
    getFeaturedProducts(),
    getProductCount(),
  ]);

  const stardate = getStardate();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-tl-lcars rounded-br-lcars border border-lcars-panel">
        <div className="h-2 bg-lcars-amber" />
        <div className="lcars-scanline p-8 md:p-16 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="font-mono text-4xl md:text-6xl text-lcars-amber tracking-wider lcars-glow">
              MAINLINE HUB
            </h1>
            <p className="font-mono text-sm md:text-base text-lcars-peach tracking-widest uppercase">
              General Merchandise &mdash; All Sectors
            </p>
          </div>
          <p className="font-sans text-lcars-text-light/70 max-w-xl mx-auto">
            Your one-stop supply depot for apparel, accessories, and essentials.
            Everything you need, delivered to your coordinates.
          </p>
          <Link
            href="/products"
            className="inline-block bg-lcars-amber text-lcars-bg font-mono text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:brightness-110 transition-all"
          >
            Browse Catalog
          </Link>
        </div>
        <div className="h-2 bg-lcars-orange" />
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="space-y-4">
          <LCARSBar color="blue">
            Featured Products &mdash; Stardate {stardate}
          </LCARSBar>
          <ProductGrid products={featured} />
        </section>
      )}

      {/* System Status */}
      <section className="space-y-4">
        <LCARSBar color="lavender">System Status</LCARSBar>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusReadout label="PRODUCTS ONLINE" value={String(productCount)} />
          <StatusReadout label="SECTORS ACTIVE" value="3" />
          <StatusReadout label="HUB STATUS" value="OPERATIONAL" color="text-emerald-400" />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <p className="font-mono text-xs text-lcars-orange/60 uppercase tracking-widest mb-4">
          New inventory arriving regularly — check back often
        </p>
        <Link
          href="/products"
          className="inline-block bg-lcars-blue text-lcars-text-light font-mono text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:brightness-110 transition-all"
        >
          Enter The Hub
        </Link>
      </section>
    </div>
  );
}

function StatusReadout({
  label,
  value,
  color = 'text-lcars-amber',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-lcars-panel border border-lcars-panel rounded-tl-lcars-sm rounded-br-lcars-sm p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-lcars-light-blue/60 mb-1">
        {label}
      </div>
      <div className={`font-mono text-2xl tracking-wider ${color}`}>{value}</div>
    </div>
  );
}
