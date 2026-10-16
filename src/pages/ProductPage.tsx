import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IconCompare, IconHeart, IconHeartFill } from "../components/common/Icons";
import { ProductGallery } from "../components/shop/ProductGallery";
import { SizePicker } from "../components/shop/SizePicker";
import { SwatchRow } from "../components/shop/SwatchDots";
import { Modal } from "../components/ui/Modal";
import { formatINR } from "../lib/money";
import { useCart } from "../store/CartStore";
import { useCompare } from "../store/CompareStore";
import { useProducts } from "../store/ProductsStore";
import { useToast } from "../store/ToastStore";
import { useWishlist } from "../store/WishlistStore";

export function ProductPage() {
  const { productId } = useParams();
  const { getById } = useProducts();
  const product = productId ? getById(productId) : undefined;

  const toast = useToast();
  const cart = useCart();
  const wishlist = useWishlist();
  const compare = useCompare();

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const [variantId, setVariantId] = useState("");
  const [size, setSize] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    setVariantId(product.variants[0]?.id ?? "");
    setSize(null);
  }, [product?.id]);

  const variant = useMemo(() => {
    if (!product) return null;
    return (
      product.variants.find((v) => v.id === variantId) ??
      product.variants[0] ??
      null
    );
  }, [product, variantId]);

  const images = variant?.images ?? [];

  if (!product || !variant) {
    return (
      <div className="container" style={{ padding: "96px 0" }}>
        <div className="kicker">Product</div>
        <h1 className="h2" style={{ margin: "10px 0 10px" }}>
          Not found
        </h1>
        <Link className="btn btnPrimary" to="/shop">
          Back to shop
        </Link>
      </div>
    );
  }

  const addToCart = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    cart.add({ productId: product.id, variantId: variant.id, size, qty: 1 });
    toast.success("Added to cart");
  };

  const toggleWish = () => {
    const added = wishlist.toggle(product.id);
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  const toggleCompare = () => {
    const res = compare.toggle(product.id);
    if (res.reason) toast.info(res.reason);
    else toast.success(res.added ? "Added to compare" : "Removed from compare");
  };

  return (
    <div className="container" style={{ padding: "86px 0 90px" }}>
      <Link to="/shop" className="backLink">
        Back to shop
      </Link>

      <div className="productPage">
        <ProductGallery images={images} alt={product.title} />

        <div className="productPanel">
          <div className="kicker">{product.category}</div>
          <h1 className="h2" style={{ margin: "10px 0 6px" }}>
            {product.title}
          </h1>
          <div className="productPanelPrice">{formatINR(product.price)}</div>

          <p className="productPanelDesc">{product.description}</p>

          <div className="specGrid">
            <div className="spec">
              <div className="specLabel">Fabric</div>
              <div className="specValue">{product.fabric}</div>
            </div>
            <div className="spec">
              <div className="specLabel">Fit</div>
              <div className="specValue">{product.fit}</div>
            </div>
            <div className="spec">
              <div className="specLabel">Color</div>
              <div className="specValue">{variant.colorName}</div>
            </div>
          </div>

          <div className="pickBlock">
            <div className="pickTop">
              <div className="pickTitle">Color</div>
              <div className="pickHint">Tap a dot to switch</div>
            </div>
            <SwatchRow
              variants={product.variants}
              selectedId={variant.id}
              onSelect={setVariantId}
            />
          </div>

          <div className="pickBlock">
            <div className="pickTop">
              <div className="pickTitle">Size</div>
              <button
                type="button"
                className="linkBtn"
                onClick={() => setSizeGuideOpen(true)}
              >
                Size guide
              </button>
            </div>
            <SizePicker sizes={variant.sizes} value={size} onChange={setSize} />
          </div>

          <div className="productActions">
            <button type="button" className="btn btnPrimary" onClick={addToCart}>
              Add to cart
            </button>
            <button
              type="button"
              className={["btn", wishlist.has(product.id) && "btn--active"]
                .filter(Boolean)
                .join(" ")}
              onClick={toggleWish}
              aria-label="Wishlist"
            >
              {wishlist.has(product.id) ? (
                <IconHeartFill size={18} />
              ) : (
                <IconHeart size={18} />
              )}
              <span>{wishlist.has(product.id) ? "Wishlisted" : "Wishlist"}</span>
            </button>
            <button
              type="button"
              className={["btn", compare.has(product.id) && "btn--active"]
                .filter(Boolean)
                .join(" ")}
              onClick={toggleCompare}
              aria-label="Compare"
            >
              <IconCompare size={18} />
              <span>{compare.has(product.id) ? "In compare" : "Compare"}</span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={sizeGuideOpen}
        title="Size Guide"
        onClose={() => setSizeGuideOpen(false)}
      >
        <div className="sizeGuide">
          <div className="sizeGuideRow sizeGuideRow--head">
            <div>Size</div>
            <div>Chest / Waist</div>
            <div>Fit help</div>
          </div>
          {variant.sizes.map((s) => (
            <div key={s} className="sizeGuideRow">
              <div>{s}</div>
              <div>{["30", "32", "34", "36"].includes(s) ? `${s} in` : `${s} (std)`}</div>
              <div style={{ color: "var(--muted)" }}>
                {product.category === "Shirts" || product.category === "Others"
                  ? "Comfort through the shoulders"
                  : "Measure at the waist"}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
