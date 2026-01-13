import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { USE_MOCK } from "./lib/api";

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

export default function Layout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(new Date());

  const title = useMemo(() => {
    if (location.pathname.startsWith("/relatorios")) return "Relatórios";
    if (location.pathname.startsWith("/alertas")) return "Alertas";
    if (location.pathname.startsWith("/anomalias")) return "Anomalias";
    if (location.pathname.startsWith("/configuracoes")) return "Configurações";
    return "Dashboard";
  }, [location.pathname]);

  function onReload() {
    setUpdatedAt(new Date());
  }

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden">
      <div className="mx-auto grid min-h-[100dvh] w-full lg:grid-cols-[280px_1fr]">
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-[280px] border-r p-4 lg:static lg:block",
            open ? "block" : "hidden",
          ].join(" ")}
          style={{
            borderColor: "rgba(255,255,255,.08)",
            background: "rgba(2,6,23,.78)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="flex items-center justify-between lg:hidden">
            <div className="font-semibold">HomeGrid</div>
            <button
              className="rounded-xl border px-3 py-1 text-sm"
              style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.06)" }}
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>

          <div className="mt-2">
            <div className="text-xl font-bold">HomeGrid</div>
            <div className="text-sm opacity-70">Monitoramento de energia</div>
          </div>

          <nav className="mt-6 space-y-2">
            <SideLink to="/" label="Dashboard" onClick={() => setOpen(false)} />
            <SideLink to="/relatorios" label="Relatórios" onClick={() => setOpen(false)} />
            <SideLink to="/alertas" label="Alertas" onClick={() => setOpen(false)} />
            <SideLink to="/anomalias" label="Anomalias" onClick={() => setOpen(false)} />
            <SideLink to="/configuracoes" label="Configurações" onClick={() => setOpen(false)} />
          </nav>

          <div
            className="mt-6 rounded-2xl border p-4 text-sm"
            style={{
              borderColor: "rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.03)",
            }}
          >
            <div className="font-semibold">Status</div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <span
                className="rounded-full border px-3 py-1 text-xs"
                style={{ 
                  borderColor: USE_MOCK ? "rgba(59,130,246,.35)" : "rgba(34,197,94,.35)", 
                  background: USE_MOCK ? "rgba(59,130,246,.12)" : "rgba(34,197,94,.12)" 
                }}
              >
                {USE_MOCK ? "Mock ativo" : "API Real ativa"}
              </span>
              <span
                className="rounded-full border px-3 py-1 text-xs opacity-80"
                style={{ 
                  borderColor: USE_MOCK ? "var(--border)" : "rgba(34,197,94,.35)", 
                  background: USE_MOCK ? "rgba(255,255,255,.06)" : "rgba(34,197,94,.12)" 
                }}
              >
                API: {USE_MOCK ? "desligada" : "conectada"}
              </span>
            </div>
            <div className="mt-2 text-xs opacity-70">
              {USE_MOCK 
                ? "Quando o backend estiver pronto, você só troca VITE_USE_MOCK." 
                : "Conectado ao backend AWS Lambda."}
            </div>
          </div>
        </aside>

        {open ? (
          <div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "rgba(0,0,0,.55)" }}
            onClick={() => setOpen(false)}
          />
        ) : null}

        <main className="p-4 lg:p-6">
          <div
            className="mb-4 rounded-2xl border p-4 flex items-center justify-between"
            style={{ borderColor: "rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)" }}
          >
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden rounded-xl border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.06)" }}
                onClick={() => setOpen(true)}
              >
                Menu
              </button>
              <div>
                <div className="text-xs opacity-70">HomeGrid</div>
                <div className="text-lg font-semibold">{title}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="rounded-full border px-3 py-1 text-xs"
                style={{ 
                  borderColor: USE_MOCK ? "rgba(59,130,246,.35)" : "rgba(34,197,94,.35)", 
                  background: USE_MOCK ? "rgba(59,130,246,.12)" : "rgba(34,197,94,.12)" 
                }}
              >
                {USE_MOCK ? "Mock" : "API Real"}
              </span>

              <button
                type="button"
                onClick={onReload}
                className="rounded-full border px-3 py-1 text-xs opacity-90 transition hover:opacity-100"
                style={{ borderColor: "var(--border)", background: "rgba(255,255,255,.06)" }}
                title="Recarregar dados"
              >
                Atualizar · {fmtTime(updatedAt)}
              </button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "block rounded-xl border px-3 py-2 text-sm font-semibold",
          isActive ? "opacity-100" : "opacity-80 hover:opacity-100",
        ].join(" ")
      }
      style={({ isActive }) => ({
        borderColor: "rgba(255,255,255,.08)",
        background: isActive ? "rgba(255,255,255,.06)" : "transparent",
        color: "var(--text)",
      })}
    >
      {label}
    </NavLink>
  );
}
