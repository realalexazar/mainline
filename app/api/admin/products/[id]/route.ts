import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    // Whitelist updatable fields - never let a client overwrite ids,
    // timestamps, or arbitrary unknown columns.
    const updates: Record<string, unknown> = {};
    const allowed = [
      'name',
      'slug',
      'description',
      'price',
      'compare_at_price',
      'images',
      'category',
      'variants',
      'printify_product_id',
      'tiktok_shop_id',
      'active',
      'featured',
      'inventory_count',
      'metadata',
    ] as const;
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  // Soft delete: keep the row so historical orders still resolve names.
  const { error } = await supabaseAdmin
    .from('products')
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
