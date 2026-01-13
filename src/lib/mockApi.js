import { loadConfig } from "./storage";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// pseudo-random determinístico
function seededNoise(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function nowMs() {
  return Date.now();
}

function fmtTime(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

const DEVICES = [
  { id: "d1", nome: "Chuveiro", baseKw: 2.8 },
  { id: "d2", nome: "Geladeira", baseKw: 0.18 },
  { id: "d3", nome: "Ar-condicionado", baseKw: 1.2 },
  { id: "d4", nome: "TV", baseKw: 0.12 },
  { id: "d5", nome: "Iluminação", baseKw: 0.08 },
];

function makeSerie60min() {
  const end = nowMs();
  const serie = [];
  for (let i = 59; i >= 0; i--) {
    const ts = end - i * 60_000;
    // curva geral + ruído
    const seed = Math.floor(ts / 60_000);
    const noise = (seededNoise(seed) - 0.5) * 0.12;
    const wave = Math.sin(seed / 7) * 0.22;
    const kw = Math.max(0.15, 0.65 + wave + noise);
    serie.push({ ts, kw: Number(kw.toFixed(3)), time: fmtTime(ts) });
  }
  return serie;
}

function computeTodayAndMonth(cfg) {
  // mock “coerente”: kWh e custo
  const todayKwh = 7.8 + seededNoise(Math.floor(nowMs() / 3_600_000)) * 2.2;
  const monthKwh = 198 + seededNoise(Math.floor(nowMs() / 86_400_000)) * 60;

  const kwhHoje = Number(todayKwh.toFixed(2));
  const kwhMes = Number(monthKwh.toFixed(1));

  const custoHoje = Number((kwhHoje * cfg.tarifa).toFixed(2));
  const custoMes = Number((kwhMes * cfg.tarifa).toFixed(2));

  return { kwhHoje, kwhMes, custoHoje, custoMes };
}

function makeViloes(cfg) {
  // divide o consumo do dia entre dispositivos
  const base = [
    { id: "d1", fator: 0.36 },
    { id: "d3", fator: 0.22 },
    { id: "d2", fator: 0.20 },
    { id: "d4", fator: 0.12 },
    { id: "d5", fator: 0.10 },
  ];
  const { kwhHoje } = computeTodayAndMonth(cfg);

  return base
    .map((b, idx) => {
      const dev = DEVICES.find((d) => d.id === b.id);
      const wiggle = (seededNoise(idx + Math.floor(nowMs() / 600_000)) - 0.5) * 0.04;
      const kwh = Math.max(0.1, kwhHoje * (b.fator + wiggle));
      const custo = kwh * cfg.tarifa;
      return {
        id: dev.id,
        nome: dev.nome,
        kwh: Number(kwh.toFixed(2)),
        custo: Number(custo.toFixed(2)),
      };
    })
    .sort((a, b) => b.kwh - a.kwh);
}

function isWithinDND(cfg, date = new Date()) {
  if (!cfg.naoPerturbeAtivo) return false;

  const [sh, sm] = cfg.naoPerturbeInicio.split(":").map(Number);
  const [eh, em] = cfg.naoPerturbeFim.split(":").map(Number);

  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const cur = date.getHours() * 60 + date.getMinutes();

  // janela atravessa meia-noite
  if (start <= end) return cur >= start && cur <= end;
  return cur >= start || cur <= end;
}

function makeAlerts(cfg) {
  const alerts = [];
  const hour = new Date().getHours();

  const tarifaAlta = cfg.tarifa >= 1.05;
  if (tarifaAlta) {
    alerts.push({
      id: "a_tarifa",
      tipo: "TARIFA_ALTA",
      severidade: "ALTA",
      titulo: "Tarifa está alta",
      descricao: `Tarifa atual: R$ ${cfg.tarifa.toFixed(2)}/kWh. Considere reduzir consumo.`,
      ts: nowMs() - 5 * 60_000,
    });
  }

  const { custoMes } = computeTodayAndMonth(cfg);
  if (custoMes >= cfg.orcamentoMensal * 0.9) {
    alerts.push({
      id: "a_orc",
      tipo: "ORCAMENTO",
      severidade: custoMes >= cfg.orcamentoMensal ? "ALTA" : "MEDIA",
      titulo: "Orçamento mensal próximo do limite",
      descricao: `Gasto estimado: R$ ${custoMes.toFixed(2)} / R$ ${cfg.orcamentoMensal.toFixed(2)}.`,
      ts: nowMs() - 18 * 60_000,
    });
  }

  // vilões em horário de pico (mock)
  if (tarifaAlta && hour >= 18 && hour <= 22) {
    const top = makeViloes(cfg)[0];
    alerts.push({
      id: "a_vilao",
      tipo: "VILAO_PICO",
      severidade: "MEDIA",
      titulo: "Vilão ligado em horário crítico",
      descricao: `${top.nome} está entre os maiores consumos hoje. Avalie desligar/otimizar.`,
      ts: nowMs() - 2 * 60_000,
    });
  }

  // respeitar “não perturbe”: a UI ainda mostra, mas marca como silenciado
  const silenciado = isWithinDND(cfg);
  return alerts.map((a) => ({ ...a, silenciado }));
}

function makeAnomalias() {
  const items = [
    {
      id: "n1",
      dispositivo: "Geladeira",
      severidade: "MEDIA",
      delta: "+32%",
      titulo: "Consumo acima do padrão",
      detalhe: "A geladeira está acima da média usual do período. Verifique vedação/temperatura.",
      ts: nowMs() - 60 * 60_000,
    },
    {
      id: "n2",
      dispositivo: "Ar-condicionado",
      severidade: "ALTA",
      delta: "+58%",
      titulo: "Pico inesperado",
      detalhe: "Pico fora do padrão no horário. Possível uso prolongado ou falha de eficiência.",
      ts: nowMs() - 3 * 60 * 60_000,
    },
  ];
  return items;
}

function makeRelatorio(range) {
  // range: "7d" | "30d" | "mes"
  const cfg = loadConfig();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 30;

  const end = new Date();
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const seed = d.getDate() + d.getMonth() * 31 + d.getFullYear();
    const kwh = 6.5 + seededNoise(seed) * 4.0;
    const custo = kwh * cfg.tarifa;
    series.push({
      dia: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      kwh: Number(kwh.toFixed(2)),
      custo: Number(custo.toFixed(2)),
    });
  }

  const totalKwh = series.reduce((s, x) => s + x.kwh, 0);
  const totalCusto = series.reduce((s, x) => s + x.custo, 0);

  return {
    range,
    totalKwh: Number(totalKwh.toFixed(2)),
    totalCusto: Number(totalCusto.toFixed(2)),
    series,
    viloes: makeViloes(cfg),
  };
}

// -------- API mock (promises) --------
export async function apiGetDashboard() {
  await sleep(150);
  const cfg = loadConfig();
  const serie = makeSerie60min();
  const kwAtual = serie[serie.length - 1].kw;
  const period = computeTodayAndMonth(cfg);

  return {
    kwAtual,
    tarifa: cfg.tarifa,
    ...period,
    serie,
    viloes: makeViloes(cfg),
  };
}

export async function apiGetRelatorio(range = "30d") {
  await sleep(180);
  return makeRelatorio(range);
}

export async function apiGetAlertas() {
  await sleep(120);
  const cfg = loadConfig();
  return makeAlerts(cfg);
}

export async function apiGetAnomalias() {
  await sleep(140);
  return makeAnomalias();
}
