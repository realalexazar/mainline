'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthProvider';
import { Order } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400',
  paid: 'text-accent',
  fulfilled: 'text-blue-400',
  shipped: 'text-cyan-400',
  delivered: 'text-emerald-400',
  cancelled: 'text-sale',
};

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    if (token) fetchOrders();
  }, [token]);

  if (loading) return <div className="text-center py-10 text-text-dim font-mono text-[0.8rem] uppercase">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-mono text-[0.75rem] tracking-[0.15em] uppercase text-text-mid">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-text-dim text-[0.85rem]">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Order #', 'Customer', 'Total', 'Status', 'Fulfillment', 'Date'].map((h) => (
                  <th key={h} className="text-left font-mono text-[0.65rem] uppercase tracking-wider text-text-dim py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-bg-card/50">
                  <td className="py-3 px-3 font-mono text-[0.85rem]">#{order.order_number}</td>
                  <td className="py-3 px-3">
                    <div className="text-[0.85rem]">{order.customer_name || 'N/A'}</div>
                    <div className="text-[0.7rem] text-text-dim">{order.customer_email}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[0.85rem]">{formatPriceFromDecimal(order.total)}</td>
                  <td className="py-3 px-3">
                    <span className={`font-mono text-[0.7rem] uppercase ${statusColors[order.status] || 'text-text'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[0.7rem] uppercase text-text-dim">{order.fulfillment_status}</span>
                    {order.tracking_number && (
                      <div className="text-[0.65rem] text-text-dim">
                        {order.tracking_url ? (
                          <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">{order.tracking_number}</a>
                        ) : order.tracking_number}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[0.75rem] text-text-dim">
                    {new Date(order.created_at).toLocaleDateString()}
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
