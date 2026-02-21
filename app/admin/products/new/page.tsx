'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../AdminAuthProvider';
import { slugify } from '@/lib/utils';
import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSInput from '@/components/lcars/LCARSInput';
import LCARSButton from '@/components/lcars/LCARSButton';

export default function NewProductPage() {
  const { token } = useAdminAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compare_at_price: '',
    category: 'general',
    images: '',
    printify_product_id: '',
    active: true,
    featured: false,
    variants_json: '',
  });

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let variants = [];
      if (form.variants_json.trim()) {
        variants = JSON.parse(form.variants_json);
      }

      const images = form.images
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          slug: slugify(form.name),
          description: form.description || null,
          price: parseFloat(form.price),
          compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
          category: form.category,
          images,
          printify_product_id: form.printify_product_id || null,
          active: form.active,
          featured: form.featured,
          variants,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <LCARSBar color="blue">New Product</LCARSBar>

      <form onSubmit={handleSubmit} className="space-y-4">
        <LCARSInput
          id="name"
          label="Product Name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g. Where's Nancy? Tee"
          required
        />

        <div className="space-y-1">
          <label className="block font-mono text-xs uppercase tracking-widest text-lcars-text-light">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className="w-full bg-lcars-panel border border-lcars-amber rounded-lcars-sm px-4 py-2 font-mono text-sm text-lcars-text placeholder:text-lcars-orange/40 focus:outline-none focus:border-lcars-peach transition-colors"
            placeholder="Product description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <LCARSInput
            id="price"
            label="Price (USD)"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="24.99"
            required
          />
          <LCARSInput
            id="compare_price"
            label="Compare-at Price"
            type="number"
            step="0.01"
            value={form.compare_at_price}
            onChange={(e) => update('compare_at_price', e.target.value)}
            placeholder="29.99"
          />
        </div>

        <LCARSInput
          id="category"
          label="Category"
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          placeholder="general, tees, accessories"
        />

        <div className="space-y-1">
          <label className="block font-mono text-xs uppercase tracking-widest text-lcars-text-light">
            Image URLs (one per line)
          </label>
          <textarea
            value={form.images}
            onChange={(e) => update('images', e.target.value)}
            rows={3}
            className="w-full bg-lcars-panel border border-lcars-amber rounded-lcars-sm px-4 py-2 font-mono text-sm text-lcars-text placeholder:text-lcars-orange/40 focus:outline-none focus:border-lcars-peach transition-colors"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <LCARSInput
          id="printify_id"
          label="Printify Product ID (optional)"
          value={form.printify_product_id}
          onChange={(e) => update('printify_product_id', e.target.value)}
          placeholder="For print-on-demand items"
        />

        <div className="space-y-1">
          <label className="block font-mono text-xs uppercase tracking-widest text-lcars-text-light">
            Variants JSON (optional)
          </label>
          <textarea
            value={form.variants_json}
            onChange={(e) => update('variants_json', e.target.value)}
            rows={4}
            className="w-full bg-lcars-panel border border-lcars-amber rounded-lcars-sm px-4 py-2 font-mono text-sm text-lcars-text placeholder:text-lcars-orange/40 focus:outline-none focus:border-lcars-peach transition-colors"
            placeholder='[{"name": "Size", "options": ["S", "M", "L", "XL", "2XL"]}]'
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => update('active', e.target.checked)}
              className="accent-lcars-amber"
            />
            <span className="font-mono text-xs uppercase text-lcars-text-light">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
              className="accent-lcars-amber"
            />
            <span className="font-mono text-xs uppercase text-lcars-text-light">Featured</span>
          </label>
        </div>

        {error && (
          <p className="font-mono text-xs text-lcars-red uppercase">{error}</p>
        )}

        <div className="flex gap-3">
          <LCARSButton type="submit" color="amber" disabled={saving}>
            {saving ? 'Creating...' : 'Create Product'}
          </LCARSButton>
          <LCARSButton
            type="button"
            color="orange"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </LCARSButton>
        </div>
      </form>
    </div>
  );
}
