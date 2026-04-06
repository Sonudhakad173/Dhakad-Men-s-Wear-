import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../store/cart-context.js";
import { useCatalog } from "../store/catalog-context.js";
import { useToast } from "../store/toast-context.js";
import { useWishlist } from "../store/wishlist-context.js";
import { findVariant, getDefaultVariant, getProductImage } from "../data/catalog.js";
import { formatINR } from "../utils/format.js";

function HeartIcon({ filled, className }) {
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

function WishlistCard({ product, variantId, onRemove, onAddToCart }) {
  const defaultSize = product.sizes?.[0] ?? null;
  const [size, setSize] = useState(defaultSize);

  const variant = (variantId ? findVariant(product, variantId) : null) ?? getDefaultVariant(product);
  const image = getProductImage(product, variant?.id);

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-950">
          <img
            src={image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${product.id}`} className="block">
              <div className="truncate text-base font-extrabold tracking-tight text-slate-900 transition group-hover:text-emerald dark:text-white">
                {product.title}
              </div>
            </Link>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {product.category}
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl border border-slate-200 bg-white/60 p-2 text-slate-600 shadow-sm transition hover:scale-[1.03] hover:border-emerald/30 hover:bg-emerald/5 hover:text-emerald hover:shadow-soft-xl dark:border-slate-800 dark:bg-black/40 dark:text-slate-200 dark:hover:bg-emerald/10"
            aria-label="Remove from wishlist"
          >
            <HeartIcon filled className="h-5 w-5 text-emerald" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-base font-black text-slate-900 dark:text-white">{formatINR(product.price)}</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{variant?.colorName ?? ""}</div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Size</div>
          <div className="flex flex-wrap justify-end gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={[
                  "rounded-xl border px-3 py-2 text-xs font-extrabold transition",
                  s === size
                    ? "border-emerald/35 bg-emerald/10 text-emerald"
                    : "border-slate-200 bg-white text-slate-900 hover:border-emerald/30 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black dark:text-slate-100 dark:hover:bg-emerald/10",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart({ size, variant })}
          className="btn btn-primary mt-5 w-full"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default function Wishlist() {
  const toast = useToast();
  const cart = useCart();
  const { getById } = useCatalog();
  const wishlist = useWishlist();

  const list = useMemo(() => {
    return wishlist.items
      .map((i) => {
        const product = getById(i.productId);
        if (!product) return null;
        return { product, variantId: i.variantId };
      })
      .filter(Boolean);
  }, [getById, wishlist.items]);

  if (wishlist.items.length === 0) {
    return (
      <div className="page-container py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Your wishlist is empty</div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Tap the heart on any product to save it here.
          </p>
          <Link to="/shop" className="btn btn-primary mt-6">
            Shop collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Wishlist</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Saved styles, ready when you are.
          </p>
        </div>
        <Link to="/shop" className="btn btn-outline">
          Shop
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ product, variantId }) => (
          <WishlistCard
            key={product.id}
            product={product}
            variantId={variantId}
            onRemove={() => {
              wishlist.remove(product.id);
              toast.info("Removed from wishlist", { title: product.title });
            }}
            onAddToCart={({ size, variant }) => {
              const cartProduct = {
                id: product.id,
                name: product.title,
                image: getProductImage(product, variant?.id),
                price: product.price,
                compareAt: product.compareAt ?? null,
                sizes: product.sizes,
                colors: product.variants.map((v) => v.colorName),
              };
              cart.addItem(cartProduct, { quantity: 1, size, color: variant?.colorName ?? null });
              toast.success("Added to cart", { title: product.title });
            }}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={() => {
            wishlist.clear();
            toast.info("Wishlist cleared");
          }}
          className="btn btn-outline"
        >
          Clear wishlist
        </button>
      </div>
    </div>
  );
}
