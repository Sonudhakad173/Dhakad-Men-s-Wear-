import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readJson, storageKeys, writeJson } from "../lib/storage";

type CompareApi = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => { added: boolean; reason?: string };
  clear: () => void;
};

const CompareContext = createContext<CompareApi | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readJson<string[]>(storageKeys.compare, []));

  useEffect(() => {
    writeJson(storageKeys.compare, ids);
  }, [ids]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    let res: { added: boolean; reason?: string } = { added: false };

    setIds((prev) => {
      if (prev.includes(id)) {
        res = { added: false };
        return prev.filter((x) => x !== id);
      }

      if (prev.length >= 3) {
        res = { added: false, reason: "You can compare up to 3 items." };
        return prev;
      }

      res = { added: true };
      return [id, ...prev];
    });

    return res;
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const api = useMemo<CompareApi>(() => ({ ids, has, toggle, clear }), [ids, has, toggle, clear]);

  return <CompareContext.Provider value={api}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
