import { Link } from "react-router-dom";
import type { Product } from "../data/types";
import { formatINR } from "../lib/money";
import { useCompare } from "../store/CompareStore";
import { useProducts } from "../store/ProductsStore";

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function isProduct(x: Product | undefined): x is Product {
  return Boolean(x);
}

export function ComparePage() {
  const compare = useCompare();
  const { products } = useProducts();

  const items = compare.ids.map((id) => products.find((p) => p.id === id)).filter(isProduct);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "96px 0 90px" }}>
        <div className="kicker">Compare</div>
        <h1 className="h1 pageTitle" style={{ margin: "10px 0 6px" }}>
          Compare up to 3 items
        </h1>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Use the compare icon on a product card to add it here.
        </p>
        <Link to="/shop" className="btn btnPrimary">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "86px 0 90px" }}>
      <div className="pageHead">
        <div>
          <div className="kicker">Compare</div>
          <h1 className="h1 pageTitle" style={{ margin: "10px 0 0" }}>
            Side by side
          </h1>
        </div>
        <button type="button" className="btn" onClick={compare.clear}>
          Clear
        </button>
      </div>

      <div className="compareWrap card">
        <div
          className="compareGrid"
          style={{
            gridTemplateColumns: `160px repeat(${items.length}, minmax(220px, 1fr))`,
          }}
        >
          <div className="compareCell compareHead" />
          {items.map((p) => (
            <div key={p.id} className="compareCell compareHead">
              <Link to={`/product/${p.id}`} className="compareTitle">
                {p.title}
              </Link>
              <button type="button" className="compareRemove" onClick={() => compare.toggle(p.id)}>
                Remove
              </button>
            </div>
          ))}

          <div className="compareLabel">Price</div>
          {items.map((p) => (
            <div key={p.id} className="compareCell">
              {formatINR(p.price)}
            </div>
          ))}

          <div className="compareLabel">Category</div>
          {items.map((p) => (
            <div key={p.id} className="compareCell">
              {p.category}
            </div>
          ))}

          <div className="compareLabel">Fabric</div>
          {items.map((p) => (
            <div key={p.id} className="compareCell">
              {p.fabric}
            </div>
          ))}

          <div className="compareLabel">Fit</div>
          {items.map((p) => (
            <div key={p.id} className="compareCell">
              {p.fit}
            </div>
          ))}

          <div className="compareLabel">Colors</div>
          {items.map((p) => (
            <div key={p.id} className="compareCell">
              {p.variants.map((v) => v.colorName).join(", ")}
            </div>
          ))}

          <div className="compareLabel">Sizes</div>
          {items.map((p) => (
            <div key={p.id} className="compareCell">
              {uniq(p.variants.flatMap((v) => v.sizes)).join(", ")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

