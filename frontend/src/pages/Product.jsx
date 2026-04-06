import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ColorDots from "../components/ColorDots.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useCatalog } from "../store/catalog-context.js";
import { useCart } from "../store/cart-context.js";
import { useCompare } from "../store/compare-context.js";
import { useRecent } from "../store/recent-context.js";
import { useToast } from "../store/toast-context.js";
import { useWishlist } from "../store/wishlist-context.js";
import { findVariant, getDefaultVariant, getProductImage } from "../data/catalog.js";
import { formatINR } from "../utils/format.js";

function percentOff(compareAt, price) {
  if (!compareAt || compareAt <= price) return null;
  const pct = Math.round(((compareAt - price) / compareAt) * 100);
  return pct > 0 ? pct : null;
}

function ZoomImage({ src, alt, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-3xl bg-slate-50 focus:outline-none dark:bg-slate-950"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setOrigin("50% 50%");
      }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
      }}
      aria-label="Zoom image"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full select-none object-cover transition duration-300"
        style={{ transformOrigin: origin, transform: hovered ? "scale(1.8)" : "scale(1)" }}
        draggable={false}
      />
    </button>
  );
}

function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close" />
      <div className="absolute left-1/2 top-1/2 w-[min(42rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft-xl dark:border-slate-800 dark:bg-black">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white">{title}</div>
            <div className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Fit helper for quick sizing.</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function SizeGuideTable({ product }) {
  const isTrouser = product.category === "Trousers" || product.category === "Jeans";

  if (isTrouser) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:bg-white/5 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Waist (in)</th>
              <th className="px-4 py-3">Fit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {product.sizes.map((s) => (
              <tr key={s} className="text-slate-700 dark:text-slate-200">
                <td className="px-4 py-3 font-extrabold">{s}</td>
                <td className="px-4 py-3 font-semibold">{s}</td>
                <td className="px-4 py-3 font-semibold">{product.fit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const chestMap = { S: 38, M: 40, L: 42, XL: 44, XXL: 46 };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Chest (in)</th>
            <th className="px-4 py-3">Fit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {product.sizes.map((s) => (
            <tr key={s} className="text-slate-700 dark:text-slate-200">
              <td className="px-4 py-3 font-extrabold">{s}</td>
              <td className="px-4 py-3 font-semibold">{chestMap[s] ?? "—"}</td>
              <td className="px-4 py-3 font-semibold">{product.fit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Product() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { getById, products } = useCatalog();
  const { addItem } = useCart();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();
  const compare = useCompare();
  const { track: trackRecent } = useRecent();
  const toast = useToast();

  const product = useMemo(() => getById(productId), [getById, productId]);

  const [variantId, setVariantId] = useState(() => product?.variants?.[0]?.id ?? "");
  const [size, setSize] = useState(() => product?.sizes?.[0] ?? null);
  const [imageIndex, setImageIndex] = useState(0);

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!product?.id) return;

    const id = window.setTimeout(() => {
      trackRecent(product.id);
    }, 0);

    return () => window.clearTimeout(id);
  }, [product?.id, trackRecent]);

  useEffect(() => {
    if (!product) return;

    const id = window.setTimeout(() => {
      setVariantId(product.variants?.[0]?.id ?? "");
      setSize(product.sizes?.[0] ?? null);
      setImageIndex(0);
    }, 0);

    return () => window.clearTimeout(id);
  }, [product]);

  if (!product) {
    return (
      <div className="page-container py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Product not found</div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            That item does not exist in the catalog.
          </p>
          <Link to="/shop" className="btn btn-primary mt-6">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const variant = findVariant(product, variantId) ?? getDefaultVariant(product);
  const images = variant?.images ?? [];
  const activeImage = images[imageIndex] ?? getProductImage(product, variantId);
  const discount = percentOff(product.compareAt, product.price);

  const liked = inWishlist(product.id);
  const compared = compare.has(product.id);

  function onSelectVariant(nextId) {
    setVariantId(nextId);
    setImageIndex(0);
  }

  function addToCart() {
    const cartProduct = {
      id: product.id,
      name: product.title,
      image: activeImage,
      price: product.price,
      compareAt: product.compareAt ?? null,
      sizes: product.sizes,
      colors: product.variants.map((v) => v.colorName),
    };

    addItem(cartProduct, {
      quantity: 1,
      size,
      color: variant?.colorName ?? null,
    });

    toast.success("Added to cart", { title: product.title });
  }

  function buyNow() {
    addToCart();
    navigate("/cart");
  }

  const youMayLike = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 font-extrabold text-slate-800 shadow-sm transition hover:border-emerald/30 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black dark:text-slate-100 dark:hover:bg-emerald/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18 9 12l6-6" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Link to="/shop" className="font-extrabold hover:text-emerald">
            Shop
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <Link to={`/shop?cat=${encodeURIComponent(product.category)}`} className="font-extrabold hover:text-emerald">
            {product.category}
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-extrabold text-slate-900 dark:text-white">{product.title}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="rounded-[2.5rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-black">
            <div className="relative overflow-hidden rounded-[2rem]">
              <ZoomImage src={activeImage} alt={product.title} onClick={() => setLightboxOpen(true)} />

              {product.isNew || product.isBestSeller ? (
                <div className="pointer-events-none absolute left-5 top-5 flex flex-wrap gap-2">
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

              {discount ? (
                <div className="pointer-events-none absolute right-5 top-5 rounded-full bg-black/85 px-3 py-1 text-[11px] font-extrabold tracking-wide text-white shadow-sm dark:bg-white/10">
                  -{discount}%
                </div>
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-auto pb-1">
                {images.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setImageIndex(idx)}
                    className={[
                      "h-20 w-16 overflow-hidden rounded-2xl border bg-slate-50 transition dark:bg-slate-950",
                      idx === imageIndex
                        ? "border-emerald/40 ring-2 ring-emerald/25"
                        : "border-slate-200 hover:border-emerald/30 dark:border-slate-800",
                    ].join(" ")}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Modal open={lightboxOpen} title={product.title} onClose={() => setLightboxOpen(false)}>
            <div className="rounded-3xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-black">
              <div className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950">
                <img src={activeImage} alt={product.title} className="h-[70vh] w-full object-contain" />
              </div>
            </div>
          </Modal>
        </div>

        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-700 dark:border-slate-800 dark:bg-black dark:text-slate-200">
              {product.fabric}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-700 dark:border-slate-800 dark:bg-black dark:text-slate-200">
              {product.fit} fit
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <div className="text-3xl font-black text-slate-900 dark:text-white">{formatINR(product.price)}</div>
            {product.compareAt ? (
              <div className="text-sm font-extrabold text-slate-400 line-through dark:text-slate-500">
                {formatINR(product.compareAt)}
              </div>
            ) : null}
          </div>

          <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            {product.description}
          </p>

          <div className="mt-8 grid gap-5">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Color
                </div>
                <div className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{variant?.colorName ?? ""}</div>
              </div>
              <div className="mt-3">
                <ColorDots variants={product.variants} selectedId={variantId} onSelect={onSelectVariant} size={16} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Size
                </div>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-extrabold text-emerald hover:underline"
                >
                  Size guide
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={[
                      "rounded-xl border px-3 py-2 text-sm font-extrabold transition",
                      s === size
                        ? "border-emerald/35 bg-emerald/10 text-emerald"
                        : "border-slate-200 bg-white text-slate-900 hover:border-emerald/35 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black dark:text-slate-100 dark:hover:bg-emerald/10",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={addToCart} className="btn btn-primary w-full">
                Add to cart
              </button>
              <button type="button" onClick={buyNow} className="btn btn-outline w-full">
                Buy now
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product.id, variantId);
                  toast.info(liked ? "Removed from wishlist" : "Saved to wishlist", { title: product.title });
                }}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-extrabold transition",
                  liked
                    ? "border-emerald/35 bg-emerald/10 text-emerald"
                    : "border-slate-200 bg-white text-slate-900 hover:border-emerald/35 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black dark:text-slate-100 dark:hover:bg-emerald/10",
                ].join(" ")}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={liked ? "h-5 w-5 text-emerald" : "h-5 w-5"}
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 21s-7.5-4.65-10-9.5C.6 8.35 2.2 5.6 5.2 5c1.8-.35 3.5.35 4.6 1.6C10.9 5.35 12.6 4.65 14.4 5c3 .6 4.6 3.35 3.2 6.5C19.5 16.35 12 21 12 21z" />
                </svg>
                Wishlist
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!compare.canAddMore && !compared) {
                    toast.error("Remove an item to add another.", { title: "Compare is full" });
                    return;
                  }

                  compare.toggle(product.id, variantId);
                  toast.info(compared ? "Removed from compare" : "Added to compare", { title: product.title });
                }}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-extrabold transition",
                  compared
                    ? "border-emerald/35 bg-emerald/10 text-emerald"
                    : "border-slate-200 bg-white text-slate-900 hover:border-emerald/35 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black dark:text-slate-100 dark:hover:bg-emerald/10",
                ].join(" ")}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 3H5a2 2 0 0 0-2 2v14" />
                  <path d="M14 3h5a2 2 0 0 1 2 2v14" />
                  <path d="M7 21h10" />
                  <path d="M7 7h10" />
                  <path d="M7 11h10" />
                  <path d="M7 15h10" />
                </svg>
                Compare
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">Shipping & care</div>
              <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Free shipping over ₹1,999. Easy 7-day returns.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={sizeGuideOpen} title="Size Guide" onClose={() => setSizeGuideOpen(false)}>
        <SizeGuideTable product={product} />
        <div className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Tip: If you are between sizes, go one size up for a relaxed fit.
        </div>
      </Modal>

      {youMayLike.length ? (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">You may also like</h2>
              <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                More picks from {product.category}.
              </p>
            </div>
            <Link to={`/shop?cat=${encodeURIComponent(product.category)}`} className="btn btn-outline">
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {youMayLike.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}


