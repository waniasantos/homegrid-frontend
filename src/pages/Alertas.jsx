// src/pages/Alertas.jsx
import React from "react";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/State";
import { StatusBadges } from "../components/StatusBadges";

export default function Alertas() {
  const { loading, error, data, updatedAt, reload } = useAsync(() => api.alertas(), []);

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border p-4 flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div className="text-xs opacity-70">HomeGrid</div>
          <div className="text-lg font-semibold">Alertas</div>
        </div>
        <StatusBadges updatedAt={updatedAt} onReload={reload} />
      </div>

      {loading && <LoadingBlock title="Carregando alertas..." />}
      {error && <ErrorBlock error={error} onRetry={reload} />}

      {!loading && !error && (
        <>
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="text-3xl font-bold">Alertas</div>
            <div className="mt-1 text-sm opacity-80">
              Eventos de tarifa alta, orçamento e comportamento suspeito.
            </div>
          </div>

          {!data?.items?.length ? (
            <EmptyBlock title="Nenhum alerta no momento." subtitle="Tudo certo por aqui ✅" />
          ) : (
            <div className="space-y-3">
              {data.items.map((a) => (
                <AlertItem key={a.id} a={a} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AlertItem({ a }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.03)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm opacity-70">{a.tipo || "Alerta"}</div>
          <div className="text-lg font-semibold">{a.titulo}</div>
          <div className="text-sm opacity-80 mt-1">{a.descricao}</div>
        </div>
        <span
          className="rounded-full border px-3 py-1 text-xs"
          style={{ borderColor: "rgba(245,158,11,.35)", background: "rgba(245,158,11,.12)" }}
        >
          {a.nivel || "INFO"}
        </span>
      </div>
    </div>
  );
}
