'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '../AdminAuthProvider';
import { Product } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';

export default function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    if (token) fetchProducts();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-[0.75rem] tracking-[0.15em] uppercase text-text-mid">Products</h1>
        <Link
          href="/admin/products/new"
          className="font-mono text-[0.7rem] tracking-[0.1em] uppercase bg-accent text-bg px-4 py-2 rounded-[4px] hover:bg-white transition-all"
        >
          + New Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-text-dim font-mono text-[0.8rem] uppercase">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-text-dim text-[0.85rem]">No products yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Name', 'Price', 'Category', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left font-mono text-[0.65rem] uppercase tracking-wider text-text-dim py-2 px-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border/50 hover:bg-bg-card/50">
                  <td className="py-3 px-3">
                    <div className="text-[0.9rem]">{product.name}</div>
                    <div className="text-[0.7rem] text-text-dim">{product.slug}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[0.85rem]">
                    {formatPriceFromDecimal(product.price)}
                  </td>
                  <td className="py-3 px-3 font-mono text-[0.75rem] uppercase text-text-dim">
                    {product.category}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-mono text-[0.7rem] uppercase ${product.active ? 'text-emerald-400' : 'text-sale'}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3 space-x-2">
                    <Link href={`/admin/products/${product.id}`} className="font-mono text-[0.7rem] text-text-mid hover:text-accent transition-colors">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="font-mono text-[0.7rem] text-text-dim hover:text-sale transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
