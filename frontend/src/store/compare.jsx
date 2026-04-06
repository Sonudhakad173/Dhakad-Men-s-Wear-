import React, { useEffect, useMemo, useReducer } from "react";
import { CompareContext } from "./compare-context.js";

const STORAGE_KEY = "dhakad_compare_v1";
const MAX_ITEMS = 3;

function safeParse(value) {
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed.items) ? parsed.items : Array.isArray(parsed) ? parsed : [];
    return list
      .filter((i) => i && typeof i.productId === "string")
      .slice(0, MAX_ITEMS)
      .map((i) => ({
        productId: i.productId,
        variantId: typeof i.variantId === "string" ? i.variantId : null,
      }));
  } catch {
    return [];
  }
}

function loadInitial() {
  if (typeof window === "undefined") return { items: [] };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    return { items: safeParse(raw) };
  } catch {
    return { items: [] };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      const idx = state.items.findIndex((i) => i.productId === action.productId);
      if (idx >= 0) return { items: state.items.filter((i) => i.productId !== action.productId) };
      if (state.items.length >= MAX_ITEMS) return state;
      return { items: [{ productId: action.productId, variantId: action.variantId ?? null }, ...state.items] };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.productId !== action.productId) };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

export function CompareProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      // ignore
    }
  }, [state.items]);

  const api = useMemo(() => {
    return {
      items: state.items,
      count: state.items.length,
      max: MAX_ITEMS,
      has: (productId) => state.items.some((i) => i.productId === productId),
      canAddMore: state.items.length < MAX_ITEMS,
      toggle: (productId, variantId) => dispatch({ type: "TOGGLE", productId, variantId }),
      remove: (productId) => dispatch({ type: "REMOVE", productId }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CompareContext.Provider value={api}>{children}</CompareContext.Provider>;
}
