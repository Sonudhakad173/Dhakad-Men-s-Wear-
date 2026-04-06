import { createContext, useContext } from "react";

export const OrdersContext = createContext(null);

export function useOrders() {
  const value = useContext(OrdersContext);
  if (!value) throw new Error("useOrders must be used within OrdersProvider");
  return value;
}
