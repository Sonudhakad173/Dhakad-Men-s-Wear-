import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { ToastContext } from "./toast-context.js";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `t_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function toastReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.toast, ...state].slice(0, 4);
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

function ToastIcon({ type }) {
  const base = "h-5 w-5";
  if (type === "success") {
    return (
      <svg viewBox="0 0 24 24" className={`${base} text-emerald`} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg viewBox="0 0 24 24" className={`${base} text-rose-500`} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={`${base} text-slate-500`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
      <path d="M10.29 3.86h3.42L21 11.15v1.7l-7.29 7.29h-3.42L3 12.85v-1.7L10.29 3.86Z" />
    </svg>
  );
}

function ToastCard({ toast, onClose }) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft-xl dark:border-slate-800 dark:bg-black">
      <div className="flex items-start gap-3 p-4">
        <ToastIcon type={toast.type} />
        <div className="min-w-0 flex-1">
          {toast.title ? (
            <div className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{toast.title}</div>
          ) : null}
          <div className="mt-0.5 text-sm font-semibold text-slate-600 dark:text-slate-300">{toast.message}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="h-1 bg-emerald/20">
        <div className="h-full w-full origin-left animate-[toastbar_var(--toast-dur)_linear_forwards] bg-emerald" />
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const timeouts = useRef(new Map());

  useEffect(() => {
    const timeoutsMap = timeouts.current;

    return () => {
      for (const id of timeoutsMap.values()) window.clearTimeout(id);
      timeoutsMap.clear();
    };
  }, []);

  const api = useMemo(() => {
    function remove(id) {
      const timeout = timeouts.current.get(id);
      if (timeout) window.clearTimeout(timeout);
      timeouts.current.delete(id);
      dispatch({ type: "REMOVE", id });
    }

    function push({ type = "info", title, message, durationMs = 2600 }) {
      const id = makeId();
      dispatch({ type: "ADD", toast: { id, type, title, message, durationMs } });
      const timeoutId = window.setTimeout(() => remove(id), durationMs);
      timeouts.current.set(id, timeoutId);
      return id;
    }

    return {
      toasts,
      clear: () => dispatch({ type: "CLEAR" }),
      remove,
      push,
      success: (message, opts) => push({ type: "success", message, ...opts }),
      error: (message, opts) => push({ type: "error", message, ...opts }),
      info: (message, opts) => push({ type: "info", message, ...opts }),
    };
  }, [toasts]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto" style={{ "--toast-dur": `${t.durationMs}ms` }}>
            <ToastCard toast={t} onClose={() => api.remove(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
