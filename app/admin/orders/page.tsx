'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthProvider';
import { Order } from '@/types';
import { formatPriceFromDecimal } from '@/lib/utils';
import LCARSBar from '@/components/lcars/LCARSBar';
import LCARSLoading from '@/components/lcars/LCARSLoading';

const statusColors: Record<string, string> = {
  pending: 'text-lcars-tan',
  paid: 'text-lcars-amber',
  fulfilled: 'text-lcars-blue',
  shipped: 'text-lcars-light-blue',
  delivered: 'text-emerald-400',
  cancelled: 'text-lcars-red',
};

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
      } catch {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchOrders();
  }, [token]);

  if (loading) return <LCARSLoading text="Loading Orders" />;

  return (
    <div className="space-y-6">
      <LCARSBar color="blue">Orders</LCARSBar>

      {orders.length === 0 ? (
        <div className="text-center py-10 font-mono text-sm text-lcars-orange/60 uppercase">
          No orders yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-lcars-panel">
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Order #
                </th>
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Customer
                </th>
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Total
                </th>
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Status
                </th>
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Fulfillment
                </th>
                <th className="text-left font-mono text-xs uppercase tracking-widest text-lcars-orange/60 py-2 px-3">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-lcars-panel/50 hover:bg-lcars-panel/30">
                  <td className="py-3 px-3 font-mono text-sm text-lcars-text">
                    #{order.order_number}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-sm text-lcars-text">{order.customer_name || 'N/A'}</div>
                    <div className="font-mono text-[10px] text-lcars-orange/40">{order.customer_email}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-sm text-lcars-peach">
                    {formatPriceFromDecimal(order.total)}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-mono text-xs uppercase ${statusColors[order.status] || 'text-lcars-text'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs uppercase text-lcars-blue">
                      {order.fulfillment_status}
                    </span>
                    {order.tracking_number && (
                      <div className="font-mono text-[10px] text-lcars-light-blue">
                        {order.tracking_url ? (
                          <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="underline">
                            {order.tracking_number}
                          </a>
                        ) : (
                          order.tracking_number
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-lcars-orange/60">
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
