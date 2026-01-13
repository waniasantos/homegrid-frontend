// src/components/Modal.jsx
import React, { useEffect } from "react";

export function Modal({ open, title, children, onClose, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,.55)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-xl rounded-2xl border overflow-hidden"
        style={{
          borderColor: "var(--border)",
          background: "rgba(15,23,42,.85)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,.08)" }}>
          <div className="text-sm opacity-70">HomeGrid</div>
          <div className="text-lg font-semibold">{title}</div>
        </div>

        <div className="p-4">{children}</div>

        <div
          className="p-4 border-t flex items-center justify-end gap-2"
          style={{ borderColor: "rgba(255,255,255,.08)" }}
        >
          {footer ?? (
            <button
              className="rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--border)",
                background: "rgba(255,255,255,.06)",
              }}
              onClick={onClose}
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
