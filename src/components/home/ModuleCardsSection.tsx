"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Building2,
  Flame,
  Heart,
  LayoutDashboard,
  QrCode,
  UserRound,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { moduleKeys, moduleCopy, type ModuleKey } from "@/data/modules";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const moduleIcons: Record<ModuleKey, LucideIcon> = {
  digitalMenu: BookOpen,
  dineInQr: QrCode,
  liveOrders: Activity,
  waiterPanel: UserRound,
  kitchenDisplay: Flame,
  managerControl: LayoutDashboard,
  loyalty: Heart,
  clientPortal: Building2,
};

type ModuleCardsSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function ModuleCardsSection({
  locale,
  dictionary,
}: ModuleCardsSectionProps) {
  const d = dictionary.home.modules;

  return (
    <section className="relative border-b border-kitch-border/50 bg-kitch-surface/20 py-14 lg:py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-kitch-accent/15 to-transparent"
        aria-hidden
      />
      <Container className="relative max-w-7xl">
        <SectionLabel>{d.eyebrow}</SectionLabel>
        <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {d.title}
        </h2>

        <motion.ul
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {moduleKeys.map((key) => {
            const copy = moduleCopy[key][locale];
            const Icon = moduleIcons[key];
            return (
              <motion.li
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.32 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-kitch-elevated/90 to-kitch-surface/80 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-kitch-accent/35 hover:shadow-[0_20px_48px_rgba(230,57,70,0.12)]"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-kitch-accent/[0.06] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-kitch-bg/70 text-kitch-accent transition-colors duration-300 group-hover:border-kitch-accent/25 group-hover:bg-kitch-accent/[0.08]">
                    <Icon className="size-5.5" strokeWidth={1.35} />
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-kitch-subtle transition-colors group-hover:border-kitch-accent/20 group-hover:text-kitch-muted">
                    {copy.tag}
                  </span>
                </div>
                <h3 className="relative mt-4 text-base font-semibold text-white">
                  {copy.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/70">
                  {copy.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
