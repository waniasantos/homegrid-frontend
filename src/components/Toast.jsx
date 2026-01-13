// src/components/Toast.jsx
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((toast) => {
    const id = crypto.randomUUID?.() || String(Date.now() + Math.random());
    const t = { id, type: "info", title: "Info", message: "", duration: 3000, ...toast };
    setItems((prev) => [...prev, t]);

    setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, t.duration);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}

      <div className="fixed right-4 top-4 z-50 space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border px-4 py-3 shadow-lg min-w-[260px] max-w-[360px]"
            style={{
              borderColor: "var(--border)",
              background:
                t.type === "success"
                  ? "rgba(34,197,94,.12)"
                  : t.type === "error"
                  ? "rgba(239,68,68,.12)"
                  : "rgba(255,255,255,.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="text-sm font-semibold">{t.title}</div>
            {t.message ? <div className="text-sm opacity-80 mt-0.5">{t.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
