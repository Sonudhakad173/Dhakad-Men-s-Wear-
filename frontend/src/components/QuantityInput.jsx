export default function QuantityInput({ value, onChange, min = 1, max = 99 }) {
  const qty = Number(value ?? 1);

  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-black">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, qty - 1))}
        className="px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <div className="min-w-10 px-3 py-2 text-center text-sm font-bold tabular-nums text-slate-900 dark:text-white">
        {qty}
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, qty + 1))}
        className="px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
