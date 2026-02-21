export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase/server';
import { Product } from '@/types';
import { getStardate } from '@/lib/utils';
import ProductGrid from '@/components/ProductGrid';
import LCARSBar from '@/components/lcars/LCARSBar';
import CategoryFilter from './CategoryFilter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Catalog',
  description: 'Browse the full Mainline Hub product catalog. Apparel, accessories, and more.',
};

interface ProductsPageProps {
  searchParams: { category?: string; sort?: string };
}

async function getProducts(category?: string, sort?: string): Promise<Product[]> {
  let query = supabaseAdmin
    .from('products')
    .select('*')
    .eq('active', true);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as Product[];
}

async function getCategories(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('products')
    .select('category')
    .eq('active', true);

  if (!data) return [];
  const cats = Array.from(new Set(data.map((p: { category: string }) => p.category)));
  return cats;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort } = searchParams;
  const [products, categories] = await Promise.all([
    getProducts(category, sort),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <LCARSBar color="amber">
        Product Catalog &mdash; Stardate {getStardate()}
      </LCARSBar>

      <CategoryFilter
        categories={categories}
        currentCategory={category}
        currentSort={sort}
      />

      <ProductGrid products={products} />
    </div>
  );
}
