// src/components/StatusBadges.jsx
import React from "react";

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
          borderColor: "rgba(59,130,246,.35)",
          background: "rgba(59,130,246,.12)",
        }}
      >
        Mock
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
