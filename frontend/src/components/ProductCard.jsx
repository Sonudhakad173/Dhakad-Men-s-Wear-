import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ColorDots from "./ColorDots.jsx";
import { formatINR } from "../utils/format.js";
import { getProductImage } from "../data/catalog.js";
import { useToast } from "../store/toast-context.js";
import { useWishlist } from "../store/wishlist-context.js";

function HeartIcon({ className, filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

export default function ProductCard({ product, showBadges = true }) {
  const toast = useToast();
  const wishlist = useWishlist();

  const initialVariantId = product.variants?.[0]?.id ?? "";
  const [variantId, setVariantId] = useState(initialVariantId);

  const imageUrl = useMemo(() => getProductImage(product, variantId), [product, variantId]);

  const liked = wishlist.has(product.id);

  const discountPercent = useMemo(() => {
    if (!product.compareAt || product.compareAt <= product.price) return null;
    const pct = Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
    return pct > 0 ? pct : null;
  }, [product.compareAt, product.price]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-950">
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
            loading="lazy"
          />

          {showBadges ? (
            <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
              {product.isNew ? (
                <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold tracking-wide text-slate-900 shadow-sm backdrop-blur dark:bg-black/70 dark:text-white">
                  NEW
                </span>
              ) : null}
              {product.isBestSeller ? (
                <span className="rounded-full bg-emerald px-3 py-1 text-[11px] font-extrabold tracking-wide text-white shadow-sm">
                  BEST
                </span>
              ) : null}
            </div>
          ) : null}

          {discountPercent ? (
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/85 px-3 py-1 text-[11px] font-extrabold tracking-wide text-white shadow-sm dark:bg-white/10">
              -{discountPercent}%
            </div>
          ) : null}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${product.id}`} className="block">
              <h3 className="truncate text-[15px] font-extrabold tracking-tight text-slate-900 transition group-hover:text-emerald dark:text-white">
                {product.title}
              </h3>
            </Link>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {product.category}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              wishlist.toggle(product.id, variantId);
              toast.info(liked ? "Removed from wishlist" : "Saved to wishlist", { title: product.title });
            }}
            className={[
              "rounded-xl border bg-white/60 p-2 shadow-sm transition",
              "hover:shadow-soft-xl hover:scale-[1.03]",
              liked
                ? "border-emerald/35 bg-emerald/10 text-emerald"
                : "border-slate-200 text-slate-600 hover:border-emerald/30 hover:bg-emerald/5 hover:text-emerald dark:border-slate-800 dark:bg-black/40 dark:text-slate-200 dark:hover:bg-emerald/10",
            ].join(" ")}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon className={liked ? "h-5 w-5 text-emerald" : "h-5 w-5"} filled={liked} />
          </button>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">{formatINR(product.price)}</span>
          {product.compareAt ? (
            <span className="text-xs font-extrabold text-slate-400 line-through dark:text-slate-500">
              {formatINR(product.compareAt)}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <ColorDots variants={product.variants} selectedId={variantId} onSelect={setVariantId} />
        </div>

        <Link to={`/product/${product.id}`} className="btn btn-outline mt-4 w-full">
          View details
        </Link>
      </div>
    </div>
  );
}
