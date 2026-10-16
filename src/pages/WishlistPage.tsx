import { Link } from "react-router-dom";
import type { Product } from "../data/types";
import { ProductGrid } from "../components/shop/ProductGrid";
import { useProducts } from "../store/ProductsStore";
import { useToast } from "../store/ToastStore";
import { useWishlist } from "../store/WishlistStore";

function isProduct(x: Product | undefined): x is Product {
  return Boolean(x);
}

export function WishlistPage() {
  const { products } = useProducts();
  const wishlist = useWishlist();
  const toast = useToast();

  const list = wishlist.ids.map((id) => products.find((p) => p.id === id)).filter(isProduct);

  if (list.length === 0) {
    return (
      <div className="container" style={{ padding: "96px 0 90px" }}>
        <div className="kicker">Wishlist</div>
        <h1 className="h1 pageTitle" style={{ margin: "10px 0 6px" }}>
          No items saved
        </h1>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Tap the heart on any product to save it here.
        </p>
        <Link to="/shop" className="btn btnPrimary">
          Explore shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "86px 0 90px" }}>
      <div className="pageHead">
        <div>
          <div className="kicker">Wishlist</div>
          <h1 className="h2" style={{ margin: "10px 0 0" }}>
            Saved for later
          </h1>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            wishlist.clear();
            toast.success("Wishlist cleared");
          }}
        >
          Clear wishlist
        </button>
      </div>

      <ProductGrid products={list} />
    </div>
  );
}

