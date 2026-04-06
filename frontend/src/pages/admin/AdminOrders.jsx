import { useMemo, useState } from "react";
import AdminNav from "../../components/AdminNav.jsx";
import { useOrders } from "../../store/orders-context.js";
import { ORDER_STATUSES } from "../../store/orders-constants.js";
import { formatINR } from "../../utils/format.js";
import { useToast } from "../../store/toast-context.js";

function labelForStatus(status) {
  return ORDER_STATUSES.find((s) => s.id === status)?.label ?? "Placed";
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[94%] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-black">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const toast = useToast();
  const ordersApi = useOrders();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ordersApi.orders;

    return ordersApi.orders.filter((o) => {
      const hay = `${o.id} ${o.customer?.email ?? ""} ${o.customer?.name ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [ordersApi.orders, query]);

  function view(order) {
    setActive(order);
    setOpen(true);
  }

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Orders</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            View orders and update statuses.
          </p>
        </div>
        <AdminNav />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order id or email..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              if (!ordersApi.orders.length) return;
              if (!window.confirm("Clear all orders?")) return;
              ordersApi.clear();
              toast.info("Orders cleared");
            }}
          >
            Clear orders
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-black">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
            {filtered.length ? (
              filtered.map((o) => (
                <tr key={o.id} className="text-slate-700 dark:text-slate-200">
                  <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-white">{o.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-extrabold">{o.customer?.name ?? "Customer"}</div>
                    <div className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{o.customer?.email ?? ""}</div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={o.status ?? "placed"}
                      onChange={(e) => {
                        const status = e.target.value;
                        ordersApi.setStatus(o.id, status);
                        toast.success("Status updated", { title: `${o.id} - ${labelForStatus(status)}` });
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                      aria-label="Update status"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 font-extrabold">{formatINR(Number(o?.totals?.total ?? 0))}</td>
                  <td className="px-5 py-4">
                    <button type="button" className="btn btn-outline px-3" onClick={() => view(o)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={active ? `Order ${active.id}` : "Order"}
        onClose={() => {
          setOpen(false);
          setActive(null);
        }}
      >
        {active ? (
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-black">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{labelForStatus(active.status)}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-black">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Created</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                  {active.createdAt ? new Date(active.createdAt).toLocaleString() : "-"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-black">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{formatINR(Number(active?.totals?.total ?? 0))}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">Customer</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{active.customer?.name ?? ""}</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{active.customer?.email ?? ""}</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 sm:col-span-2">{active.customer?.address ?? ""}</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{active.customer?.city ?? ""}</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{active.customer?.phone ?? ""}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">Items</div>
              <div className="mt-4 grid gap-3">
                {(active.items ?? []).map((it) => (
                  <div
                    key={it.key}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-black sm:flex-row sm:items-center"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950">
                      {it.image ? <img src={it.image} alt={it.name} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{it.name}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {it.color ? `${it.color} - ` : ""}{it.size ? `Size ${it.size} - ` : ""}Qty {it.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">{formatINR(Number(it.price ?? 0))}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">Delivery</div>
                <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{active.delivery?.label ?? "-"}</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">Payment</div>
                <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{active.payment?.label ?? "-"}</div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}