import { useMemo } from "react";
import { Link } from "react-router-dom";
import AdminNav from "../../components/AdminNav.jsx";
import { useCatalog } from "../../store/catalog-context.js";
import { useOrders } from "../../store/orders-context.js";
import { ORDER_STATUSES } from "../../store/orders-constants.js";
import { formatINR } from "../../utils/format.js";

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
      <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{value}</div>
      {hint ? <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{hint}</div> : null}
    </div>
  );
}

export default function AdminDashboard() {
  const { products } = useCatalog();
  const { orders } = useOrders();

  const revenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + Number(o?.totals?.total ?? 0), 0);
  }, [orders]);

  const statusCounts = useMemo(() => {
    const map = new Map(ORDER_STATUSES.map((s) => [s.id, 0]));
    for (const o of orders) {
      const id = o?.status;
      map.set(id, (map.get(id) ?? 0) + 1);
    }
    return ORDER_STATUSES.map((s) => ({ ...s, count: map.get(s.id) ?? 0 }));
  }, [orders]);

  const categoryCounts = useMemo(() => {
    const map = new Map();
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Admin Panel</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Dashboard insights for products and orders (frontend-only).
          </p>
        </div>
        <AdminNav />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Products" value={products.length} hint={categoryCounts[0] ? `${categoryCounts[0][0]} leads` : null} />
        <Stat label="Orders" value={orders.length} hint={orders.length ? `Latest: ${orders[0].id}` : "No orders yet"} />
        <Stat label="Revenue" value={formatINR(revenue)} hint="Based on placed orders" />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">Order status</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {statusCounts.map((s) => (
              <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-black">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{s.label}</div>
                <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">{s.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">Quick actions</div>
            <div className="flex items-center gap-2">
              <Link to="/admin/products" className="btn btn-outline px-3">
                Manage products
              </Link>
              <Link to="/admin/orders" className="btn btn-outline px-3">
                View orders
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Product categories
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryCounts.length ? (
                categoryCounts.map(([cat, count]) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-black dark:text-slate-200"
                  >
                    {cat}
                    <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-xs font-extrabold text-emerald">{count}</span>
                  </span>
                ))
              ) : (
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">No products found.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">Recent orders</div>
          <Link to="/admin/orders" className="text-sm font-extrabold text-emerald">
            View all
          </Link>
        </div>

        {recentOrders.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="text-slate-700 dark:text-slate-200">
                    <td className="py-3 pr-4 font-extrabold text-slate-900 dark:text-white">{o.id}</td>
                    <td className="py-3 pr-4">
                      {ORDER_STATUSES.find((s) => s.id === o.status)?.label ?? "Placed"}
                    </td>
                    <td className="py-3 pr-4 font-extrabold">{formatINR(Number(o?.totals?.total ?? 0))}</td>
                    <td className="py-3">{Array.isArray(o.items) ? o.items.length : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">No orders yet.</div>
        )}
      </div>
    </div>
  );
}