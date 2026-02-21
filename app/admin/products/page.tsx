'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '../AdminAuthProvider';
import { Product } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';
import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSButton from '@/components/lcars/LCARSButton';

export default function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_products() {
      try {
        const res = await fetch('/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetch_products();
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
        <LCARSBar color="amber" className="flex-1">
          Products
        </LCARSBar>
        <Link href="/admin/products/new" className="ml-4">
          <LCARSButton color="blue" size="sm">
            + New Product
          </LCARSButton>
        </Link>
      </div>

      {loading ? (
        <div className="font-mono text-sm text-lcars-amber animate-lcars-pulse uppercase tracking-widest text-center py-10">
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 font-mono text-sm text-lcars-orange/60 uppercase">
          No products found. Create your first product.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-lcars-panel">
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Name
                </th>
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Price
                </th>
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Category
                </th>
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Status
                </th>
                <th className="text-right font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-lcars-panel/50 hover:bg-lcars-panel/30">
                  <td className="py-3 px-3">
                    <div className="font-mono text-sm text-lcars-text">{product.name}</div>
                    <div className="font-mono text-[10px] text-lcars-orange/40">{product.slug}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-sm text-lcars-peach">
                    {formatPriceFromDecimal(product.price)}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-lcars-blue uppercase">
                    {product.category}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono text-xs uppercase ${
                        product.active ? 'text-emerald-400' : 'text-lcars-red'
                      }`}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                    {product.featured && (
                      <span className="ml-2 font-mono text-[10px] text-lcars-tan uppercase">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <LCARSButton color="blue" size="sm">Edit</LCARSButton>
                    </Link>
                    <LCARSButton color="red" size="sm" onClick={() => handleDelete(product.id)}>
                      Delete
                    </LCARSButton>
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
