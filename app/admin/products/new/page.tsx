'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../AdminAuthProvider';
import { slugify } from '@/lib/utils';

export default function NewProductPage() {
  const { token } = useAdminAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', description: '', price: '', compare_at_price: '',
    category: 'general', images: '', printify_product_id: '',
    active: true, featured: false, variants_json: '',
  });

  const update = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let variants = [];
      if (form.variants_json.trim()) variants = JSON.parse(form.variants_json);

      const images = form.images.split('\n').map((url) => url.trim()).filter(Boolean);

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name, slug: slugify(form.name), description: form.description || null,
          price: parseFloat(form.price), compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
          category: form.category, images, printify_product_id: form.printify_product_id || null,
          active: form.active, featured: form.featured, variants,
        }),
      });

      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Failed'); }
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally { setSaving(false); }
  };

  const inputClass = "w-full bg-bg-card border border-border rounded-[4px] px-4 py-2.5 text-[0.9rem] text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors";
  const labelClass = "block font-mono text-[0.65rem] uppercase tracking-wider text-text-dim mb-1";

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-mono text-[0.75rem] tracking-[0.15em] uppercase text-text-mid">New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={labelClass}>Name</label><input value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} required /></div>
        <div><label className={labelClass}>Description</label><textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Price</label><input type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} required /></div>
          <div><label className={labelClass}>Compare-at Price</label><input type="number" step="0.01" value={form.compare_at_price} onChange={(e) => update('compare_at_price', e.target.value)} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Category</label><input value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Image URLs (one per line)</label><textarea value={form.images} onChange={(e) => update('images', e.target.value)} rows={3} className={inputClass} /></div>
        <div><label className={labelClass}>Printify Product ID</label><input value={form.printify_product_id} onChange={(e) => update('printify_product_id', e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Variants JSON</label><textarea value={form.variants_json} onChange={(e) => update('variants_json', e.target.value)} rows={3} className={inputClass} placeholder='[{"name": "Size", "options": ["S", "M", "L", "XL"]}]' /></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} className="accent-accent" /><span className="text-[0.85rem] text-text-mid">Active</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="accent-accent" /><span className="text-[0.85rem] text-text-mid">Featured</span></label>
        </div>
        {error && <p className="text-[0.85rem] text-sale">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="font-mono text-[0.75rem] tracking-[0.1em] uppercase bg-accent text-bg px-6 py-2.5 rounded-[4px] hover:bg-white transition-all disabled:opacity-50">{saving ? 'Creating...' : 'Create Product'}</button>
          <button type="button" onClick={() => router.push('/admin/products')} className="font-mono text-[0.75rem] tracking-[0.1em] uppercase border border-border text-text-mid px-6 py-2.5 rounded-[4px] hover:border-border-hover transition-all">Cancel</button>
        </div>
      </form>
    </div>
  );
}
