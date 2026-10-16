import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Order, OrderStatus } from "../data/types";
import { readJson, storageKeys, writeJson } from "../lib/storage";

type OrdersApi = {
  orders: Order[];
  getById: (id: string) => Order | undefined;
  create: (order: Order) => void;
  setStatus: (id: string, status: OrderStatus) => void;
};

const OrdersContext = createContext<OrdersApi | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => readJson<Order[]>(storageKeys.orders, []));

  useEffect(() => {
    writeJson(storageKeys.orders, orders);
  }, [orders]);

  const getById = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const create = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const setStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const api = useMemo<OrdersApi>(() => ({ orders, getById, create, setStatus }), [orders, getById, create, setStatus]);

  return <OrdersContext.Provider value={api}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
