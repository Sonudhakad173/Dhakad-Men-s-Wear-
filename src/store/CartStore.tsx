import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "../data/types";
import { readJson, storageKeys, writeJson } from "../lib/storage";

type CartApi = {
  lines: CartLine[];
  add: (args: { productId: string; variantId: string; size: string; qty?: number }) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  totalQty: number;
};

const CartContext = createContext<CartApi | null>(null);

function makeKey(productId: string, variantId: string, size: string) {
  return `${productId}__${variantId}__${size}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() =>
    readJson<CartLine[]>(storageKeys.cart, []),
  );

  useEffect(() => {
    writeJson(storageKeys.cart, lines);
  }, [lines]);

  const add = useCallback(
    ({ productId, variantId, size, qty = 1 }: { productId: string; variantId: string; size: string; qty?: number }) => {
      const key = makeKey(productId, variantId, size);
      setLines((prev) => {
        const i = prev.findIndex((l) => l.key === key);
        if (i === -1) {
          return [
            {
              key,
              productId,
              variantId,
              size,
              qty,
              addedAt: new Date().toISOString(),
            },
            ...prev,
          ];
        }
        const next = prev.slice();
        next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) };
        return next;
      });
    },
    [],
  );

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    const nextQty = Math.max(1, Math.min(99, qty));
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: nextQty } : l)));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  const totalQty = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const api = useMemo<CartApi>(
    () => ({ lines, add, remove, setQty, clear, totalQty }),
    [lines, add, remove, setQty, clear, totalQty],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
