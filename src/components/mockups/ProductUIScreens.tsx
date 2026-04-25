import type { Locale } from "@/lib/i18n";

/** Interfaces simuladas densas — reutilizables en Hero y showcase */

export function MenuScreenRich({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const items = [
    { name: es ? "Ribeye / chimichurri" : "Ribeye / chimichurri", meta: "Table 12", price: "$42" },
    { name: es ? "Ceviche del día" : "Catch of the day ceviche", meta: "Round 03", price: "$18" },
    { name: es ? "Pasta trufa" : "Truffle pasta", meta: "Prep 6m", price: "$26" },
    { name: es ? "Cóctel bar" : "Bar cocktail", meta: "Queue 2", price: "$14" },
  ];
  return (
    <div className="space-y-2.5 bg-[#141414] p-3.5 sm:p-4">
      <header className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-kitch-subtle">
            {es ? "Menú en vivo" : "Live menu"}
          </p>
          <p className="text-sm font-semibold text-white">{es ? "Carta" : "Menu"}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-kitch-accent">QR</p>
          <p className="text-xs font-mono text-white">Table 12</p>
        </div>
      </header>
      {items.map((row) => (
        <div
          key={row.name}
          className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-kitch-surface/90 px-2.5 py-2"
        >
          <div className="size-9 shrink-0 rounded-lg bg-gradient-to-br from-white/12 to-white/5" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-white">{row.name}</p>
            <p className="text-[9px] text-kitch-subtle">{row.meta}</p>
          </div>
          <span className="shrink-0 text-[11px] font-semibold tabular-nums text-kitch-muted">
            {row.price}
          </span>
          <span className="rounded-md bg-kitch-accent/20 px-1.5 py-0.5 text-[9px] font-semibold text-kitch-accent">
            +
          </span>
        </div>
      ))}
    </div>
  );
}

export function WaiterScreenRich({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const rows = [
    { table: "Table 12", round: "Round 03", state: es ? "Aprobación" : "Approval", t: "2m", pct: 40 },
    { table: "Table 07", round: "Round 01", state: es ? "En cocina" : "In kitchen", t: "8m", pct: 72 },
    { table: "Bar 02", round: "Round 02", state: es ? "Listo" : "Ready", t: "0m", pct: 100 },
  ];
  return (
    <div className="space-y-2.5 bg-[#141414] p-3.5 sm:p-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-kitch-subtle">
            {es ? "Órdenes activas" : "Active orders"}
          </p>
          <p className="text-sm font-semibold text-white">Floor · Shift A</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-kitch-muted">
            6 {es ? "abiertas" : "open"}
          </span>
          <span className="size-2 animate-pulse rounded-full bg-emerald-400/90" aria-hidden />
        </div>
      </div>
      {rows.map((r) => (
        <div
          key={r.table}
          className="rounded-xl border border-white/[0.06] bg-kitch-surface/95 p-2.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-white">{r.table}</p>
              <p className="text-[9px] font-mono text-kitch-subtle">{r.round}</p>
            </div>
            <div className="text-right">
              <span className="rounded-md bg-kitch-accent/15 px-1.5 py-0.5 text-[9px] font-medium text-kitch-accent">
                {r.state}
              </span>
              <p className="mt-0.5 text-[9px] text-kitch-subtle">{r.t}</p>
            </div>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-kitch-accent/70"
              style={{ width: `${r.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KitchenScreenRich({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const tickets = [
    {
      id: "#1842",
      table: "T12",
      items: "3",
      stateKey: "prep" as const,
      label: es ? "Preparing" : "Preparing",
      labelEs: "Preparando",
      time: "06:12",
      queue: es ? "Cola cocina" : "Kitchen queue",
    },
    {
      id: "#1840",
      table: "T05",
      items: "2",
      stateKey: "ready" as const,
      label: "Ready",
      labelEs: "Listo",
      time: "02:01",
      queue: es ? "En espera" : "Hold",
    },
    {
      id: "#1838",
      table: "Bar",
      items: "1",
      stateKey: "closed" as const,
      label: "Closed",
      labelEs: "Cerrado",
      time: "—",
      queue: es ? "Finalizado" : "Done",
    },
  ];
  return (
    <div className="grid gap-2 bg-[#141414] p-3 sm:grid-cols-3 sm:p-3.5">
      {tickets.map((t) => (
        <div
          key={t.id}
          className="rounded-xl border border-white/[0.07] bg-kitch-bg/90 p-2.5"
        >
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-mono text-kitch-subtle">{t.id}</span>
            <span className="rounded bg-white/5 px-1 py-0.5 font-medium text-white">{t.table}</span>
          </div>
          <p className="mt-1 text-[10px] text-kitch-muted">{t.items} items · {t.queue}</p>
          <div className="mt-2 flex items-center justify-between">
            <span
              className={
                t.stateKey === "closed"
                  ? "text-[10px] font-medium text-kitch-subtle"
                  : "text-[10px] font-semibold text-kitch-accent"
              }
            >
              {es ? t.labelEs : t.label}
            </span>
            <span className="font-mono text-[10px] text-kitch-muted">{t.time}</span>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-white/5">
            <div
              className={`h-full rounded-full ${
                t.stateKey === "ready"
                  ? "w-full bg-emerald-500/50"
                  : t.stateKey === "closed"
                    ? "w-full bg-white/15"
                    : "w-[55%] bg-kitch-accent/70"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ManagerScreenRich({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return (
    <div className="space-y-3 bg-[#141414] p-3.5 sm:p-4">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-white/5 pb-2.5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-kitch-subtle">
            {es ? "Manager insight" : "Manager insight"}
          </p>
          <p className="text-sm font-semibold text-white">Kitch · {es ? "Turno" : "Shift"}</p>
        </div>
        <div className="flex gap-1.5">
          {[
            { k: "APS", v: "11m" },
            { k: "TAT", v: "19m" },
            { k: "SAT", v: "96" },
          ].map((x) => (
            <div
              key={x.k}
              className="rounded-lg border border-white/10 bg-kitch-surface/90 px-2 py-1.5 text-center"
            >
              <p className="text-[9px] text-kitch-subtle">{x.k}</p>
              <p className="text-xs font-semibold tabular-nums text-white">{x.v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: es ? "Órdenes" : "Orders", v: "142", d: "+12%" },
          { l: es ? "Ingreso" : "Revenue", v: "$18.4k", d: "Live" },
          { l: es ? "Mesas" : "Tables", v: "24/28", d: "86%" },
        ].map((cell) => (
          <div
            key={cell.l}
            className="rounded-xl border border-white/[0.06] bg-kitch-surface/80 p-2"
          >
            <p className="text-[9px] text-kitch-subtle">{cell.l}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-white">{cell.v}</p>
            <p className="text-[9px] text-kitch-accent/90">{cell.d}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg border border-white/5 bg-kitch-bg/80 px-2.5 py-2">
        <span className="text-[10px] text-kitch-muted">{es ? "Alertas operativas" : "Operational alerts"}</span>
        <span className="rounded-full bg-kitch-accent/20 px-2 py-0.5 text-[9px] font-medium text-kitch-accent">
          2 {es ? "activas" : "active"}
        </span>
      </div>
    </div>
  );
}
