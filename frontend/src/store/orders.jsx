import React, { useEffect, useMemo, useReducer } from "react";
import { OrdersContext } from "./orders-context.js";

const STORAGE_KEY = "dhakad_orders_v1";

function makeOrderId() {
  const part = Math.random().toString(16).slice(2, 8).toUpperCase();
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `DMW-${y}${m}${d}-${part}`;
}

function safeParse(value) {
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed.orders) ? parsed.orders : Array.isArray(parsed) ? parsed : [];
    return list.filter((o) => o && typeof o.id === "string");
  } catch {
    return [];
  }
}

function loadInitial() {
  if (typeof window === "undefined") return { orders: [] };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { orders: [] };
    return { orders: safeParse(raw) };
  } catch {
    return { orders: [] };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return { orders: [action.order, ...state.orders] };

    case "STATUS": {
      const next = state.orders.map((o) => (o.id === action.orderId ? { ...o, status: action.status } : o));
      return { orders: next };
    }

    case "CLEAR":
      return { orders: [] };

    default:
      return state;
  }
}

export function OrdersProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ orders: state.orders }));
    } catch {
      // ignore
    }
  }, [state.orders]);

  const api = useMemo(() => {
    function createOrder(payload) {
      const now = Date.now();
      const order = {
        id: makeOrderId(),
        createdAt: now,
        status: "placed",
        ...payload,
      };
      dispatch({ type: "CREATE", order });
      return order;
    }

    return {
      orders: state.orders,
      getById: (orderId) => state.orders.find((o) => o.id === orderId) ?? null,
      createOrder,
      setStatus: (orderId, status) => dispatch({ type: "STATUS", orderId, status }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.orders]);

  return <OrdersContext.Provider value={api}>{children}</OrdersContext.Provider>;
}
