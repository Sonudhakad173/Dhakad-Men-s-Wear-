import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { couponPresets } from "../data/seedProducts";
import { formatINR } from "../lib/money";
import { useCart } from "../store/CartStore";
import { useProducts } from "../store/ProductsStore";
import { useToast } from "../store/ToastStore";
import { IconMinus, IconPlus, IconTrash } from "../components/common/Icons";

function isNonNull<T>(x: T | null | undefined): x is T {
  return x != null;
}

export function CartPage() {
  const { lines, remove, setQty, clear } = useCart();
  const { getById } = useProducts();
  const toast = useToast();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);

  const detailed = useMemo(() => {
    return lines
      .map((l) => {
        const product = getById(l.productId);
        const variant = product?.variants.find((v) => v.id === l.variantId);
        if (!product || !variant) return null;
        return {
          line: l,
          product,
          variant,
          image: variant.images[0] ?? "",
          lineTotal: product.price * l.qty,
        };
      })
      .filter(isNonNull);
  }, [lines, getById]);

  const subtotal = detailed.reduce((s, x) => s + x.lineTotal, 0);
  const couponDef = couponPresets.find((c) => c.code === (applied ?? ""));
  const discount = couponDef ? Math.round((subtotal * couponDef.pctOff) / 100) : 0;
  const shipping = subtotal - discount >= 1500 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    const found = couponPresets.find((c) => c.code === code);
    if (!found) {
      toast.error("Invalid coupon code");
      setApplied(null);
      return;
    }
    setApplied(found.code);
    toast.success(`Coupon applied: ${found.label}`);
  }

  if (lines.length === 0) {
    return (
      <div className="container" style={{ padding: "96px 0 90px" }}>
        <div className="kicker">Cart</div>
        <h1 className="h1 pageTitle" style={{ margin: "10px 0 6px" }}>
          Your cart is empty
        </h1>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Pick a few pieces and build your premium fit.
        </p>
        <Link to="/shop" className="btn btnPrimary">
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "86px 0 90px" }}>
      <div className="pageHead">
        <div>
          <div className="kicker">Cart</div>
          <h1 className="h2" style={{ margin: "10px 0 0" }}>
            Your picks
          </h1>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            clear();
            toast.success("Cart cleared");
          }}
        >
          Clear cart
        </button>
      </div>

      <div className="cartLayout">
        <div className="cartList card">
          {detailed.map((x) => (
            <div key={x.line.key} className="cartRow">
              <img className="cartImg" src={x.image} alt={x.product.title} />
              <div className="cartInfo">
                <div className="cartTitle">{x.product.title}</div>
                <div className="cartMeta">
                  {x.variant.colorName} • Size {x.line.size}
                </div>
                <div className="qty">
                  <button
                    type="button"
                    className="qtyBtn"
                    onClick={() => {
                      const next = Math.max(1, x.line.qty - 1);
                      setQty(x.line.key, next);
                      toast.info("Quantity updated");
                    }}
                    aria-label="Decrease quantity"
                  >
                    <IconMinus size={18} />
                  </button>
                  <div className="qtyVal">{x.line.qty}</div>
                  <button
                    type="button"
                    className="qtyBtn"
                    onClick={() => {
                      const next = x.line.qty + 1;
                      setQty(x.line.key, next);
                      toast.info("Quantity updated");
                    }}
                    aria-label="Increase quantity"
                  >
                    <IconPlus size={18} />
                  </button>
                </div>
              </div>
              <div className="cartRight">
                <div className="cartPrice">{formatINR(x.lineTotal)}</div>
                <button
                  type="button"
                  className="iconBtn iconBtn--ghost"
                  onClick={() => {
                    remove(x.line.key);
                    toast.success("Removed from cart");
                  }}
                  aria-label="Remove"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cartSummary card">
          <div className="summaryTitle">Order summary</div>

          <div className="couponBox">
            <div className="couponTop">Coupon</div>
            <div className="couponRow">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="DHAKAD10"
                aria-label="Coupon code"
              />
              <button type="button" className="btn" onClick={applyCoupon}>
                Apply
              </button>
            </div>
            <div className="couponHint">
              Try: {couponPresets.map((c) => c.code).join(", ")}
            </div>
            {applied && <div className="couponApplied">Applied: {applied}</div>}
          </div>

          <div className="summaryLine">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="summaryLine">
            <span>Discount</span>
            <span>-{formatINR(discount)}</span>
          </div>
          <div className="summaryLine">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
          </div>
          <div className="summaryTotal">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>

          <button
            type="button"
            className="btn btnPrimary"
            onClick={() => navigate("/checkout", { state: { coupon: applied ?? null } })}
          >
            Checkout
          </button>
          <Link to="/shop" className="btn" style={{ textAlign: "center" }}>
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

