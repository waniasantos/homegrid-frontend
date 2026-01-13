// src/pages/Dashboard.jsx
import React from "react";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/State";

export default function Dashboard() {
  const { loading, error, data, updatedAt, reload } = useAsync(() => api.dashboard(), []);

  return (
    <div className="space-y-4">
      {loading && <LoadingBlock title="Carregando dashboard..." />}
      {error && <ErrorBlock error={error} onRetry={reload} />}

      {!loading && !error && !data && (
        <EmptyBlock title="Sem dados" subtitle="Nenhum dado disponível para o dashboard." />
      )}

      {!loading && !error && data && (
        <>
          {/* Cards topo */}
          <div className="grid gap-4 lg:grid-cols-4">
            <MetricCard
              title="Consumo atual"
              value={`${data.cards.consumoAtualKw.toFixed(2)} kW`}
              sub="Atualiza a cada 5s"
            />
            <MetricCard
              title="Custo hoje"
              value={`R$ ${data.cards.custoHoje.toFixed(2)}`}
              sub={`${(data.cards.custoHoje / data.cards.tarifa).toFixed(2)} kWh`}
            />
            <MetricCard
              title="Custo no mês"
              value={`R$ ${data.cards.custoMes.toFixed(2)}`}
              sub={`${data.cards.consumoMesKwh.toFixed(0)} kWh`}
            />
            <MetricCard
              title="Tarifa"
              value={`R$ ${data.cards.tarifa.toFixed(2)}/kWh`}
              sub="Configuração"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Série */}
            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="font-semibold">Últimos 60 min</div>
              <div className="text-xs opacity-70">Potência (kW)</div>

              {/* gráfico simples (área fake) */}
              <div
                className="mt-4 h-56 rounded-xl border"
                style={{
                  borderColor: "rgba(255,255,255,.08)",
                  background: "rgba(255,255,255,.03)",
                }}
              >
                <div className="h-full w-full flex items-end gap-[2px] p-3">
                  {data.serie.slice(0, 60).map((p) => (
                    <div
                      key={p.t}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${Math.max(3, Math.min(100, (p.kw / 5) * 90))}%`,
                        background: "rgba(35,162,217,.35)",
                        border: "1px solid rgba(255,255,255,.05)",
                      }}
                      title={`${p.kw} kW`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Vilões */}
            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="font-semibold">Vilões do consumo (hoje)</div>
              <div className="text-xs opacity-70">Top dispositivos por kWh</div>

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
                    {data.viloesHoje.map((r) => (
                      <tr key={r.dispositivo} className="border-t border-white/10">
                        <td className="py-3">{r.dispositivo}</td>
                        <td className="py-3 text-right">{r.kwh.toFixed(2)}</td>
                        <td className="py-3 text-right">R$ {r.custo.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-xs opacity-70">
                * Mock ativo. Depois é só trocar <b>VITE_USE_MOCK</b>.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ title, value, sub }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: "var(--border)",
        background: "rgba(255,255,255,.04)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="text-sm opacity-80">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs opacity-70">{sub}</div>
    </div>
  );
}
