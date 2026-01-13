// src/pages/Configuracoes.jsx
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock } from "../components/State";
import { StatusBadges } from "../components/StatusBadges";
import { useToast } from "../components/Toast";

export default function Configuracoes() {
  const toast = useToast();
  const { loading, error, data, updatedAt, reload } = useAsync(() => api.configuracoes(), []);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSave() {
    if (!form) return;
    setSaving(true);
    try {
      await api.salvarConfiguracoes({
        tarifa: Number(form.tarifa),
        orcamentoMensal: Number(form.orcamentoMensal),
        notificacoesAtivas: !!form.notificacoesAtivas,
        naoPerturbeAtivo: !!form.naoPerturbeAtivo,
        naoPerturbeInicio: form.naoPerturbeInicio,
        naoPerturbeFim: form.naoPerturbeFim,
      });
      toast.push({ type: "success", title: "Salvo", message: "Configurações atualizadas." });
      reload();
    } catch (e) {
      toast.push({ type: "error", title: "Erro", message: e?.message || "Falha ao salvar." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border p-4 flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div className="text-xs opacity-70">HomeGrid</div>
          <div className="text-lg font-semibold">Configurações</div>
        </div>
        <StatusBadges updatedAt={updatedAt} onReload={reload} />
      </div>

      {loading && <LoadingBlock title="Carregando configurações..." />}
      {error && <ErrorBlock error={error} onRetry={reload} />}

      {!loading && !error && form && (
        <>
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="text-3xl font-bold">Configurações</div>
            <div className="mt-1 text-sm opacity-80">
              Tarifa, orçamento e preferências de notificação.
            </div>
          </div>

          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.03)" }}
          >
            <div className="space-y-4">
              <Row
                label="Tarifa (R$/kWh)"
                hint="Usada para estimar custo em R$."
                right={
                  <input
                    type="number"
                    step="0.01"
                    value={form.tarifa}
                    onChange={(e) => setField("tarifa", e.target.value)}
                    className="w-40 rounded-xl border px-3 py-2 text-sm"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "#0F172A",
                      color: "var(--text)",
                    }}
                  />
                }
              />

              <Row
                label="Orçamento mensal (R$)"
                hint="Gera alerta ao se aproximar/ultrapassar."
                right={
                  <input
                    type="number"
                    value={form.orcamentoMensal}
                    onChange={(e) => setField("orcamentoMensal", e.target.value)}
                    className="w-40 rounded-xl border px-3 py-2 text-sm"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "#0F172A",
                      color: "var(--text)",
                    }}
                  />
                }
              />

              <Row
                label="Notificações"
                hint="Liga/desliga alertas na interface."
                right={
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!form.notificacoesAtivas}
                      onChange={(e) => setField("notificacoesAtivas", e.target.checked)}
                    />
                    Ativas
                  </label>
                }
              />

              <Row
                label="Não perturbe"
                hint="Marca alertas como silenciados no horário."
                right={
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!form.naoPerturbeAtivo}
                      onChange={(e) => setField("naoPerturbeAtivo", e.target.checked)}
                    />
                    Ativo
                  </label>
                }
              />

              <div className="flex flex-wrap gap-3 items-center">
                <div className="text-sm opacity-80">Horário:</div>
                <label className="text-sm opacity-80">Início</label>
                <input
                  type="time"
                  value={form.naoPerturbeInicio}
                  onChange={(e) => setField("naoPerturbeInicio", e.target.value)}
                  className="rounded-xl border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#0F172A",
                    color: "var(--text)",
                  }}
                />
                <label className="text-sm opacity-80">Fim</label>
                <input
                  type="time"
                  value={form.naoPerturbeFim}
                  onChange={(e) => setField("naoPerturbeFim", e.target.value)}
                  className="rounded-xl border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "#0F172A",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold"
                  style={{
                    borderColor: "rgba(35,162,217,.35)",
                    background: "rgba(35,162,217,.18)",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>

              <div className="text-xs opacity-70">
                Dica: para simular “tarifa alta”, coloque tarifa ≥ 1.05 e veja a aba Alertas.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, hint, right }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs opacity-70">{hint}</div>
      </div>
      <div>{right}</div>
    </div>
  );
}
