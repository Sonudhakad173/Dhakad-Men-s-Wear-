import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { CATEGORY_ORDER, SWATCHES } from "../data/catalog.js";
import { useCatalog } from "../store/catalog-context.js";

function parseListParam(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function setListParam(params, key, list) {
  const next = [...new Set(list)].filter(Boolean);
  if (next.length === 0) params.delete(key);
  else params.set(key, next.join(","));
}

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function SearchBox({ initialValue, onSubmit }) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="w-full"
      role="search"
    >
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search shirts, jeans, trousers…"
          className="w-full rounded-2xl border border-slate-200 bg-white px-9 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
        />
      </div>
    </form>
  );
}

function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-black">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3"
      >
        <div className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">{title}</div>
        <div className="text-slate-500 dark:text-slate-300">{open ? "−" : "+"}</div>
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

function colorOptionsFromProducts(products) {
  const seen = new Map();

  for (const p of products) {
    for (const v of p.variants) {
      if (!seen.has(v.id)) seen.set(v.id, { id: v.id, label: v.colorName, swatch: v.swatch });
    }
  }

  const order = [
    "black",
    "white",
    "grey",
    "pale-grey",
    "cream",
    "light-cream",
    "brown",
    "olive",
    "light-blue",
    "ice-blue",
    "blue",
    "medium-blue",
    "red",
    "purple",
    "pink",
    "yellow",
    "yellowish",
    "pitch",
    "multi",
    "graphite-black",
  ];

  const list = Array.from(seen.values());
  list.sort((a, b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    if (ia === -1 && ib === -1) return a.label.localeCompare(b.label);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return list;
}

export default function Shop() {
  const { products } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const cat = searchParams.get("cat") ?? "All";
  const colors = parseListParam(searchParams.get("colors"));
  const sizes = parseListParam(searchParams.get("sizes"));
  const minRaw = searchParams.get("min");
  const maxRaw = searchParams.get("max");
  const min = minRaw ? Number(minRaw) : null;
  const max = maxRaw ? Number(maxRaw) : null;
  const sort = searchParams.get("sort") ?? "featured";

  const CATEGORY_LABELS = {
    Shirts: "Shirt Collection",
    Jeans: "Jeans Collection",
    Trousers: "Trouser Collection",
    Others: "Other Collection",
  };

  const CATEGORY_SUBTITLES = {
    Shirts: "Cotton, linen & prints",
    Jeans: "Cargo, baggy & straight",
    Trousers: "Formal to relaxed fits",
    Others: "T-shirt, jogger, shorts",
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    let list = products;

    if (cat !== "All") {
      list = list.filter((p) => p.category === cat);
    }

    if (query) {
      list = list.filter((p) => {
        const hay = `${p.title} ${p.category} ${p.fabric} ${p.fit}`.toLowerCase();
        return hay.includes(query);
      });
    }

    if (colors.length > 0) {
      list = list.filter((p) => p.variants.some((v) => colors.includes(v.id)));
    }

    if (sizes.length > 0) {
      list = list.filter((p) => p.sizes.some((s) => sizes.includes(String(s))));
    }

    if (min !== null && Number.isFinite(min)) {
      list = list.filter((p) => p.price >= min);
    }

    if (max !== null && Number.isFinite(max)) {
      list = list.filter((p) => p.price <= max);
    }

    const next = [...list];

    switch (sort) {
      case "price-asc":
        next.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        next.sort((a, b) => b.price - a.price);
        break;
      case "new":
        next.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        next.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
        break;
    }

    return next;
  }, [q, cat, colors, sizes, min, max, sort, products]);

  const grouped = useMemo(() => {
    const map = new Map(CATEGORY_ORDER.map((c) => [c, []]));
    for (const p of filtered) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category).push(p);
    }
    return map;
  }, [filtered]);

  const availableColors = useMemo(() => colorOptionsFromProducts(filtered), [filtered]);
  const availableSizes = useMemo(() => {
    const set = new Set();
    for (const p of filtered) for (const s of p.sizes) set.add(String(s));
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [filtered]);

  function updateParams(mutator) {
    const next = new URLSearchParams(searchParams);
    mutator(next);
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Shop</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            One premium style card with multiple color options—across shirts, jeans, trousers, and essentials.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <SearchBox
            key={q}
            initialValue={q}
            onSubmit={(value) => {
              updateParams((p) => {
                const nextQ = value.trim();
                if (!nextQ) p.delete("q");
                else p.set("q", nextQ);
              });
            }}
          />

          <select
            value={sort}
            onChange={(e) => {
              const v = e.target.value;
              updateParams((p) => {
                if (v === "featured") p.delete("sort");
                else p.set("sort", v);
              });
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="new">New arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-black">
            <div className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">
              Category
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["All", ...CATEGORY_ORDER].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    updateParams((p) => {
                      if (c === "All") p.delete("cat");
                      else p.set("cat", c);
                    })
                  }
                  className={["chip", cat === c ? "chip-active" : ""].join(" ")}
                >
                  {c === "All" ? "All" : CATEGORY_LABELS[c] ?? c}
                </button>
              ))}
            </div>
          </div>

          <FilterSection title="Colors">
            <div className="grid gap-2">
              {availableColors.map((c) => {
                const selected = colors.includes(c.id);
                const isLight = Boolean(c.swatch?.isLight);
                const style =
                  c.swatch?.type === "gradient"
                    ? { backgroundImage: c.swatch.value }
                    : { backgroundColor: c.swatch?.value ?? SWATCHES.black.value };

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      updateParams((p) => {
                        const next = toggleInList(colors, c.id);
                        setListParam(p, "colors", next);
                      })
                    }
                    className={[
                      "flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-semibold transition",
                      selected
                        ? "border-emerald/35 bg-emerald/10 text-emerald"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-black dark:text-slate-100 dark:hover:bg-white/5",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={[
                          "inline-block h-4 w-4 rounded-full",
                          isLight ? "ring-1 ring-slate-300 dark:ring-slate-700" : "ring-1 ring-slate-200/60 dark:ring-slate-800",
                        ].join(" ")}
                        style={style}
                      />
                      {c.label}
                    </span>
                    {selected ? <span className="text-emerald">✓</span> : null}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          <FilterSection title="Sizes">
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    updateParams((p) => {
                      const next = toggleInList(sizes, s);
                      setListParam(p, "sizes", next);
                    })
                  }
                  className={[
                    "rounded-xl border px-3 py-2 text-sm font-extrabold transition",
                    sizes.includes(s)
                      ? "border-emerald/35 bg-emerald/10 text-emerald"
                      : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-black dark:text-slate-100 dark:hover:bg-white/5",
                  ].join(" ")}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Price" defaultOpen>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Min
                <input
                  inputMode="numeric"
                  placeholder="0"
                  defaultValue={minRaw ?? ""}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    updateParams((p) => {
                      if (!v) p.delete("min");
                      else p.set("min", v);
                    });
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                />
              </label>
              <label className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Max
                <input
                  inputMode="numeric"
                  placeholder="9999"
                  defaultValue={maxRaw ?? ""}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    updateParams((p) => {
                      if (!v) p.delete("max");
                      else p.set("max", v);
                    });
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                />
              </label>
            </div>
          </FilterSection>

          <button
            type="button"
            onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
            className="btn btn-outline w-full"
          >
            Clear filters
          </button>

          <div className="rounded-2xl bg-lux-gradient p-4 text-xs font-semibold text-slate-900 dark:text-white">
            Luxury-first browsing: pick a style, then choose your color inside the same card.
          </div>
        </aside>

        <section>
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-black">
              <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">No matches</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Try different filters or clear to browse the full collection.
              </p>
              <button
                type="button"
                onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
                className="btn btn-primary mt-6"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {CATEGORY_ORDER.map((category) => {
                const items = grouped.get(category) ?? [];
                if (items.length === 0) return null;
                const label = CATEGORY_LABELS[category] ?? category;
                const subtitle = CATEGORY_SUBTITLES[category];

                return (
                  <div key={category}>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{label}</h2>
                        {subtitle ? (
                          <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{subtitle}</div>
                        ) : null}
                      </div>
                      <Link
                        to={cat === category ? "/shop" : `/shop?cat=${encodeURIComponent(category)}`}
                        className="text-sm font-extrabold text-emerald"
                      >
                        {cat === category ? "View all" : "Filter"}
                      </Link>
                    </div>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
