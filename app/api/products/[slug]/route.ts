import { NextRequest, NextResponse } from 'next/server';
import { supabasePublic } from '@/lib/supabase/public';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { data, error } = await supabasePublic
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('active', true)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
