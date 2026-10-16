import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../../data/types";
import { makeId } from "../../lib/ids";
import { formatINR } from "../../lib/money";
import { useProducts } from "../../store/ProductsStore";
import { useToast } from "../../store/ToastStore";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AdminProductsPage() {
  const { products, upsert, remove, resetToSeed } = useProducts();
  const toast = useToast();
  const navigate = useNavigate();

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => `${p.title} ${p.category} ${p.tags.join(" ")}`.toLowerCase().includes(s));
  }, [products, q]);

  function newProduct() {
    const id = makeId("product").toLowerCase();
    const p: Product = {
      id,
      title: "New Product",
      category: "Shirts",
      price: 999,
      description: "Edit this description in the admin panel.",
      fabric: "Cotton",
      fit: "Regular Fit",
      tags: ["new"],
      variants: [
        {
          id: "black",
          colorName: "Black",
          swatch: { type: "solid", value: "#0b0b0f" },
          images: ["https://images.unsplash.com/photo-1520975693411-b4e2c0f74b7b?auto=format&fit=crop&w=1200&q=80"],
          sizes: ["S", "M", "L", "XL"],
        },
      ],
    };

    upsert(p);
    toast.success("Product created");
    navigate(`/admin/products/${id}`);
  }

  return (
    <div className="adminPage">
      <div className="adminPageHead">
        <div>
          <div className="kicker">Admin</div>
          <div className="adminPageTitle">Products</div>
          <div className="adminPageHint">Add, edit, and curate the shop catalog.</div>
        </div>
        <div className="adminHeadActions">
          <button type="button" className="btn" onClick={resetToSeed}>
            Reset to seed
          </button>
          <button type="button" className="btn btnPrimary" onClick={newProduct}>
            Add product
          </button>
        </div>
      </div>

      <div className="adminBlock card">
        <div className="adminBlockHead">
          <div className="adminBlockTitle">Catalog</div>
          <label className="adminSearch">
            <span>Search</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rajasthan, Jeans..." />
          </label>
        </div>

        <div className="adminTable">
          <div className="adminRow adminRow--head" style={{ gridTemplateColumns: "64px 1fr 140px 120px 160px" }}>
            <div>Image</div>
            <div>Title</div>
            <div>Category</div>
            <div>Price</div>
            <div />
          </div>
          {filtered.map((p) => (
            <div key={p.id} className="adminRow" style={{ gridTemplateColumns: "64px 1fr 140px 120px 160px" }}>
              <div>
                <img className="adminImg" src={p.variants[0]?.images[0] ?? ""} alt="" />
              </div>
              <div>
                <div className="adminStrong">{p.title}</div>
                <div className="adminMuted mono">{p.id}</div>
              </div>
              <div>{p.category}</div>
              <div>{formatINR(p.price)}</div>
              <div className="adminRowActions">
                <Link className="btn" to={`/admin/products/${p.id}`}>
                  Edit
                </Link>
                <button
                  type="button"
                  className={cx("btn", "btnDanger")}
                  onClick={() => {
                    remove(p.id);
                    toast.success("Product removed");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 14, color: "var(--muted)" }}>No products found.</div>
        )}
      </div>
    </div>
  );
}
