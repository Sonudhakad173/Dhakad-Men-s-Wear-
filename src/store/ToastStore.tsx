import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { makeId } from "../lib/ids";

export type ToastKind = "success" | "error" | "info";

export type Toast = {
  id: string;
  kind: ToastKind;
  message: string;
};

type ToastApi = {
  toasts: Toast[];
  push: (kind: ToastKind, message: string) => void;
  dismiss: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = makeId("toast");
      const next: Toast = { id, kind, message };
      setToasts((t) => [next, ...t].slice(0, 4));

      window.setTimeout(() => dismiss(id), 2600);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      toasts,
      push,
      dismiss,
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [toasts, push, dismiss],
  );

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toastViewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`toast toast-${t.kind}`}
          onClick={() => dismiss(t.id)}
          title="Dismiss"
        >
          <span className="toastDot" />
          <span className="toastMsg">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
