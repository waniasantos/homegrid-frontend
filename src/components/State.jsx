// src/components/State.jsx
import React from "react";

export function LoadingBlock({ title = "Carregando..." }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="mt-3 h-3 w-2/3 rounded bg-white/10" />
      <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
      <div className="mt-6 h-32 rounded-xl bg-white/5" />
    </div>
  );
}

export function ErrorBlock({ error, onRetry }) {
  const msg = error?.message || "Erro ao carregar.";
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
      <div className="text-sm font-semibold">Algo deu errado</div>
      <div className="mt-1 text-sm opacity-80">{msg}</div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onRetry}
          className="rounded-xl border px-3 py-2 text-sm"
          style={{
            borderColor: "var(--border)",
            background: "rgba(255,255,255,.06)",
          }}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export function EmptyBlock({ title = "Nada por aqui", subtitle = "Sem registros para exibir." }) {
  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm opacity-80">{subtitle}</div>
    </div>
  );
}
