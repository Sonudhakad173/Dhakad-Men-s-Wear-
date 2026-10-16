import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../store/catalog-context.js";
import { useCompare } from "../store/compare-context.js";
import { useToast } from "../store/toast-context.js";
import { getProductImage } from "../data/catalog.js";
import { formatINR } from "../utils/format.js";

function ColorDotsStatic({ variants }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((v) => {
        const isLight = Boolean(v.swatch?.isLight);
        const style =
          v.swatch?.type === "gradient"
            ? { backgroundImage: v.swatch.value }
            : { backgroundColor: v.swatch?.value ?? "#000" };

        return (
          <span
            key={v.id}
            title={v.colorName}
            className={[
              "inline-block h-3.5 w-3.5 rounded-full",
              isLight ? "ring-1 ring-slate-300 dark:ring-slate-700" : "ring-1 ring-slate-200/60 dark:ring-slate-800",
            ].join(" ")}
            style={style}
          />
        );
      })}
    </div>
  );
}

function CellLabel({ children }) {
  return <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{children}</div>;
}

export default function Compare() {
  const toast = useToast();
  const compare = useCompare();
  const { getById } = useCatalog();

  const products = useMemo(() => {
    return compare.items
      .map((i) => {
        const product = getById(i.productId);
        if (!product) return null;
        return { product, variantId: i.variantId };
      })
      .filter(Boolean);
  }, [compare.items, getById]);

  if (compare.items.length === 0) {
    return (
      <div className="page-container py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Compare is empty</div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Add 2–3 products to compare price, fabric, fit, colors, and sizes.
          </p>
          <Link to="/shop" className="btn btn-primary mt-6">
            Shop products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Compare</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Side-by-side details for your shortlist.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/shop" className="btn btn-outline">
            Add more
          </Link>
          <button
            type="button"
            onClick={() => {
              compare.clear();
              toast.info("Compare cleared");
            }}
            className="btn btn-outline"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-black">
        <table className="min-w-[48rem] w-full text-left">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="w-40 px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Field
              </th>
              {products.map(({ product }) => (
                <th key={product.id} className="px-5 py-4 align-top">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/product/${product.id}`}
                      className="min-w-0 text-sm font-extrabold tracking-tight text-slate-900 hover:text-emerald dark:text-white"
                    >
                      {product.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        compare.remove(product.id);
                        toast.info("Removed from compare", { title: product.title });
                      }}
                      className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label="Remove"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 6l12 12" />
                        <path d="M18 6 6 18" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{product.category}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            <tr>
              <td className="px-5 py-5">
                <CellLabel>Image</CellLabel>
              </td>
              {products.map(({ product, variantId }) => (
                <td key={product.id} className="px-5 py-5">
                  <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                    <img
                      src={getProductImage(product, variantId)}
                      alt={product.title}
                      className="h-44 w-36 object-cover"
                      loading="lazy"
                    />
                  </Link>
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-5 py-5">
                <CellLabel>Price</CellLabel>
              </td>
              {products.map(({ product }) => (
                <td key={product.id} className="px-5 py-5">
                  <div className="text-base font-black text-slate-900 dark:text-white">{formatINR(product.price)}</div>
                  {product.compareAt ? (
                    <div className="mt-1 text-xs font-extrabold text-slate-400 line-through dark:text-slate-500">
                      {formatINR(product.compareAt)}
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-5 py-5">
                <CellLabel>Fabric</CellLabel>
              </td>
              {products.map(({ product }) => (
                <td key={product.id} className="px-5 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {product.fabric}
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-5 py-5">
                <CellLabel>Fit</CellLabel>
              </td>
              {products.map(({ product }) => (
                <td key={product.id} className="px-5 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {product.fit}
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-5 py-5">
                <CellLabel>Colors</CellLabel>
              </td>
              {products.map(({ product }) => (
                <td key={product.id} className="px-5 py-5">
                  <ColorDotsStatic variants={product.variants} />
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-5 py-5">
                <CellLabel>Sizes</CellLabel>
              </td>
              {products.map(({ product }) => (
                <td key={product.id} className="px-5 py-5">
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <span
                        key={s}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-800 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
