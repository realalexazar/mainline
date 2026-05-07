import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    if (!body.name || typeof body.price !== 'number') {
      return NextResponse.json(
        { error: 'name and numeric price are required' },
        { status: 400 }
      );
    }

    const slug = body.slug || slugify(body.name);

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: body.name,
        slug,
        description: body.description || null,
        price: body.price,
        compare_at_price: body.compare_at_price || null,
        images: body.images || [],
        category: body.category || 'general',
        variants: body.variants || [],
        printify_product_id: body.printify_product_id || null,
        tiktok_shop_id: body.tiktok_shop_id || null,
        active: body.active ?? true,
        featured: body.featured ?? false,
        inventory_count: body.inventory_count ?? -1,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Create product error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
