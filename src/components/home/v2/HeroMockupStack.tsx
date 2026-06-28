"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  QrCode,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

function HeroGlassCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(18,18,18,0.72)] shadow-[0_20px_44px_rgba(0,0,0,0.42)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "accent" | "ready" | "prep" | "queued" | "neutral";
}) {
  const toneClass = {
    accent: "bg-[#e63946]/20 text-[#ff6b76]",
    ready: "bg-emerald-500/15 text-emerald-300",
    prep: "bg-amber-500/15 text-amber-300",
    queued: "bg-white/8 text-kitch-subtle",
    neutral: "bg-white/8 text-kitch-muted",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

function CustomerMenuCard() {
  const items = [
    { name: "Tacos al Pastor", meta: "Main" },
    { name: "Guacamole", meta: "Starter" },
    { name: "Margarita", meta: "Bar" },
  ];

  return (
    <HeroGlassCard className="w-[min(100%,220px)] p-3.5 sm:w-[228px] sm:p-4">
      <header className="mb-3 flex items-start justify-between gap-2 border-b border-white/8 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[#e63946]/15 text-[#e63946]">
            <QrCode className="size-3.5" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-kitch-subtle">
              Guest · QR
            </p>
            <p className="text-xs font-semibold text-white">Mesa 08</p>
          </div>
        </div>
        <StatusBadge tone="accent">Orden abierta</StatusBadge>
      </header>

      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-white">
                {item.name}
              </p>
              <p className="text-[9px] text-kitch-subtle">{item.meta}</p>
            </div>
            <span className="text-[10px] font-semibold text-[#e63946]">+</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        tabIndex={-1}
        className="mt-3 w-full rounded-xl bg-[#e63946] px-3 py-2 text-[11px] font-semibold text-white shadow-[0_0_20px_rgba(230,57,70,0.28)]"
      >
        Agregar ronda
      </button>
    </HeroGlassCard>
  );
}

function ManagerPanelCard() {
  const stats = [
    { label: "Mesas activas", value: "24" },
    { label: "Órdenes abiertas", value: "18" },
    { label: "Rondas pendientes", value: "6" },
  ];

  return (
    <HeroGlassCard className="w-[min(100%,210px)] p-3.5 sm:w-[218px] sm:p-4">
      <header className="mb-3 flex items-center gap-2 border-b border-white/8 pb-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-white/8 text-white">
          <LayoutDashboard className="size-3.5" aria-hidden />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-kitch-subtle">
            Gerencia
          </p>
          <p className="text-xs font-semibold text-white">Manager Panel</p>
        </div>
      </header>

      <ul className="space-y-2">
        {stats.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-1.5"
          >
            <span className="text-[10px] text-kitch-muted">{row.label}</span>
            <span className="text-[11px] font-semibold tabular-nums text-white">
              {row.value}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-xl border border-[#e63946]/25 bg-[#e63946]/10 px-2.5 py-2">
        <p className="text-[9px] uppercase tracking-wider text-kitch-subtle">
          Ventas hoy
        </p>
        <p className="text-sm font-semibold tabular-nums text-white">$3,420</p>
      </div>
    </HeroGlassCard>
  );
}

function KitchenDisplayCard() {
  const tickets = [
    { item: "Tacos al Pastor", status: "Preparing", tone: "prep" as const },
    { item: "Guacamole", status: "Ready", tone: "ready" as const },
    { item: "Margarita", status: "Queued", tone: "queued" as const },
  ];

  return (
    <HeroGlassCard className="w-[min(100%,210px)] p-3.5 sm:w-[218px] sm:p-4">
      <header className="mb-3 flex items-center gap-2 border-b border-white/8 pb-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-white/8 text-white">
          <ChefHat className="size-3.5" aria-hidden />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-kitch-subtle">
            Cocina
          </p>
          <p className="text-xs font-semibold text-white">Kitchen Display</p>
        </div>
      </header>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] text-kitch-muted">Mesa 08</span>
        <StatusBadge tone="accent">Live</StatusBadge>
      </div>

      <ul className="space-y-1.5">
        {tickets.map((ticket) => (
          <li
            key={ticket.item}
            className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2"
          >
            <p className="min-w-0 truncate text-[10px] font-medium text-white">
              {ticket.item}
            </p>
            <StatusBadge tone={ticket.tone}>{ticket.status}</StatusBadge>
          </li>
        ))}
      </ul>
    </HeroGlassCard>
  );
}

function WaiterPanelCard() {
  return (
    <HeroGlassCard className="w-[min(100%,220px)] p-3.5 sm:w-[232px] sm:p-4">
      <header className="mb-3 flex items-center gap-2 border-b border-white/8 pb-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-white/8 text-white">
          <ClipboardList className="size-3.5" aria-hidden />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-kitch-subtle">
            Mesero
          </p>
          <p className="text-xs font-semibold text-white">Waiter Panel</p>
        </div>
      </header>

      <div className="mb-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-white">Rondas pendientes</p>
          <StatusBadge tone="accent">3</StatusBadge>
        </div>
        <p className="mt-1 text-[10px] text-kitch-muted">Mesa 08 · 3 items nuevos</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          tabIndex={-1}
          className="flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-2 py-2 text-[10px] font-semibold text-white"
        >
          Aprobar
        </button>
        <button
          type="button"
          tabIndex={-1}
          className="flex-1 rounded-xl bg-[#e63946] px-2 py-2 text-[10px] font-semibold text-white"
        >
          Enviar a cocina
        </button>
      </div>
    </HeroGlassCard>
  );
}

export function HeroMockupStack() {
  const reduce = useReducedMotion();

  const visualMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: 0.45, ease: EASE },
      };

  return (
    <motion.div
      className="relative mx-auto hidden h-[min(520px,58vh)] w-full max-w-[540px] md:block lg:max-w-none"
      {...visualMotion}
      aria-hidden
    >
      <svg
        className="absolute inset-0 z-0 h-full w-full opacity-40"
        viewBox="0 0 400 500"
        fill="none"
        aria-hidden
        data-slot="flow-line"
      >
        <path
          d="M 20 420 Q 120 280 200 320 T 380 80"
          stroke="#e63946"
          strokeWidth="2"
          strokeDasharray="8 10"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      <div className="absolute right-0 top-0 z-[1] origin-top-right scale-[0.82] lg:scale-100">
        <ManagerPanelCard />
      </div>

      <div className="absolute right-[6%] top-[28%] z-[2] origin-top-right scale-[0.84] lg:scale-100">
        <KitchenDisplayCard />
      </div>

      <div className="absolute bottom-[8%] left-[2%] z-[3] origin-bottom-left scale-[0.86] lg:scale-100">
        <WaiterPanelCard />
      </div>

      <div className="absolute bottom-0 left-[20%] z-[4] origin-bottom-left scale-[0.88] lg:scale-100">
        <CustomerMenuCard />
      </div>
    </motion.div>
  );
}
