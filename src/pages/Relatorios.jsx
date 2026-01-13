// src/pages/Relatorios.jsx
import React, { useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/State";

// Se você já tem Card/Table/Select no seu ui.jsx, pode trocar pelos seus.
// Aqui usei HTML simples + classes pra não quebrar.
export default function Relatorios() {
  const [period, setPeriod] = useState("7d");

  const { loading, error, data, updatedAt, reload } = useAsync(
    () => api.relatorios({ period }),
    [period]
  );

  const total = useMemo(() => {
    if (!data?.serie?.length) return { kwh: 0, custo: 0 };
    return data.serie.reduce(
      (acc, d) => ({ kwh: acc.kwh + (d.kwh || 0), custo: acc.custo + (d.custo || 0) }),
      { kwh: 0, custo: 0 }
    );
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Conteúdo */}
      {loading && <LoadingBlock title="Carregando relatórios..." />}
      {error && <ErrorBlock error={error} onRetry={reload} />}

      {!loading && !error && (
        <>
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-bold">Relatórios</div>
                <div className="mt-1 text-sm opacity-80">
                  Histórico por período (kWh e R$), filtros e ranking.
                </div>
              </div>

              <div className="flex items-end gap-3">
                <div>
                  <div className="text-xs opacity-70 mb-1">Período</div>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="rounded-xl border px-3 py-2 text-sm"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "#0F172A",
                      color: "var(--text)",
                    }}
                  >
                    <option value="7d">Últimos 7 dias</option>
                    <option value="14d">Últimos 14 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                  </select>
                </div>

                <div className="rounded-xl border px-3 py-2 text-sm"
                  style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.06)" }}
                  title="Soma aproximada do período"
                >
                  <div className="text-xs opacity-70">Total</div>
                  <div className="font-semibold">
                    {total.kwh.toFixed(1)} kWh · R$ {total.custo.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!data?.serie?.length ? (
            <EmptyBlock
              title="Sem dados no período"
              subtitle="Tente selecionar outro intervalo de datas."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Série (mock gráfico simples) */}
              <div
                className="rounded-2xl border p-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Série do período</div>
                    <div className="text-xs opacity-70">kWh por dia (mock)</div>
                  </div>
                  <span
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.06)" }}
                  >
                    {period}
                  </span>
                </div>

                <div className="mt-4 flex gap-2 items-end h-48">
                  {data.serie.map((d) => (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-lg"
                        style={{
                          height: `${Math.max(6, (d.kwh / 20) * 180)}px`,
                          background: "rgba(35,162,217,.35)",
                          border: "1px solid rgba(255,255,255,.08)",
                        }}
                        title={`${d.label}: ${d.kwh} kWh`}
                      />
                      <div className="text-xs opacity-70">{d.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-xs opacity-70">
                  Depois: permitir alternar para “R$” e exportar CSV/PDF.
                </div>
              </div>

              {/* Ranking */}
              <div
                className="rounded-2xl border p-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Ranking de consumo</div>
                    <div className="text-xs opacity-70">Vilões por kWh no período</div>
                  </div>
                  <span
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{
                      borderColor: "rgba(245,158,11,.35)",
                      background: "rgba(245,158,11,.12)",
                      color: "rgba(245,158,11,1)",
                    }}
                  >
                    Top
                  </span>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="opacity-80">
                      <tr>
                        <th className="text-left py-2">Dispositivo</th>
                        <th className="text-right py-2">kWh</th>
                        <th className="text-right py-2">R$</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ranking.map((r) => (
                        <tr key={r.dispositivo} className="border-t border-white/10">
                          <td className="py-3">{r.dispositivo}</td>
                          <td className="py-3 text-right">{r.kwh}</td>
                          <td className="py-3 text-right">R$ {r.custo.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    className="rounded-xl border px-3 py-2 text-sm"
                    style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.06)" }}
                    onClick={() => exportCsv(data, period)}
                  >
                    Exportar CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function exportCsv(data, period) {
  const rows = [
    ["periodo", period],
    [],
    ["Serie (label)", "kWh", "R$"],
    ...(data?.serie || []).map((d) => [d.label, d.kwh, d.custo]),
    [],
    ["Ranking", "kWh", "R$"],
    ...(data?.ranking || []).map((r) => [r.dispositivo, r.kwh, r.custo]),
  ];

  const csv = rows
    .map((r) => r.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(";"))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `homegrid-relatorios-${period}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
