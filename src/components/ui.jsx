import { createPortal } from "react-dom";

function cx(...v) {
  return v.filter(Boolean).join(" ");
}

export function Card({ className, children }) {
  return (
    <div
      className={cx(
        "rounded-2xl border shadow-[0_30px_80px_rgba(0,0,0,.35)]",
        className
      )}
      style={{
        borderColor: "var(--border)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
      }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ kicker = "HomeGrid", title, subtitle, right }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          {kicker}
        </div>
        <div className="text-4xl font-semibold tracking-tight">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

export function Pill({ tone = "neutral", children }) {
  const styles = {
    neutral: {
      color: "var(--muted)",
      border: "var(--border)",
      bg: "rgba(255,255,255,.02)",
    },
    info: {
      color: "var(--primary)",
      border: "rgba(35,162,217,.35)",
      bg: "rgba(35,162,217,.08)",
    },
    warn: {
      color: "var(--warn)",
      border: "rgba(240,163,10,.35)",
      bg: "rgba(240,163,10,.08)",
    },
    danger: {
      color: "var(--danger)",
      border: "rgba(239,68,68,.35)",
      bg: "rgba(239,68,68,.08)",
    },
    ok: {
      color: "var(--ok)",
      border: "rgba(34,197,94,.35)",
      bg: "rgba(34,197,94,.08)",
    },
  }[tone];

  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        color: styles.color,
        borderColor: styles.border,
        background: styles.bg,
      }}
    >
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]";
  const variants = {
    primary:
      "border border-white/10 hover:opacity-95",
    ghost:
      "border border-white/10 bg-white/0 hover:bg-white/10",
    subtle:
      "border border-white/10 bg-white/5 hover:bg-white/10",
  };

  const style =
    variant === "primary"
      ? { background: "rgba(35,162,217,.18)", borderColor: "rgba(35,162,217,.35)" }
      : {};

  return (
    <button className={cx(base, variants[variant], className)} style={style} {...props}>
      {children}
    </button>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cx(
        "w-full rounded-xl border px-3 py-2 text-sm outline-none",
        className
      )}
      style={{
        borderColor: "var(--border)",
        background: "rgba(255,255,255,.03)",
      }}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cx(
        "w-full rounded-xl border px-3 py-2 text-sm outline-none",
        className
      )}
      style={{
        borderColor: "var(--border)",
        backgroundColor: "#0F172A",
        color: "var(--text)",
      }}
      {...props}
    >
      {children}
    </select>
  );
}


export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 accent-[var(--primary)]"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function Table({ columns, rows, className }) {
  return (
    <div
      className={cx("overflow-hidden rounded-xl border", className)}
      style={{ borderColor: "var(--border)", background: "rgba(0,0,0,.18)" }}
    >
      <table className="w-full text-left text-sm">
        <thead className="border-b" style={{ borderColor: "var(--border)" }}>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={idx}
              className="border-b last:border-b-0"
              style={{ borderColor: "rgba(255,255,255,.06)" }}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3">
                  {typeof c.render === "function" ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Modal (pra substituir o alert feio) */
