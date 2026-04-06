import React, { useEffect, useMemo, useReducer } from "react";
import { CartContext } from "./cart-context.js";

const CART_STORAGE_KEY = "dhakad_cart_v2";

const COUPONS = {
  DHAKAD100: {
    label: "₹100 off",
    apply: (subtotal) => Math.min(100, subtotal),
  },
  WELCOME10: {
    label: "10% off (max ₹300)",
    apply: (subtotal) => Math.min(Math.round(subtotal * 0.1), 300),
  },
  RUNWAY15: {
    label: "15% off (max ₹500)",
    apply: (subtotal) => Math.min(Math.round(subtotal * 0.15), 500),
  },
};

function safeParseCart(value) {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return { items: [], couponCode: "" };

    const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
    const items = rawItems.filter((item) => item && typeof item.key === "string");

    const couponCode = typeof parsed.couponCode === "string" ? parsed.couponCode : "";

    return { items, couponCode };
  } catch {
    return { items: [], couponCode: "" };
  }
}

function loadInitialState() {
  if (typeof window === "undefined") return { items: [], couponCode: "" };
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return { items: [], couponCode: "" };
  return safeParseCart(raw);
}

function persist(state) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function buildKey(productId, size, color) {
  return [productId, size ?? "", color ?? ""].join("|");
}

function parsePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.floor(n));
}

function parseNonNegativeInt(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

function normalizeCoupon(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, options } = action.payload;
      const size = options?.size ?? product.sizes?.[0] ?? null;
      const color = options?.color ?? product.colors?.[0] ?? null;
      const quantity = parsePositiveInt(options?.quantity ?? 1, 1);

      const key = buildKey(product.id, size, color);
      const existingIndex = state.items.findIndex((i) => i.key === key);

      if (existingIndex >= 0) {
        const next = [...state.items];
        const existing = next[existingIndex];
        next[existingIndex] = { ...existing, quantity: existing.quantity + quantity };
        return { ...state, items: next };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            key,
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            compareAt: product.compareAt ?? null,
            size,
            color,
            quantity,
          },
        ],
      };
    }

    case "SET_QTY": {
      const { key, quantity } = action.payload;
      const nextQty = parseNonNegativeInt(quantity);
      const nextItems =
        nextQty === 0
          ? state.items.filter((i) => i.key !== key)
          : state.items.map((i) => (i.key === key ? { ...i, quantity: nextQty } : i));

      return { ...state, items: nextItems };
    }

    case "REMOVE_ITEM": {
      const { key } = action.payload;
      return { ...state, items: state.items.filter((i) => i.key !== key) };
    }

    case "COUPON_SET":
      return { ...state, couponCode: action.couponCode };

    case "COUPON_CLEAR":
      return { ...state, couponCode: "" };

    case "CLEAR":
      return { items: [], couponCode: "" };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    persist(state);
  }, [state]);

  const api = useMemo(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const compareTotal = state.items.reduce(
      (sum, item) => sum + (item.compareAt ? item.compareAt * item.quantity : item.price * item.quantity),
      0,
    );

    const normalizedCoupon = normalizeCoupon(state.couponCode);
    const couponMeta = normalizedCoupon ? COUPONS[normalizedCoupon] : null;
    const discount = couponMeta ? couponMeta.apply(subtotal) : 0;
    const coupon = normalizedCoupon
      ? {
          code: normalizedCoupon,
          valid: Boolean(couponMeta),
          label: couponMeta?.label ?? "Invalid coupon",
          discount,
        }
      : null;

    const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
    const total = Math.max(0, subtotal - discount) + shipping;

    return {
      items: state.items,
      itemCount,
      subtotal,
      compareTotal,
      discount,
      coupon,
      couponCode: state.couponCode,
      shipping,
      total,
      addItem: (product, options) => dispatch({ type: "ADD_ITEM", payload: { product, options } }),
      setQuantity: (key, quantity) => dispatch({ type: "SET_QTY", payload: { key, quantity } }),
      removeItem: (key) => dispatch({ type: "REMOVE_ITEM", payload: { key } }),
      clear: () => dispatch({ type: "CLEAR" }),
      setCouponCode: (couponCode) => dispatch({ type: "COUPON_SET", couponCode }),
      clearCoupon: () => dispatch({ type: "COUPON_CLEAR" }),
      applyCoupon: (couponCode) => {
        const normalized = normalizeCoupon(couponCode);
        if (!normalized) {
          dispatch({ type: "COUPON_CLEAR" });
          return { code: "", valid: true, cleared: true };
        }
        dispatch({ type: "COUPON_SET", couponCode: normalized });
        const meta = COUPONS[normalized];
        return { code: normalized, valid: Boolean(meta), label: meta?.label ?? "Invalid coupon" };
      },
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}



