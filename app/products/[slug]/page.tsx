export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase/server';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetail from './ProductDetail';

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error || !data) return null;
  return data as Product;
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  const { data } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(3);

  return (data as Product[]) || [];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.description || `Shop ${product.name} at Mainline Hub`,
    openGraph: {
      title: product.name,
      description: product.description || `Shop ${product.name} at Mainline Hub`,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return <ProductDetail product={product} relatedProducts={related} />;
}
