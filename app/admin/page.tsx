'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from './AdminAuthProvider';
import Link from 'next/link';

export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const products = await productsRes.json();
        const orders = await ordersRes.json();
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
        });
      } catch { /* ignore */ }
    }
    if (token) fetchStats();
  }, [token]);

  return (
    <div className="space-y-6">
      <h1 className="font-mono text-[0.75rem] tracking-[0.15em] uppercase text-text-mid">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Products" value={stats.products} href="/admin/products" />
        <StatCard label="Orders" value={stats.orders} href="/admin/orders" />
        <div className="bg-bg-card border border-border rounded-[4px] p-6">
          <div className="font-mono text-[0.65rem] uppercase tracking-wider text-text-dim mb-2">Status</div>
          <div className="text-2xl font-light text-emerald-400">Operational</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="block bg-bg-card border border-border rounded-[4px] p-6 hover:border-border-hover transition-colors">
      <div className="font-mono text-[0.65rem] uppercase tracking-wider text-text-dim mb-2">{label}</div>
      <div className="text-3xl font-light">{value}</div>
    </Link>
  );
}
