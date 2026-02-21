'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from './AdminAuthProvider';
import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSPanel from '@/components/lcars/LCARSPanel';
import Link from 'next/link';

export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/admin/orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
        });
      } catch {
        console.error('Failed to fetch stats');
      }
    }

    if (token) fetchStats();
  }, [token]);

  return (
    <div className="space-y-6">
      <LCARSBar color="red">Admin Dashboard</LCARSBar>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LCARSPanel color="amber" title="Products">
          <div className="font-mono text-3xl text-lcars-amber">{stats.products}</div>
          <Link href="/admin/products" className="font-mono text-xs text-lcars-peach underline uppercase">
            Manage Products →
          </Link>
        </LCARSPanel>

        <LCARSPanel color="blue" title="Orders">
          <div className="font-mono text-3xl text-lcars-blue">{stats.orders}</div>
          <Link href="/admin/orders" className="font-mono text-xs text-lcars-light-blue underline uppercase">
            View Orders →
          </Link>
        </LCARSPanel>

        <LCARSPanel color="lavender" title="System">
          <div className="font-mono text-sm text-emerald-400">OPERATIONAL</div>
          <div className="font-mono text-[10px] text-lcars-orange/40 mt-1">
            All systems nominal
          </div>
        </LCARSPanel>
      </div>
    </div>
  );
}
