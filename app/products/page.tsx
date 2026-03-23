export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase/server';
import { Product } from '@/types';
import ProductGrid from '@/components/ProductGrid';
import SectionHeader from '@/components/SectionHeader';
import CategoryFilter from './CategoryFilter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse the full Mainline Hub catalog. Apparel, home goods, accessories, and more.',
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
  return Array.from(new Set(data.map((p: { category: string }) => p.category)));
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, sort } = searchParams;
  const [products, categories] = await Promise.all([
    getProducts(category, sort),
    getCategories(),
  ]);

  return (
    <>
      <SectionHeader title="All Products" />
      <div className="max-w-content mx-auto px-6 md:px-10 pb-6">
        <CategoryFilter
          categories={categories}
          currentCategory={category}
          currentSort={sort}
        />
      </div>
      <ProductGrid products={products} columns={4} />
    </>
  );
}
