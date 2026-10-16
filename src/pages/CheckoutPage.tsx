import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { couponPresets } from "../data/seedProducts";
import type { Order } from "../data/types";
import { makeOrderId } from "../lib/ids";
import { formatINR } from "../lib/money";
import { useCart } from "../store/CartStore";
import { useOrders } from "../store/OrdersStore";
import { useProducts } from "../store/ProductsStore";
import { useToast } from "../store/ToastStore";

const deliverySlots = [
  "10:00 AM - 01:00 PM",
  "01:00 PM - 04:00 PM",
  "04:00 PM - 07:00 PM",
];

type Payment = Order["paymentMethod"];

function isNonNull<T>(x: T | null | undefined): x is T {
  return x != null;
}

function StepPill({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div
      className={["stepPill", active && "stepPill--active", done && "stepPill--done"]
        .filter(Boolean)
        .join(" ")}
    >
      {n}
    </div>
  );
}

export function CheckoutPage() {
  const { lines, clear } = useCart();
  const { getById } = useProducts();
  const orders = useOrders();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const preCoupon = (location.state as any)?.coupon as string | null | undefined;

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

  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState(preCoupon ?? "");
  const [applied, setApplied] = useState<string | null>(preCoupon ?? null);

  const [address, setAddress] = useState<Order["shippingAddress"]>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Madhya Pradesh",
    pincode: "",
  });

  const [slot, setSlot] = useState(deliverySlots[0]);
  const [payment, setPayment] = useState<Payment>("COD");

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

  function canGoNext() {
    if (step === 1) {
      return (
        address.fullName.trim() &&
        address.phone.trim().length >= 10 &&
        address.addressLine1.trim() &&
        address.city.trim() &&
        address.state.trim() &&
        address.pincode.trim().length >= 5
      );
    }
    return true;
  }

  function placeOrder() {
    const orderId = makeOrderId();
    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: detailed.map((x) => ({
        productId: x.product.id,
        title: x.product.title,
        variantId: x.variant.id,
        colorName: x.variant.colorName,
        size: x.line.size,
        qty: x.line.qty,
        unitPrice: x.product.price,
        image: x.image,
      })),
      pricing: {
        subtotal,
        discount,
        shipping,
        total,
        coupon: applied ?? undefined,
      },
      shippingAddress: address,
      deliverySlot: slot,
      paymentMethod: payment,
      status: "placed",
    };

    orders.create(order);
    clear();
    toast.success("Order placed successfully");
    navigate(`/checkout/success/${orderId}`);
  }

  if (lines.length === 0) {
    return (
      <div className="container" style={{ padding: "96px 0 90px" }}>
        <div className="kicker">Checkout</div>
        <h1 className="h2" style={{ margin: "10px 0 6px" }}>
          Your cart is empty
        </h1>
        <Link to="/shop" className="btn btnPrimary">
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "86px 0 90px" }}>
      <div className="pageHead">
        <div>
          <div className="kicker">Checkout</div>
          <h1 className="h2" style={{ margin: "10px 0 0" }}>
            Complete your order
          </h1>
        </div>
        <Link to="/cart" className="btn">
          Back to cart
        </Link>
      </div>

      <div className="steps">
        <StepPill n={1} active={step === 1} done={step > 1} />
        <div className="stepLine" />
        <StepPill n={2} active={step === 2} done={step > 2} />
        <div className="stepLine" />
        <StepPill n={3} active={step === 3} done={step > 3} />
        <div className="stepLine" />
        <StepPill n={4} active={step === 4} done={false} />
      </div>

      <div className="checkoutLayout">
        <div className="checkoutMain card">
          {step === 1 && (
            <div>
              <div className="checkoutTitle">Address</div>
              <div className="formGrid">
                <label className="field">
                  <span className="fieldLabel">Full name</span>
                  <input
                    value={address.fullName}
                    onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                    placeholder="Your name"
                  />
                </label>
                <label className="field">
                  <span className="fieldLabel">Phone</span>
                  <input
                    value={address.phone}
                    onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                    placeholder="+91"
                  />
                </label>
                <label className="field" style={{ gridColumn: "1 / -1" }}>
                  <span className="fieldLabel">Address line 1</span>
                  <input
                    value={address.addressLine1}
                    onChange={(e) => setAddress((a) => ({ ...a, addressLine1: e.target.value }))}
                    placeholder="House / Street"
                  />
                </label>
                <label className="field" style={{ gridColumn: "1 / -1" }}>
                  <span className="fieldLabel">Address line 2 (optional)</span>
                  <input
                    value={address.addressLine2}
                    onChange={(e) => setAddress((a) => ({ ...a, addressLine2: e.target.value }))}
                    placeholder="Landmark"
                  />
                </label>
                <label className="field">
                  <span className="fieldLabel">City</span>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                    placeholder="Indore"
                  />
                </label>
                <label className="field">
                  <span className="fieldLabel">State</span>
                  <input
                    value={address.state}
                    onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                    placeholder="Madhya Pradesh"
                  />
                </label>
                <label className="field">
                  <span className="fieldLabel">Pincode</span>
                  <input
                    value={address.pincode}
                    onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))}
                    placeholder="452001"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="checkoutTitle">Delivery slot</div>
              <div className="slotGrid">
                {deliverySlots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={["slot", slot === s && "slot--active"].filter(Boolean).join(" ")}
                    onClick={() => setSlot(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="checkoutTitle">Payment method</div>
              <div className="payGrid">
                {(["COD", "UPI", "Card"] as Payment[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={["pay", payment === p && "pay--active"].filter(Boolean).join(" ")}
                    onClick={() => setPayment(p)}
                  >
                    <div className="payTitle">
                      {p === "COD" ? "Cash on Delivery" : p}
                    </div>
                    <div className="payHint">
                      {p === "COD" && "Pay when it arrives."}
                      {p === "UPI" && "Pay instantly using UPI."}
                      {p === "Card" && "Visa / Mastercard / RuPay."}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="checkoutTitle">Review</div>
              <div className="reviewBlock">
                <div className="reviewHead">Shipping to</div>
                <div className="reviewText">
                  {address.fullName} • {address.phone}
                  <br />
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                  <br />
                  {address.city}, {address.state} {address.pincode}
                </div>
              </div>
              <div className="reviewBlock">
                <div className="reviewHead">Delivery slot</div>
                <div className="reviewText">{slot}</div>
              </div>
              <div className="reviewBlock">
                <div className="reviewHead">Payment</div>
                <div className="reviewText">{payment}</div>
              </div>
              <div className="reviewBlock">
                <div className="reviewHead">Items</div>
                <div className="reviewItems">
                  {detailed.map((x) => (
                    <div key={x.line.key} className="reviewItem">
                      <img src={x.image} alt="" className="reviewImg" />
                      <div>
                        <div className="reviewTitle">{x.product.title}</div>
                        <div className="reviewMeta">
                          {x.variant.colorName} • {x.line.size} • Qty {x.line.qty}
                        </div>
                      </div>
                      <div className="reviewPrice">{formatINR(x.lineTotal)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" className="btn btnPrimary" onClick={placeOrder}>
                Place order
              </button>
            </div>
          )}

          <div className="checkoutNav">
            <button
              type="button"
              className="btn"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                className="btn btnPrimary"
                onClick={() => {
                  if (!canGoNext()) {
                    toast.error("Please complete the required fields");
                    return;
                  }
                  setStep((s) => Math.min(4, s + 1));
                }}
              >
                Continue
              </button>
            ) : null}
          </div>
        </div>

        <div className="checkoutSide card">
          <div className="summaryTitle">Summary</div>

          <div className="couponBox">
            <div className="couponTop">Coupon</div>
            <div className="couponRow">
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="DHAKAD10" />
              <button type="button" className="btn" onClick={applyCoupon}>
                Apply
              </button>
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

          <div className="summaryHint">
            Secure demo checkout. Orders are saved in local storage and visible in Admin.
          </div>
        </div>
      </div>
    </div>
  );
}
