// src/pages/Anomalias.jsx
import React, { useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { Modal } from "../components/Modal";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/State";

export default function Anomalias() {
  const { loading, error, data, updatedAt, reload } = useAsync(() => api.anomalias(), []);
  const [openId, setOpenId] = useState(null);

  const selected = useMemo(() => {
    return data?.items?.find((x) => x.id === openId) || null;
  }, [data, openId]);

  return (
    <div className="space-y-4">
      {loading && <LoadingBlock title="Carregando anomalias..." />}
      {error && <ErrorBlock error={error} onRetry={reload} />}

      {!loading && !error && (
        <>
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="text-3xl font-bold">Anomalias</div>
            <div className="mt-1 text-sm opacity-80">
              Detecções de consumo fora do padrão por dispositivo.
            </div>
          </div>

          {!data?.items?.length ? (
            <EmptyBlock
              title="Nenhuma anomalia detectada."
              subtitle="O consumo está dentro do padrão."
            />
          ) : (
            <div className="space-y-3">
              {data.items.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: "var(--border)",
                    background: "rgba(255,255,255,.03)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs opacity-70">{a.dispositivo}</div>
                      <div className="text-lg font-semibold">{a.titulo}</div>
                      <div className="text-sm opacity-80 mt-1">{a.descricao}</div>
                      <div className="text-xs opacity-60 mt-2">
                        {new Date(a.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge nivel={a.nivel} />
                      <button
                        className="rounded-xl border px-3 py-2 text-sm"
                        style={{
                          borderColor: "var(--border)",
                          background: "rgba(255,255,255,.06)",
                        }}
                        onClick={() => setOpenId(a.id)}
                      >
                        Ver detalhe →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        open={!!selected}
        title="Detalhe da anomalia"
        onClose={() => setOpenId(null)}
        footer={
          <button
            className="rounded-xl border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.06)" }}
            onClick={() => setOpenId(null)}
          >
            Fechar
          </button>
        }
      >
        {selected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs opacity-70">{selected.dispositivo}</div>
                <div className="text-lg font-semibold">{selected.titulo}</div>
              </div>
              <Badge nivel={selected.nivel} />
            </div>
            <div className="text-sm opacity-80">{selected.descricao}</div>

            <div className="rounded-xl border p-3 text-sm"
              style={{ borderColor: "rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)" }}
            >
              <div className="text-xs opacity-70">Timestamp</div>
              <div className="font-semibold">{new Date(selected.timestamp).toLocaleString()}</div>
            </div>

            <div className="text-xs opacity-70">
              Depois: detalhar métricas (kWh esperado vs atual), histórico do dispositivo e ações recomendadas.
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function Badge({ nivel }) {
  const cfg =
    nivel === "ALTA"
      ? { border: "rgba(239,68,68,.35)", bg: "rgba(239,68,68,.12)", text: "rgba(239,68,68,1)" }
      : nivel === "MEDIA"
      ? { border: "rgba(245,158,11,.35)", bg: "rgba(245,158,11,.12)", text: "rgba(245,158,11,1)" }
      : { border: "rgba(59,130,246,.35)", bg: "rgba(59,130,246,.12)", text: "rgba(59,130,246,1)" };

  return (
    <span
      className="rounded-full border px-3 py-1 text-xs"
      style={{ borderColor: cfg.border, background: cfg.bg, color: cfg.text }}
    >
      {nivel}
    </span>
  );
}
