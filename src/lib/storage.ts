const isBrowser = typeof window !== "undefined";

export function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function removeKey(key: string) {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const storageKeys = {
  products: "dmw_products_v1",
  cart: "dmw_cart_v1",
  wishlist: "dmw_wishlist_v1",
  compare: "dmw_compare_v1",
  orders: "dmw_orders_v1",
  user: "dmw_user_v1",
  recent: "dmw_recent_v1",
} as const;
