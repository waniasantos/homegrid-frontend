import React from "react";
import { USE_MOCK } from "../lib/api";

function fmtTime(d) {
  if (!d) return "--:--:--";
  try {
    return new Date(d).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "--:--:--";
  }
}

export function StatusBadges({ updatedAt, onReload }) {
  const time = fmtTime(updatedAt);

  return (
    <div className="flex items-center gap-2">
      <span
        className="rounded-full border px-3 py-1 text-xs"
        style={{
          borderColor: USE_MOCK ? "rgba(59,130,246,.35)" : "rgba(34,197,94,.35)",
          background: USE_MOCK ? "rgba(59,130,246,.12)" : "rgba(34,197,94,.12)",
        }}
      >
        {USE_MOCK ? "Mock" : "API Real"}
      </span>

      <button
        type="button"
        onClick={onReload}
        className="rounded-full border px-3 py-1 text-xs transition hover:bg-white/10"
        style={{
          borderColor: "rgba(255,255,255,.14)",
          background: "rgba(255,255,255,.06)",
        }}
        title="Recarregar dados"
      >
        Atualizar · {time}
      </button>
    </div>
  );
}
