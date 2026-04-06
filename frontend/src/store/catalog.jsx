import React, { useEffect, useMemo, useReducer } from "react";
import { CatalogContext } from "./catalog-context.js";
import { BASE_PRODUCTS, CATEGORY_ORDER } from "../data/catalog.js";

const STORAGE_KEY = "dhakad_products_v1";

function safeParseProducts(value) {
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed) ? parsed : parsed?.products;
    if (!Array.isArray(list)) return null;

    const cleaned = list
      .filter((p) => p && typeof p.id === "string" && typeof p.title === "string")
      .map((p) => ({
        ...p,
        variants: Array.isArray(p.variants) ? p.variants : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
      }))
      .filter((p) => p.variants.length > 0);

    return cleaned.length > 0 ? cleaned : null;
  } catch {
    return null;
  }
}

function loadInitial() {
  if (typeof window === "undefined") return { products: BASE_PRODUCTS, source: "base" };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { products: BASE_PRODUCTS, source: "base" };

    const parsed = safeParseProducts(raw);
    if (!parsed) return { products: BASE_PRODUCTS, source: "base" };

    return { products: parsed, source: "custom" };
  } catch {
    return { products: BASE_PRODUCTS, source: "base" };
  }
}

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ensureId(product) {
  if (product.id && typeof product.id === "string") return product.id;
  const base = slugify(product.title) || "product";
  return `${base}-${Math.random().toString(16).slice(2, 6)}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "UPSERT": {
      const next = { ...action.product, id: ensureId(action.product) };
      const idx = state.products.findIndex((p) => p.id === next.id);
      if (idx === -1) return { products: [next, ...state.products], source: "custom" };

      const list = [...state.products];
      list[idx] = next;
      return { products: list, source: "custom" };
    }

    case "DELETE":
      return { products: state.products.filter((p) => p.id !== action.id), source: "custom" };

    case "RESET":
      return { products: BASE_PRODUCTS, source: "base" };

    default:
      return state;
  }
}

export function CatalogProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      if (state.source === "base") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ products: state.products }));
    } catch {
      // ignore
    }
  }, [state.products, state.source]);

  const api = useMemo(() => {
    const categories = ["All", ...CATEGORY_ORDER.filter((c) => state.products.some((p) => p.category === c))];

    return {
      products: state.products,
      categories,
      getById: (id) => state.products.find((p) => p.id === id) ?? null,
      upsert: (product) => dispatch({ type: "UPSERT", product }),
      remove: (id) => dispatch({ type: "DELETE", id }),
      reset: () => dispatch({ type: "RESET" }),
    };
  }, [state.products]);

  return <CatalogContext.Provider value={api}>{children}</CatalogContext.Provider>;
}
