import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Product, ProductVariant, Swatch } from "../../data/types";
import { formatINR } from "../../lib/money";
import { useProducts } from "../../store/ProductsStore";
import { useToast } from "../../store/ToastStore";

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

function toCsv(arr: string[]) {
  return arr.join(", ");
}

function fromCsv(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function swatchToInput(s: Swatch) {
  return { type: s.type, value: s.value, isLight: Boolean(s.isLight) };
}

function inputToSwatch(i: { type: "solid" | "gradient"; value: string; isLight: boolean }): Swatch {
  return { type: i.type, value: i.value, isLight: i.isLight };
}

export function AdminProductEditPage() {
  const { productId } = useParams();
  const { getById, upsert } = useProducts();
  const toast = useToast();
  const navigate = useNavigate();

  const product = productId ? getById(productId) : undefined;
  const [draft, setDraft] = useState<Product | null>(() => (product ? clone(product) : null));

  const ready = useMemo(() => {
    if (!product) return false;
    if (!draft) return false;
    return product.id === draft.id;
  }, [product, draft]);

  if (!product || !draft || !ready) {
    return (
      <div className="adminPage">
        <div className="adminBlock card">
          <div className="adminBlockTitle">Product not found</div>
          <Link className="btn btnPrimary" to="/admin/products">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  function save() {
    if (!draft) return;

    if (!draft.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (draft.variants.length === 0) {
      toast.error("Add at least one color variant");
      return;
    }

    upsert({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      fabric: draft.fabric.trim(),
      fit: draft.fit.trim(),
      tags: draft.tags.map((t) => t.trim()).filter(Boolean),
    });

    toast.success("Saved");
    navigate("/admin/products");
  }

  function updateVariant(idx: number, next: ProductVariant) {
    setDraft((d) => {
      if (!d) return d;
      const variants = d.variants.slice();
      variants[idx] = next;
      return { ...d, variants };
    });
  }

  return (
    <div className="adminPage">
      <div className="adminPageHead">
        <div>
          <div className="kicker">Edit</div>
          <div className="adminPageTitle">{product.title}</div>
          <div className="adminPageHint">Update details and color variants.</div>
        </div>
        <div className="adminHeadActions">
          <Link className="btn" to="/admin/products">
            Cancel
          </Link>
          <button type="button" className="btn btnPrimary" onClick={save}>
            Save
          </button>
        </div>
      </div>

      <div className="adminEdit">
        <div className="adminBlock card">
          <div className="adminBlockTitle">Basics</div>
          <div className="formGrid">
            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <span className="fieldLabel">Title</span>
              <input
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, title: e.target.value } : d))
                }
              />
            </label>

            <label className="field">
              <span className="fieldLabel">Category</span>
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, category: e.target.value as any } : d))
                }
              >
                <option value="Shirts">Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Trousers">Trousers</option>
                <option value="Others">Others</option>
              </select>
            </label>

            <label className="field">
              <span className="fieldLabel">Price (INR)</span>
              <input
                type="number"
                value={draft.price}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, price: Number(e.target.value) || 0 } : d))
                }
              />
            </label>

            <label className="field">
              <span className="fieldLabel">Fabric</span>
              <input
                value={draft.fabric}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, fabric: e.target.value } : d))
                }
              />
            </label>

            <label className="field">
              <span className="fieldLabel">Fit</span>
              <input
                value={draft.fit}
                onChange={(e) => setDraft((d) => (d ? { ...d, fit: e.target.value } : d))}
              />
            </label>

            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <span className="fieldLabel">Description</span>
              <textarea
                rows={4}
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, description: e.target.value } : d))
                }
              />
            </label>

            <label className="field" style={{ gridColumn: "1 / -1" }}>
              <span className="fieldLabel">Tags (comma separated)</span>
              <input
                value={toCsv(draft.tags)}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, tags: fromCsv(e.target.value) } : d))
                }
              />
            </label>
          </div>

          <div className="adminNote">
            Current price: <strong>{formatINR(draft.price)}</strong>
          </div>
        </div>

        <div className="adminBlock card">
          <div className="adminBlockHead">
            <div>
              <div className="adminBlockTitle">Variants</div>
              <div className="adminBlockHint">Colors, swatches, images, sizes</div>
            </div>
            <button
              type="button"
              className="btn btnPrimary"
              onClick={() =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        variants: [
                          {
                            id: `color-${d.variants.length + 1}`,
                            colorName: `Color ${d.variants.length + 1}`,
                            swatch: { type: "solid", value: "#0b0b0f" },
                            images: [""],
                            sizes: ["S", "M", "L", "XL"],
                          },
                          ...d.variants,
                        ],
                      }
                    : d,
                )
              }
            >
              Add color
            </button>
          </div>

          <div className="variantList">
            {draft.variants.map((v, idx) => {
              const s = swatchToInput(v.swatch);

              return (
                <div key={v.id} className="variant card">
                  <div className="variantTop">
                    <div className="variantTitle">{v.colorName}</div>
                    <button
                      type="button"
                      className="btn btnDanger"
                      onClick={() =>
                        setDraft((d) =>
                          d
                            ? { ...d, variants: d.variants.filter((_, i) => i !== idx) }
                            : d,
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>

                  <div className="formGrid">
                    <label className="field">
                      <span className="fieldLabel">Variant ID</span>
                      <input
                        value={v.id}
                        onChange={(e) => updateVariant(idx, { ...v, id: e.target.value })}
                      />
                    </label>
                    <label className="field">
                      <span className="fieldLabel">Color name</span>
                      <input
                        value={v.colorName}
                        onChange={(e) => updateVariant(idx, { ...v, colorName: e.target.value })}
                      />
                    </label>

                    <label className="field">
                      <span className="fieldLabel">Swatch type</span>
                      <select
                        value={s.type}
                        onChange={(e) =>
                          updateVariant(idx, {
                            ...v,
                            swatch: inputToSwatch({ ...s, type: e.target.value as any }),
                          })
                        }
                      >
                        <option value="solid">Solid</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </label>

                    <label className="field">
                      <span className="fieldLabel">Swatch value</span>
                      <input
                        value={s.value}
                        onChange={(e) =>
                          updateVariant(idx, {
                            ...v,
                            swatch: inputToSwatch({ ...s, value: e.target.value }),
                          })
                        }
                        placeholder="#0f766e or conic-gradient(...)"
                      />
                    </label>

                    <label className="field">
                      <span className="fieldLabel">Light swatch</span>
                      <select
                        value={String(s.isLight)}
                        onChange={(e) =>
                          updateVariant(idx, {
                            ...v,
                            swatch: inputToSwatch({ ...s, isLight: e.target.value === "true" }),
                          })
                        }
                      >
                        <option value="false">false</option>
                        <option value="true">true</option>
                      </select>
                    </label>

                    <label className="field" style={{ gridColumn: "1 / -1" }}>
                      <span className="fieldLabel">Images (comma separated)</span>
                      <input
                        value={toCsv(v.images)}
                        onChange={(e) => updateVariant(idx, { ...v, images: fromCsv(e.target.value) })}
                      />
                    </label>

                    <label className="field" style={{ gridColumn: "1 / -1" }}>
                      <span className="fieldLabel">Sizes (comma separated)</span>
                      <input
                        value={toCsv(v.sizes)}
                        onChange={(e) => updateVariant(idx, { ...v, sizes: fromCsv(e.target.value) })}
                      />
                    </label>
                  </div>

                  <div className="variantPreview">
                    <div className="variantPreviewSwatch" style={{ background: v.swatch.value }} />
                    <img className="variantPreviewImg" src={v.images[0] ?? ""} alt="" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
