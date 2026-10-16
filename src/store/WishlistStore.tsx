import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readJson, storageKeys, writeJson } from "../lib/storage";

type WishlistApi = {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => boolean;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
};

const WishlistContext = createContext<WishlistApi | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readJson<string[]>(storageKeys.wishlist, []));

  useEffect(() => {
    writeJson(storageKeys.wishlist, ids);
  }, [ids]);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const add = useCallback((productId: string) => {
    setIds((prev) => (prev.includes(productId) ? prev : [productId, ...prev]));
  }, []);

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((x) => x !== productId));
  }, []);

  const clear = useCallback(() => {
    setIds([]);
  }, []);

  const toggle = useCallback((productId: string) => {
    let now = false;
    setIds((prev) => {
      if (prev.includes(productId)) {
        now = false;
        return prev.filter((x) => x !== productId);
      }
      now = true;
      return [productId, ...prev];
    });
    return now;
  }, []);

  const api = useMemo<WishlistApi>(
    () => ({ ids, has, toggle, add, remove, clear, count: ids.length }),
    [ids, has, toggle, add, remove, clear],
  );

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
