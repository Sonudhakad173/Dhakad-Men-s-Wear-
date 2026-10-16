import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/types";
import { formatINR } from "../../lib/money";
import { useCompare } from "../../store/CompareStore";
import { useToast } from "../../store/ToastStore";
import { useWishlist } from "../../store/WishlistStore";
import { IconCompare, IconHeart, IconHeartFill } from "../common/Icons";
import { SwatchRow } from "./SwatchDots";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProductCard({
  product,
  compact,
}: {
  product: Product;
  compact?: boolean;
}) {
  const toast = useToast();
  const wishlist = useWishlist();
  const compare = useCompare();

  const isCompact = compact === true;

  const defaultVariant = product.variants[0];
  const [variantId, setVariantId] = useState(defaultVariant.id);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? defaultVariant,
    [product.variants, variantId, defaultVariant],
  );

  const img = variant.images[0] ?? defaultVariant.images[0] ?? "";

  function toggleWish() {
    const added = wishlist.toggle(product.id);
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  }

  function toggleCompare() {
    const res = compare.toggle(product.id);
    if (res.reason) toast.info(res.reason);
    else toast.success(res.added ? "Added to compare" : "Removed from compare");
  }

  return (
    <div className={cx("productCard", isCompact && "productCard--compact")}>
      <Link
        to={`/product/${product.id}`}
        className="productMedia"
        aria-label={product.title}
      >
        <img className="productImg" src={img} alt={product.title} loading="lazy" />
        <div className="productFade" />
        {(product.isNew || product.isBestSeller) && (
          <div className="productBadges">
            {product.isNew && <span className="badgePill">New</span>}
            {product.isBestSeller && (
              <span className="badgePill badgePill--dark">Best</span>
            )}
          </div>
        )}
      </Link>

      <div className="productTopActions">
        <button
          type="button"
          className={cx(
            "iconBtn",
            "iconBtn--ghost",
            wishlist.has(product.id) && "iconBtn--active",
          )}
          onClick={toggleWish}
          aria-label={
            wishlist.has(product.id) ? "Remove from wishlist" : "Add to wishlist"
          }
          title="Wishlist"
        >
          {wishlist.has(product.id) ? (
            <IconHeartFill size={18} />
          ) : (
            <IconHeart size={18} />
          )}
        </button>

        {!isCompact && (
          <button
            type="button"
            className={cx(
              "iconBtn",
              "iconBtn--ghost",
              compare.has(product.id) && "iconBtn--active",
            )}
            onClick={toggleCompare}
            aria-label={
              compare.has(product.id) ? "Remove from compare" : "Add to compare"
            }
            title="Compare"
          >
            <IconCompare size={18} />
          </button>
        )}
      </div>

      <div className="productInfo">
        {isCompact && <div className="productCategory">{product.category}</div>}

        <div className="productTitleRow">
          <div className="productTitle">{product.title}</div>
          {!isCompact && <div className="productPrice">{formatINR(product.price)}</div>}
        </div>

        {!isCompact && (
          <>
            <div className="productMeta">
              {product.fabric} • {product.fit}
            </div>

            <div className="productControls">
              <div className="colorsLabel">{product.variants.length} colors</div>
              <SwatchRow
                variants={product.variants}
                selectedId={variant.id}
                onSelect={(id) => {
                  setVariantId(id);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
