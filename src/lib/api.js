// src/lib/api.js
import { fetchJson } from "./fetcher";

export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK || "true") === "true";

/**
 * ⚠️ Ajuste estes paths quando você confirmar os endpoints do backend.
 * Por enquanto deixei nomes bem prováveis pra HomeGrid.
 */
const paths = {
  dashboard: "/dashboard",
  relatorios: "/relatorios",
  alertas: "/alertas",
  anomalias: "/anomalias",
  configuracoes: "/configuracoes",
};

// ---------------------------
// MOCK DATA (pode ajustar)
// ---------------------------
function nowIso() {
  return new Date().toISOString();
}

const mock = {
  dashboard: () => ({
    updatedAt: nowIso(),
    cards: {
      consumoAtualKw: 0.51,
      custoHoje: 8.89,
      consumoMesKwh: 208,
      custoMes: 191.36,
      tarifa: 0.92,
    },
    serie: Array.from({ length: 60 }, (_, i) => ({
      t: i, // minuto
      kw: Number((0.4 + Math.random() * 0.4).toFixed(2)),
    })),
    viloesHoje: [
      { dispositivo: "Chuveiro", kwh: 3.3, custo: 3.04 },
      { dispositivo: "Ar-condicionado", kwh: 2.17, custo: 1.99 },
      { dispositivo: "Geladeira", kwh: 2.03, custo: 1.87 },
      { dispositivo: "Iluminação", kwh: 1.04, custo: 0.96 },
      { dispositivo: "TV", kwh: 0.98, custo: 0.90 },
    ],
  }),

  relatorios: ({ period = "7d" } = {}) => {
    const days = period === "30d" ? 30 : period === "14d" ? 14 : 7;
    const serie = Array.from({ length: days }, (_, i) => ({
      label: `D${i + 1}`,
      kwh: Number((8 + Math.random() * 12).toFixed(1)),
      custo: Number((6 + Math.random() * 10).toFixed(2)),
    }));
    const ranking = [
      { dispositivo: "Chuveiro", kwh: 46.3, custo: 42.6 },
      { dispositivo: "Ar-condicionado", kwh: 33.8, custo: 31.1 },
      { dispositivo: "Geladeira", kwh: 28.9, custo: 26.6 },
      { dispositivo: "TV", kwh: 16.4, custo: 15.1 },
      { dispositivo: "Iluminação", kwh: 12.2, custo: 11.2 },
    ];
    return { updatedAt: nowIso(), period, serie, ranking };
  },

  alertas: () => ({
    updatedAt: nowIso(),
    items: [],
  }),

  anomalias: () => ({
    updatedAt: nowIso(),
    items: [
      {
        id: "a1",
        dispositivo: "Geladeira",
        titulo: "Consumo acima do padrão (+32%)",
        descricao:
          "A geladeira está acima da média usual do período. Verifique vedação/temperatura.",
        nivel: "MEDIA",
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
      {
        id: "a2",
        dispositivo: "Ar-condicionado",
        titulo: "Pico inesperado (+58%)",
        descricao:
          "Pico fora do padrão no horário. Possível uso prolongado ou falha de eficiência.",
        nivel: "ALTA",
        timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      },
    ],
  }),

  configuracoes: () => ({
    updatedAt: nowIso(),
    tarifa: 0.92,
    orcamentoMensal: 250,
    notificacoesAtivas: true,
    naoPerturbeAtivo: true,
    naoPerturbeInicio: "22:00",
    naoPerturbeFim: "07:00",
  }),
};

// ---------------------------
// API REAL
// ---------------------------
async function getDashboard() {
  return fetchJson(paths.dashboard);
}
async function getRelatorios(params) {
  const p = new URLSearchParams(params || {});
  const qs = p.toString() ? `?${p.toString()}` : "";
  return fetchJson(paths.relatorios + qs);
}
async function getAlertas() {
  return fetchJson(paths.alertas);
}
async function getAnomalias() {
  return fetchJson(paths.anomalias);
}
async function getConfiguracoes() {
  return fetchJson(paths.configuracoes);
}
async function putConfiguracoes(payload) {
  return fetchJson(paths.configuracoes, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ---------------------------
// EXPORTS (com switch)
// ---------------------------
export const api = {
  async dashboard() {
    return USE_MOCK ? mock.dashboard() : getDashboard();
  },
  async relatorios(params) {
    return USE_MOCK ? mock.relatorios(params) : getRelatorios(params);
  },
  async alertas() {
    return USE_MOCK ? mock.alertas() : getAlertas();
  },
  async anomalias() {
    return USE_MOCK ? mock.anomalias() : getAnomalias();
  },
  async configuracoes() {
    return USE_MOCK ? mock.configuracoes() : getConfiguracoes();
  },
  async salvarConfiguracoes(payload) {
    if (USE_MOCK) return { ok: true, updatedAt: nowIso(), ...payload };
    return putConfiguracoes(payload);
  },
};
