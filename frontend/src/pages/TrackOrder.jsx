import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useOrders } from "../store/orders-context.js";
import { ORDER_STATUSES, statusIndex } from "../store/orders-constants.js";
import { useToast } from "../store/toast-context.js";
import { formatINR } from "../utils/format.js";

function formatDateTime(value) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return String(value ?? "");
  }
}

function Timeline({ status }) {
  const currentIndex = statusIndex(status);

  return (
    <ol className="mt-5 space-y-4">
      {ORDER_STATUSES.map((step, idx) => {
        const done = idx <= currentIndex;
        const active = idx === currentIndex;

        return (
          <li key={step.id} className="flex items-start gap-4">
            <div className="mt-1 flex flex-col items-center">
              <div
                className={[
                  "h-3.5 w-3.5 rounded-full",
                  done ? "bg-emerald" : "bg-slate-300 dark:bg-slate-700",
                  active ? "ring-4 ring-emerald/20" : "",
                ].join(" ")}
              />
              {idx !== ORDER_STATUSES.length - 1 ? (
                <div className={done ? "h-10 w-px bg-emerald/40" : "h-10 w-px bg-slate-200 dark:bg-slate-800"} />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className={done ? "text-sm font-extrabold text-slate-900 dark:text-white" : "text-sm font-extrabold text-slate-500 dark:text-slate-400"}>
                {step.label}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {done ? "Completed" : "Pending"}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get("id") ?? "";

  const [value, setValue] = useState(() => initialId);
  const [submittedId, setSubmittedId] = useState(() => initialId);

  const { getById } = useOrders();
  const toast = useToast();

  const order = useMemo(() => {
    const id = String(submittedId ?? "").trim();
    if (!id) return null;
    return getById(id);
  }, [getById, submittedId]);

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Track your order</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Enter your order ID to view the delivery timeline.
          </p>
        </div>
        <Link to="/shop" className="btn btn-outline">
          Continue shopping
        </Link>
      </div>

      <div className="mt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="text-lg font-black text-slate-900 dark:text-white">Order ID</div>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              const id = value.trim();
              if (!id) {
                toast.error("Enter an order ID");
                return;
              }
              const found = getById(id);
              setSubmittedId(id);
              setSearchParams(id ? { id } : {}, { replace: true });
              if (found) toast.success("Order found", { title: id });
              else toast.error("Order not found", { title: id });
            }}
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="DMW-20260312-XXXXXX"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              Track
            </button>
          </form>

          {submittedId && !order ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-500/10 dark:text-rose-200">
              No order found for <span className="font-mono font-extrabold">{submittedId}</span>. Double-check the ID.
            </div>
          ) : null}

          {order ? (
            <div className="mt-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-black">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Order</div>
                    <div className="mt-1 font-mono text-sm font-black text-slate-900 dark:text-white">{order.id}</div>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Placed</div>
                    <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{formatDateTime(order.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total</div>
                    <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{formatINR(order.totals?.total ?? 0)}</div>
                  </div>
                </div>

                <Timeline status={order.status} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">Delivery slot</div>
                  <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {order.delivery?.label ?? "—"} • {order.delivery?.note ?? ""}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">Payment</div>
                  <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {order.payment?.label ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
