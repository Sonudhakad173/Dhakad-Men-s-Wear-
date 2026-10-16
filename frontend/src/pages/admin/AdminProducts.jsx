import { useMemo, useState } from "react";
import AdminNav from "../../components/AdminNav.jsx";
import { useCatalog } from "../../store/catalog-context.js";
import { CATEGORY_ORDER, SWATCHES } from "../../data/catalog.js";
import { formatINR } from "../../utils/format.js";
import { useToast } from "../../store/toast-context.js";

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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

export default function AdminProducts() {
  const toast = useToast();
  const catalog = useCatalog();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog.products;

    return catalog.products.filter((p) => {
      const hay = `${p.title} ${p.category} ${p.fabric ?? ""} ${p.fit ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [catalog.products, query]);

  function startCreate() {
    const base = {
      title: "New Product",
      category: "Shirts",
      price: 999,
      compareAt: null,
      fabric: "",
      fit: "",
      isNew: true,
      isBestSeller: false,
      sizes: ["S", "M", "L", "XL"],
      variants: [
        {
          id: "black",
          colorName: "Black",
          swatch: { ...SWATCHES.black },
          images: [""],
        },
      ],
    };

    setDraft(base);
    setOpen(true);
  }

  function startEdit(product) {
    setDraft(clone(product));
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setDraft(null);
  }

  function updateField(key, value) {
    setDraft((p) => ({ ...p, [key]: value }));
  }

  function updateVariant(index, patch) {
    setDraft((p) => {
      const next = clone(p);
      next.variants[index] = { ...next.variants[index], ...patch };
      return next;
    });
  }

  function updateVariantSwatch(index, patch) {
    setDraft((p) => {
      const next = clone(p);
      next.variants[index] = {
        ...next.variants[index],
        swatch: { ...(next.variants[index].swatch ?? SWATCHES.black), ...patch },
      };
      return next;
    });
  }

  function addVariant() {
    setDraft((p) => {
      const next = clone(p);
      next.variants.push({
        id: `color-${Math.random().toString(16).slice(2, 6)}`,
        colorName: "New Color",
        swatch: { type: "solid", value: "#111827" },
        images: [""],
      });
      return next;
    });
  }

  function removeVariant(index) {
    setDraft((p) => {
      const next = clone(p);
      next.variants.splice(index, 1);
      return next;
    });
  }

  function save() {
    if (!draft) return;

    const title = String(draft.title ?? "").trim();
    if (!title) {
      toast.error("Title is required");
      return;
    }

    const variants = Array.isArray(draft.variants) ? draft.variants : [];
    if (variants.length === 0) {
      toast.error("Add at least 1 color variant");
      return;
    }

    const cleaned = {
      ...draft,
      title,
      category: CATEGORY_ORDER.includes(draft.category) ? draft.category : "Shirts",
      price: safeNumber(draft.price),
      compareAt: draft.compareAt ? safeNumber(draft.compareAt) : null,
      sizes: Array.isArray(draft.sizes)
        ? draft.sizes.map((s) => String(s).trim()).filter(Boolean)
        : String(draft.sizes ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      variants: variants
        .map((v) => {
          const colorName = String(v.colorName ?? "").trim() || "Color";
          const id = String(v.id ?? "").trim() || slugify(colorName) || `c-${Math.random().toString(16).slice(2, 6)}`;
          const swatch = v.swatch ?? { type: "solid", value: "#111827" };
          const images = Array.isArray(v.images)
            ? v.images.map((u) => String(u).trim()).filter(Boolean)
            : String(v.images ?? "")
                .split("\n")
                .map((u) => u.trim())
                .filter(Boolean);
          return { ...v, id, colorName, swatch, images: images.length ? images : [""] };
        })
        .filter((v) => v && v.id),
    };

    catalog.upsert(cleaned);
    toast.success("Product saved", { title: cleaned.title });
    close();
  }

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Products</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Add, edit, and manage products.</p>
        </div>
        <AdminNav />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline" onClick={startCreate}>
            Add product
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              if (!window.confirm("Reset products to the default catalog?")) return;
              catalog.reset();
              toast.info("Products reset");
            }}
          >
            Reset catalog
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const image = p.variants?.[0]?.images?.[0] ?? "";

          return (
            <div
              key={p.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black"
            >
              <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-950">
                {image ? <img src={image} alt={p.title} className="h-full w-full object-cover" loading="lazy" /> : null}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{p.title}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {p.category}
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">{formatINR(p.price)}</div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.isNew ? <span className="chip chip-active">New</span> : null}
                  {p.isBestSeller ? <span className="chip chip-active">Best</span> : null}
                  <span className="chip">{p.variants?.length ?? 0} colors</span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <button type="button" className="btn btn-outline px-3" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline px-3"
                    onClick={() => {
                      if (!window.confirm(`Delete ${p.title}?`)) return;
                      catalog.remove(p.id);
                      toast.info("Product deleted", { title: p.title });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={open}
        title={draft?.id ? "Edit product" : "Add product"}
        onClose={() => {
          if (window.confirm("Discard changes?")) close();
        }}
      >
        {draft ? (
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Title
                <input
                  value={draft.title ?? ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Category
                <select
                  value={draft.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                >
                  {CATEGORY_ORDER.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Price
                <input
                  inputMode="numeric"
                  value={draft.price ?? 0}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Compare at (optional)
                <input
                  inputMode="numeric"
                  value={draft.compareAt ?? ""}
                  onChange={(e) => updateField("compareAt", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Fabric
                <input
                  value={draft.fabric ?? ""}
                  onChange={(e) => updateField("fabric", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Fit
                <input
                  value={draft.fit ?? ""}
                  onChange={(e) => updateField("fit", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 sm:col-span-2">
                Sizes (comma separated)
                <input
                  value={Array.isArray(draft.sizes) ? draft.sizes.join(", ") : String(draft.sizes ?? "")}
                  onChange={(e) => updateField("sizes", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                  placeholder="S, M, L, XL"
                />
              </label>
            </div>

            <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">Flags</div>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.isNew)}
                      onChange={(e) => updateField("isNew", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald focus:ring-emerald/25"
                    />
                    New
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.isBestSeller)}
                      onChange={(e) => updateField("isBestSeller", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald focus:ring-emerald/25"
                    />
                    Best seller
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">Color variants</div>
                <button type="button" className="btn btn-outline px-3" onClick={addVariant}>
                  Add color
                </button>
              </div>

              <div className="mt-5 grid gap-5">
                {draft.variants.map((v, idx) => {
                  const swatch = v.swatch ?? { type: "solid", value: "#111827" };
                  const isLight = Boolean(swatch.isLight);
                  const style =
                    swatch.type === "gradient"
                      ? { backgroundImage: swatch.value }
                      : { backgroundColor: swatch.value ?? "#111827" };

                  return (
                    <div
                      key={`${v.id}_${idx}`}
                      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-black"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={[
                              "h-5 w-5 rounded-full",
                              isLight ? "ring-1 ring-slate-300 dark:ring-slate-700" : "ring-1 ring-slate-200/60 dark:ring-slate-800",
                            ].join(" ")}
                            style={style}
                          />
                          <div className="text-sm font-extrabold text-slate-900 dark:text-white">{v.colorName}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          disabled={draft.variants.length === 1}
                          className="btn btn-outline px-3 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Color name
                          <input
                            value={v.colorName ?? ""}
                            onChange={(e) => {
                              const colorName = e.target.value;
                              updateVariant(idx, { colorName });
                              if (!v.id) updateVariant(idx, { id: slugify(colorName) });
                            }}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                          />
                        </label>

                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Variant id
                          <input
                            value={v.id ?? ""}
                            onChange={(e) => updateVariant(idx, { id: slugify(e.target.value) })}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                            placeholder="e.g. olive"
                          />
                        </label>

                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Swatch type
                          <select
                            value={swatch.type ?? "solid"}
                            onChange={(e) => updateVariantSwatch(idx, { type: e.target.value })}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                          >
                            <option value="solid">Solid</option>
                            <option value="gradient">Gradient</option>
                          </select>
                        </label>

                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Swatch value
                          <div className="mt-2 flex items-center gap-2">
                            {swatch.type === "solid" ? (
                              <input
                                type="color"
                                value={String(swatch.value ?? "#111827")}
                                onChange={(e) => updateVariantSwatch(idx, { value: e.target.value })}
                                className="h-10 w-14 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-black"
                              />
                            ) : null}
                            <input
                              value={String(swatch.value ?? "")}
                              onChange={(e) => updateVariantSwatch(idx, { value: e.target.value })}
                              className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                              placeholder={swatch.type === "gradient" ? "linear-gradient(...)" : "#111827"}
                            />
                          </div>
                        </label>

                        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={Boolean(swatch.isLight)}
                            onChange={(e) => updateVariantSwatch(idx, { isLight: e.target.checked })}
                            className="h-4 w-4 rounded border-slate-300 text-emerald focus:ring-emerald/25"
                          />
                          Light swatch
                        </label>

                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 sm:col-span-2">
                          Images (one URL per line)
                          <textarea
                            value={Array.isArray(v.images) ? v.images.join("\n") : String(v.images ?? "")}
                            onChange={(e) =>
                              updateVariant(idx, {
                                images: e.target.value
                                  .split("\n")
                                  .map((u) => u.trim())
                                  .filter(Boolean),
                              })
                            }
                            rows={4}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                            placeholder="https://..."
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button type="button" className="btn btn-outline" onClick={close}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={save}>
                Save product
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}