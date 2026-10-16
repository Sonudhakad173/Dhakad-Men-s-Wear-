import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "../app/hooks/useMediaQuery";
import type { Category, Product, ProductVariant, Swatch } from "../data/types";
import { categoriesInOrder } from "../data/seedProducts";
import { formatINR } from "../lib/money";
import { useProducts } from "../store/ProductsStore";
import { ProductGrid } from "../components/shop/ProductGrid";
import { IconClose, IconSearch } from "../components/common/Icons";
import { SwatchDot } from "../components/shop/SwatchDots";

type SortKey = "featured" | "new" | "price_asc" | "price_desc";

function toNum(v: string | null) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getColorOptions(products: Product[]) {
  const map = new Map<string, Swatch>();
  for (const p of products) {
    for (const v of p.variants) {
      if (!map.has(v.colorName)) map.set(v.colorName, v.swatch);
    }
  }
  return Array.from(map.entries()).map(([name, swatch]) => ({ name, swatch }));
}

function getSizeOptions(products: Product[]) {
  const sizes: string[] = [];
  for (const p of products) for (const v of p.variants) sizes.push(...v.sizes);
  return uniq(sizes);
}

function productHasColor(product: Product, colorNames: string[]) {
  if (colorNames.length === 0) return true;
  const names = new Set(colorNames.map((c) => c.toLowerCase()));
  return product.variants.some((v) => names.has(v.colorName.toLowerCase()));
}

function productHasSize(product: Product, sizes: string[]) {
  if (sizes.length === 0) return true;
  const wanted = new Set(sizes);
  return product.variants.some((v) => v.sizes.some((s) => wanted.has(s)));
}

function matchesQuery(product: Product, q: string) {
  if (!q) return true;
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const hay = `${product.title} ${product.description} ${product.tags.join(" ")} ${product.fabric} ${product.fit}`.toLowerCase();
  return hay.includes(s);
}

function sortProducts(list: Product[], sort: SortKey) {
  const next = list.slice();
  if (sort === "new") {
    next.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    return next;
  }
  if (sort === "price_asc") {
    next.sort((a, b) => a.price - b.price);
    return next;
  }
  if (sort === "price_desc") {
    next.sort((a, b) => b.price - a.price);
    return next;
  }
  // featured
  next.sort((a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)));
  return next;
}

function parseCsv(v: string | null) {
  if (!v) return [];
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function setParam(params: URLSearchParams, key: string, value: string | null) {
  const next = new URLSearchParams(params);
  if (value === null || value === "") next.delete(key);
  else next.set(key, value);
  return next;
}

function toggleCsvParam(params: URLSearchParams, key: string, value: string) {
  const set = new Set(parseCsv(params.get(key)));
  if (set.has(value)) set.delete(value);
  else set.add(value);
  const arr = Array.from(set);
  const next = new URLSearchParams(params);
  if (arr.length === 0) next.delete(key);
  else next.set(key, arr.join(","));
  return next;
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="filterSection">
      <button type="button" className="filterHead" onClick={onToggle}>
        <span>{title}</span>
        <span className="filterChevron" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="filterBody">{children}</div>}
    </div>
  );
}

function ColorPicker({
  options,
  selected,
  onToggle,
}: {
  options: Array<{ name: string; swatch: Swatch }>;
  selected: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div className="colorPicker">
      {options.map((o) => (
        <div key={o.name} className="colorPickRow">
          <SwatchDot
            swatch={o.swatch}
            selected={selected.map((x) => x.toLowerCase()).includes(o.name.toLowerCase())}
            title={o.name}
            onClick={() => onToggle(o.name)}
          />
          <button type="button" className="colorPickLabel" onClick={() => onToggle(o.name)}>
            {o.name}
          </button>
        </div>
      ))}
    </div>
  );
}

const ALPHA_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

function splitSizesForPicker(options: string[]) {
  const alpha: string[] = [];
  const numeric: string[] = [];
  const other: string[] = [];

  for (const s of options) {
    if (/^\d+$/.test(s)) numeric.push(s);
    else if (/^[A-Za-z]+$/.test(s)) alpha.push(s);
    else other.push(s);
  }

  const alphaOrder = new Map(ALPHA_ORDER.map((s, i) => [s.toLowerCase(), i] as const));

  const sortedAlpha = uniq(alpha).sort((a, b) => {
    const ai = alphaOrder.get(a.toLowerCase());
    const bi = alphaOrder.get(b.toLowerCase());
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;
    return a.localeCompare(b);
  });

  const sortedNumeric = uniq(numeric).sort((a, b) => Number(a) - Number(b));
  const sortedOther = uniq(other);

  return { alpha: sortedAlpha, numeric: sortedNumeric, other: sortedOther };
}

function SizePicker({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (size: string) => void;
}) {
  const { alpha, numeric, other } = splitSizesForPicker(options);
  const groups = [alpha, numeric, other].filter((g) => g.length > 0);

  return (
    <div className="sizePickerGroups">
      {groups.map((group, gi) => (
        <div key={gi} className="sizePicker">
          {group.map((s) => (
            <button
              key={s}
              type="button"
              className={cx("sizePick", selected.includes(s) && "sizePick--active")}
              onClick={() => onToggle(s)}
            >
              {s}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ShopPage() {
  const { products } = useProducts();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const category = (params.get("category") as Category | null) ?? "";
  const colors = parseCsv(params.get("color"));
  const sizes = parseCsv(params.get("size"));
  const min = toNum(params.get("min"));
  const max = toNum(params.get("max"));
  const sort = (params.get("sort") as SortKey | null) ?? "featured";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [openColors, setOpenColors] = useState(false);
  const [openSizes, setOpenSizes] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openCategory, setOpenCategory] = useState(true);

  const colorOptions = useMemo(() => getColorOptions(products), [products]);
  const sizeOptions = useMemo(() => getSizeOptions(products), [products]);

  const filtered = useMemo(() => {
    let list = products.slice();

    if (category) list = list.filter((p) => p.category === category);
    if (min !== null) list = list.filter((p) => p.price >= min);
    if (max !== null) list = list.filter((p) => p.price <= max);
    list = list.filter((p) => matchesQuery(p, q));
    list = list.filter((p) => productHasColor(p, colors));
    list = list.filter((p) => productHasSize(p, sizes));

    return sortProducts(list, sort);
  }, [products, category, min, max, q, colors, sizes, sort]);

  const anyFilter = Boolean(q || category || colors.length || sizes.length || min !== null || max !== null);

  const Filters = (
    <div className="filters card">
      <div className="filtersTop">
        <div className="filtersTitle">Filters</div>
        {anyFilter && (
          <button
            type="button"
            className="filtersClear"
            onClick={() => setParams(new URLSearchParams())}
          >
            Clear
          </button>
        )}
      </div>

      <FilterSection title="Category" open={openCategory} onToggle={() => setOpenCategory((v) => !v)}>
        <div className="categoryList">
          <button
            type="button"
            className={cx("catPill", !category && "catPill--active")}
            onClick={() => setParams(setParam(params, "category", null))}
          >
            All
          </button>
          {categoriesInOrder.map((c) => (
            <button
              key={c}
              type="button"
              className={cx("catPill", category === c && "catPill--active")}
              onClick={() => setParams(setParam(params, "category", c))}
            >
              {c}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price" open={openPrice} onToggle={() => setOpenPrice((v) => !v)}>
        <div className="priceGrid">
          <label className="field">
            <span className="fieldLabel">Min</span>
            <input
              type="number"
              value={min ?? ""}
              placeholder="500"
              onChange={(e) => setParams(setParam(params, "min", e.target.value || null))}
            />
          </label>
          <label className="field">
            <span className="fieldLabel">Max</span>
            <input
              type="number"
              value={max ?? ""}
              placeholder="3000"
              onChange={(e) => setParams(setParam(params, "max", e.target.value || null))}
            />
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Colors" open={openColors} onToggle={() => setOpenColors((v) => !v)}>
        <ColorPicker
          options={colorOptions}
          selected={colors}
          onToggle={(name) => setParams(toggleCsvParam(params, "color", name))}
        />
      </FilterSection>

      <FilterSection title="Sizes" open={openSizes} onToggle={() => setOpenSizes((v) => !v)}>
        <SizePicker
          options={sizeOptions}
          selected={sizes}
          onToggle={(size) => setParams(toggleCsvParam(params, "size", size))}
        />
      </FilterSection>

    </div>
  );

  return (
    <div className="container" style={{ padding: "88px 0 90px" }}>
      <div className="shopHead">
        <div>
          <div className="kicker">Shop</div>
          <h1 className="h1 shopTitle" style={{ margin: "8px 0 0" }}>
            Indian menswear, curated.
          </h1>
          <p className="shopSub">
            One clean product card with multiple color options inside, consistent across every category.
          </p>
        </div>

        <div className="shopControls">
          <form
            className="shopSearch"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <IconSearch size={18} aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => setParams(setParam(params, "q", e.target.value || null))}
              placeholder="Search"
              aria-label="Search"
            />
            {q && (
              <button
                type="button"
                className="shopSearchClear"
                onClick={() => setParams(setParam(params, "q", null))}
                aria-label="Clear search"
              >
                <IconClose size={16} />
              </button>
            )}
          </form>

          <label className="sort">
            <span className="sortLabel">Sort</span>
            <select
              value={sort}
              onChange={(e) => setParams(setParam(params, "sort", e.target.value))}
            >
              <option value="featured">Featured</option>
              <option value="new">New</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </label>

          {isMobile && (
            <button type="button" className="btn" onClick={() => setMobileFiltersOpen(true)}>
              Filters
            </button>
          )}
        </div>
      </div>

      <div className="shopLayout">
        {!isMobile && Filters}

        <div>
          <div className="resultsBar">
            <div className="resultsCount">
              {filtered.length} item{filtered.length === 1 ? "" : "s"}
            </div>

          </div>

          {category ? (
            <ProductGrid products={filtered} />
          ) : (
            <div className="shopGroups">
              {categoriesInOrder.map((catName) => {
                const list = filtered.filter((p) => p.category === catName);
                if (list.length === 0) return null;
                return (
                  <section key={catName} style={{ paddingTop: 18 }}>
                    <div className="sectionHead" style={{ marginBottom: 12 }}>
                      <div>
                        <div className="kicker">Collection</div>
                        <div className="h3">{catName}</div>
                      </div>
                      <Link to={`/shop?category=${encodeURIComponent(catName)}`} className="btn">
                        View all
                      </Link>
                    </div>
                    <ProductGrid products={list} />
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div
        className={cx("drawerOverlay", mobileFiltersOpen && "drawerOverlay--open")}
        onClick={() => setMobileFiltersOpen(false)}
      />

      <aside className={cx("filterDrawer", mobileFiltersOpen && "filterDrawer--open")}>
        <div className="drawerTop">
          <div className="drawerTitle">Filters</div>
          <button type="button" className="iconBtn" onClick={() => setMobileFiltersOpen(false)} aria-label="Close">
            <IconClose size={20} />
          </button>
        </div>
        {Filters}
      </aside>
    </div>
  );
}



