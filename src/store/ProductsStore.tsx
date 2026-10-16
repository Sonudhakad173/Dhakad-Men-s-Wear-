import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "../data/types";
import { seedProducts } from "../data/seedProducts";
import { readJson, storageKeys, writeJson } from "../lib/storage";

type ProductsApi = {
  products: Product[];
  getById: (id: string) => Product | undefined;
  upsert: (product: Product) => void;
  remove: (id: string) => void;
  resetToSeed: () => void;
};

const REMOVED_PRODUCT_IDS = new Set(["plain-shirt", "plain shirt", "plain_shirt", "plainshirt"]);
const REMOVED_PRODUCT_TITLES = new Set(["plain shirt"]);

function sanitizeProducts(list: Product[]) {
  return list.filter((p) => {
    if (REMOVED_PRODUCT_IDS.has(p.id)) return false;
    const normalizedTitle = p.title.trim().toLowerCase();
    if (REMOVED_PRODUCT_TITLES.has(normalizedTitle)) return false;
    return true;
  });
}

const ProductsContext = createContext<ProductsApi | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = readJson<Product[] | null>(storageKeys.products, null);
    const base = saved && saved.length > 0 ? saved : seedProducts;
    return sanitizeProducts(base);
  });

  useEffect(() => {
    writeJson(storageKeys.products, products);
  }, [products]);

  const getById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );

  const upsert = useCallback((product: Product) => {
    const normalizedTitle = product.title.trim().toLowerCase();
    if (REMOVED_PRODUCT_IDS.has(product.id)) return;
    if (REMOVED_PRODUCT_TITLES.has(normalizedTitle)) return;

    setProducts((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i === -1) return [product, ...prev];
      const next = prev.slice();
      next[i] = product;
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetToSeed = useCallback(() => {
    setProducts(sanitizeProducts(seedProducts));
  }, []);

  const api = useMemo<ProductsApi>(
    () => ({ products, getById, upsert, remove, resetToSeed }),
    [products, getById, upsert, remove, resetToSeed],
  );

  return (
    <ProductsContext.Provider value={api}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
