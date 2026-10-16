import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { RecentContext } from "./recent-context.js";

const STORAGE_KEY = "dhakad_recent_v1";
const LIMIT = 12;

function safeParse(value) {
  try {
    const parsed = JSON.parse(value);
    const list = Array.isArray(parsed.items) ? parsed.items : Array.isArray(parsed) ? parsed : [];
    return list.filter((id) => typeof id === "string").slice(0, LIMIT);
  } catch {
    return [];
  }
}

function loadInitial() {
  if (typeof window === "undefined") return { ids: [] };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ids: [] };
    return { ids: safeParse(raw) };
  } catch {
    return { ids: [] };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "TRACK": {
      const next = [action.productId, ...state.ids.filter((id) => id !== action.productId)].slice(0, LIMIT);
      return { ids: next };
    }

    case "CLEAR":
      return { ids: [] };

    default:
      return state;
  }
}

export function RecentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.ids }));
    } catch {
      // ignore
    }
  }, [state.ids]);

  const track = useCallback((productId) => dispatch({ type: "TRACK", productId }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const api = useMemo(() => {
    return {
      ids: state.ids,
      track,
      clear,
    };
  }, [state.ids, track, clear]);

  return <RecentContext.Provider value={api}>{children}</RecentContext.Provider>;
}
