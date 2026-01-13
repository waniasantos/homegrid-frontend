const KEY = "homegrid_config_v1";

export function getDefaultConfig() {
  return {
    tarifa: 0.92,
    orcamentoMensal: 250,
    notificacoesAtivas: true,
    naoPerturbeAtivo: false,
    naoPerturbeInicio: "22:00",
    naoPerturbeFim: "07:00",
  };
}

export function loadConfig() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return getDefaultConfig();
    const obj = JSON.parse(raw);
    return { ...getDefaultConfig(), ...obj };
  } catch {
    return getDefaultConfig();
  }
}

export function saveConfig(cfg) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
}
