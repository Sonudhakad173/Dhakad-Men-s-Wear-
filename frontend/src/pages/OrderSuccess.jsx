import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId ?? "DMW-DEMO-ORDER";

  return (
    <div className="page-container py-12">
      <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center shadow-soft-xl dark:border-slate-800 dark:bg-black">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Order placed</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Your order is confirmed. Use the ID below to track the timeline.
        </p>

        <div className="mt-6 rounded-2xl border border-emerald/25 bg-emerald/10 px-5 py-4">
          <div className="text-xs font-extrabold uppercase tracking-wide text-emerald">Order ID</div>
          <div className="mt-1 font-mono text-sm font-black text-slate-900 dark:text-white">{orderId}</div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to={`/track-order?id=${encodeURIComponent(orderId)}`} className="btn btn-primary">
            Track order
          </Link>
          <Link to="/shop" className="btn btn-outline">
            Shop more
          </Link>
        </div>
      </div>
    </div>
  );
}
