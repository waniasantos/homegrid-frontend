import { fetchJson } from "./fetcher";

export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK || "true") === "true";

function nowIso() {
  return new Date().toISOString();
}

async function getDashboard() {
  const response = await fetchJson(`/medicoes?limit=60`);
  
  if (!response?.medicoes || response.medicoes.length === 0) {
    return {
      updatedAt: nowIso(),
      cards: {
        consumoAtualKw: 0,
        custoHoje: 0,
        consumoMesKwh: 0,
        custoMes: 0,
        tarifa: 0.92
      },
      serie: [],
      viloesHoje: []
    };
  }

  const medicoes = response.medicoes;
  const ultimaMedicao = medicoes[0];
  const consumoAtualKw = ultimaMedicao ? ultimaMedicao.consumo / 1000 : 0;
  
  const serie = medicoes.slice(0, 60).reverse().map((m, i) => ({
    t: i,
    kw: Number((m.consumo / 1000).toFixed(2))
  }));
  
  return {
    updatedAt: nowIso(),
    cards: {
      consumoAtualKw: Number(consumoAtualKw.toFixed(2)),
      custoHoje: Number((consumoAtualKw * 0.92).toFixed(2)),
      consumoMesKwh: 208,
      custoMes: 191.36,
      tarifa: 0.92
    },
    serie,
    viloesHoje: []
  };
}

async function getAnomalias() {
  const response = await fetchJson(`/anomalias?limit=50`);
  
  if (!response?.items) {
    return { updatedAt: nowIso(), items: [] };
  }

  const items = response.items.map(a => ({
    id: a.id,
    dispositivo: a.dispositivoId,
    tipo: a.tipo,
    severidade: a.severidade,
    titulo: `Consumo ${a.percentualDesvio.toFixed(0)}% acima do esperado`,
    descricao: `Consumo atual: ${(a.consumoAtual/1000).toFixed(2)}kW vs Esperado: ${(a.consumoEsperado/1000).toFixed(2)}kW`,
    timestamp: a.timestamp
  }));

  return {
    updatedAt: nowIso(),
    items
  };
}

export const api = {
  async dashboard() {
    return getDashboard();
  },
  async relatorios(params) {
    return { updatedAt: nowIso(), period: params?.period || "7d", serie: [], ranking: [] };
  },
  async alertas() {
    return { updatedAt: nowIso(), items: [] };
  },
  async anomalias() {
    return getAnomalias();
  },
  async configuracoes() {
    return {
      updatedAt: nowIso(),
      tarifa: 0.92,
      orcamentoMensal: 250,
      notificacoesAtivas: true,
      naoPerturbeAtivo: true,
      naoPerturbeInicio: "22:00",
      naoPerturbeFim: "07:00",
    };
  },
  async salvarConfiguracoes(payload) {
    return { ok: true, updatedAt: nowIso(), ...payload };
  }
};
