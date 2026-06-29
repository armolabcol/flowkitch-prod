"use client";

import {
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  QrCode,
} from "lucide-react";
import type { ReactNode } from "react";
import type { HomepageV2HeroMockupContent } from "@/components/home/v2/types";
import { cn } from "@/lib/cn";

type HeroCardVariant = "client" | "manager" | "kitchen" | "waiter";

function HeroGlassCard({
  variant,
  className,
  children,
}: {
  variant: HeroCardVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("kitch-hero-card", `kitch-hero-card--${variant}`, className)}>
      <div className="kitch-hero-card__enter">
        <div className="kitch-hero-card__float">
          <div className="kitch-hero-card__surface">{children}</div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  children,
  tone = "neutral",
  pulse = false,
}: {
  children: ReactNode;
  tone?: "accent" | "ready" | "prep" | "queued" | "neutral";
  pulse?: boolean;
}) {
  const toneClass = {
    accent: "bg-[#e63946]/20 text-[#ff6b76]",
    ready: "bg-emerald-500/15 text-emerald-300",
    prep: "bg-amber-500/15 text-amber-300 kitch-status-badge--preparing",
    queued: "bg-white/8 text-kitch-subtle",
    neutral: "bg-white/8 text-kitch-muted",
  }[tone];

  return (
    <span
      className={cn(
        "kitch-status-badge inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
        toneClass,
      )}
    >
      {pulse ? (
        <span
          className={cn(
            "kitch-status-dot",
            tone === "ready" && "kitch-status-dot--ready",
          )}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  );
}

function ticketTone(status: string): "prep" | "ready" | "queued" {
  const normalized = status.toLowerCase();
  if (
    normalized.includes("ready") ||
    normalized.includes("listo")
  ) {
    return "ready";
  }
  if (
    normalized.includes("queue") ||
    normalized.includes("cola")
  ) {
    return "queued";
  }
  return "prep";
}

function CustomerMenuCard({
  copy,
}: {
  copy: HomepageV2HeroMockupContent["customer"];
}) {
  return (
    <HeroGlassCard variant="client" className="w-[min(100%,220px)] sm:w-[228px]">
      <div className="p-3.5 sm:p-4">
        <header className="mb-3 flex items-start justify-between gap-2 border-b border-white/8 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#e63946]/15 text-[#e63946]">
              <QrCode className="size-3.5" aria-hidden />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-kitch-subtle">
                {copy.eyebrow}
              </p>
              <p className="text-xs font-semibold text-white">{copy.table}</p>
            </div>
          </div>
          <StatusBadge tone="accent" pulse>
            {copy.badge}
          </StatusBadge>
        </header>

        <ul className="space-y-1.5">
          {copy.items.map((item) => (
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
          {copy.addRound}
        </button>
      </div>
    </HeroGlassCard>
  );
}

function ManagerPanelCard({
  copy,
}: {
  copy: HomepageV2HeroMockupContent["manager"];
}) {
  return (
    <HeroGlassCard variant="manager" className="w-[min(100%,210px)] sm:w-[218px]">
      <div className="p-3.5 sm:p-4">
        <header className="mb-3 flex items-center gap-2 border-b border-white/8 pb-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/8 text-white">
            <LayoutDashboard className="size-3.5" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-kitch-subtle">
              {copy.eyebrow}
            </p>
            <p className="text-xs font-semibold text-white">{copy.title}</p>
          </div>
        </header>

        <ul className="space-y-2">
          {copy.stats.map((row) => (
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
            {copy.salesLabel}
          </p>
          <p className="text-sm font-semibold tabular-nums text-white">
            {copy.salesValue}
          </p>
        </div>
      </div>
    </HeroGlassCard>
  );
}

function KitchenDisplayCard({
  copy,
}: {
  copy: HomepageV2HeroMockupContent["kitchen"];
}) {
  return (
    <HeroGlassCard variant="kitchen" className="w-[min(100%,210px)] sm:w-[218px]">
      <div className="p-3.5 sm:p-4">
        <header className="mb-3 flex items-center gap-2 border-b border-white/8 pb-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/8 text-white">
            <ChefHat className="size-3.5" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-kitch-subtle">
              {copy.eyebrow}
            </p>
            <p className="text-xs font-semibold text-white">{copy.title}</p>
          </div>
        </header>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] text-kitch-muted">{copy.table}</span>
          <StatusBadge tone="accent" pulse>
            {copy.liveBadge}
          </StatusBadge>
        </div>

        <ul className="space-y-1.5">
          {copy.tickets.map((ticket) => {
            const tone = ticketTone(ticket.status);
            return (
              <li
                key={ticket.item}
                className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2"
              >
                <p className="min-w-0 truncate text-[10px] font-medium text-white">
                  {ticket.item}
                </p>
                <StatusBadge tone={tone} pulse={tone === "ready"}>
                  {ticket.status}
                </StatusBadge>
              </li>
            );
          })}
        </ul>
      </div>
    </HeroGlassCard>
  );
}

function WaiterPanelCard({
  copy,
}: {
  copy: HomepageV2HeroMockupContent["waiter"];
}) {
  return (
    <HeroGlassCard variant="waiter" className="w-[min(100%,220px)] sm:w-[232px]">
      <div className="p-3.5 sm:p-4">
        <header className="mb-3 flex items-center gap-2 border-b border-white/8 pb-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/8 text-white">
            <ClipboardList className="size-3.5" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-kitch-subtle">
              {copy.eyebrow}
            </p>
            <p className="text-xs font-semibold text-white">{copy.title}</p>
          </div>
        </header>

        <div className="mb-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-white">
              {copy.pendingTitle}
            </p>
            <StatusBadge tone="accent" pulse>
              3
            </StatusBadge>
          </div>
          <p className="mt-1 text-[10px] text-kitch-muted">{copy.pendingMeta}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            tabIndex={-1}
            className="flex-1 rounded-xl border border-white/15 bg-white/[0.04] px-2 py-2 text-[10px] font-semibold text-white"
          >
            {copy.approve}
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="flex-1 rounded-xl bg-[#e63946] px-2 py-2 text-[10px] font-semibold text-white"
          >
            {copy.sendToKitchen}
          </button>
        </div>
      </div>
    </HeroGlassCard>
  );
}

export function HeroMockupStack({
  mockups,
}: {
  mockups: HomepageV2HeroMockupContent;
}) {
  return (
    <div
      className="relative mx-auto hidden h-[min(520px,58vh)] w-full max-w-[540px] md:block lg:max-w-none"
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
        <ManagerPanelCard copy={mockups.manager} />
      </div>

      <div className="absolute right-[6%] top-[28%] z-[2] origin-top-right scale-[0.84] lg:scale-100">
        <KitchenDisplayCard copy={mockups.kitchen} />
      </div>

      <div className="absolute bottom-[8%] left-[2%] z-[3] origin-bottom-left scale-[0.86] lg:scale-100">
        <WaiterPanelCard copy={mockups.waiter} />
      </div>

      <div className="absolute bottom-0 left-[20%] z-[4] origin-bottom-left scale-[0.88] lg:scale-100">
        <CustomerMenuCard copy={mockups.customer} />
      </div>
    </div>
  );
}
