import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readJson, storageKeys, writeJson } from "../lib/storage";

type RecentApi = {
  ids: string[];
  track: (productId: string) => void;
  clear: () => void;
};

const RecentContext = createContext<RecentApi | null>(null);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readJson<string[]>(storageKeys.recent, []));

  useEffect(() => {
    writeJson(storageKeys.recent, ids);
  }, [ids]);

  const track = useCallback((productId: string) => {
    setIds((prev) => {
      const next = [productId, ...prev.filter((x) => x !== productId)];
      return next.slice(0, 12);
    });
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const api = useMemo<RecentApi>(() => ({ ids, track, clear }), [ids, track, clear]);

  return <RecentContext.Provider value={api}>{children}</RecentContext.Provider>;
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
