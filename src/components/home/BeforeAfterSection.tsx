"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Flame,
  Gauge,
  MessagesSquare,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/lib/dictionaries";

export function BeforeAfterSection({ dictionary }: { dictionary: Dictionary }) {
  const d = dictionary.home.beforeAfter;
  const beforeIcons: LucideIcon[] = [
    MessagesSquare,
    AlertTriangle,
    Flame,
    ShieldAlert,
  ];
  const withIcons: LucideIcon[] = [CircleDot, CheckCircle2, Flame, Gauge];

  return (
    <section className="border-b border-kitch-border/50 bg-gradient-to-b from-kitch-bg to-kitch-surface/20 py-14 lg:py-20">
      <Container className="max-w-7xl">
        <SectionLabel>{dictionary.home.solution.eyebrow}</SectionLabel>
        <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {d.title}
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-kitch-elevated/65 to-kitch-surface/45 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kitch-subtle">
                {d.beforeTitle}
              </p>
              <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-kitch-muted">
                Before
              </span>
            </div>
            <ul className="mt-5 grid gap-2">
              {d.before.map((item, idx) => {
                const Icon = beforeIcons[idx] ?? AlertTriangle;
                return (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-kitch-bg/55 px-4 py-3"
                  >
                    <span className="mt-0.5 flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-kitch-muted">
                      <Icon className="size-4" strokeWidth={1.5} />
                    </span>
                    <p className="text-sm font-medium text-white/90">{item}</p>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative overflow-hidden rounded-3xl border border-kitch-accent/25 bg-gradient-to-b from-kitch-elevated/75 to-kitch-surface/55 p-6 shadow-[0_22px_72px_rgba(230,57,70,0.10)]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-kitch-accent/[0.12] blur-3xl" />
            <div className="relative flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kitch-accent">
                {d.withTitle}
              </p>
              <span className="rounded-full bg-kitch-accent/15 px-2 py-0.5 text-[10px] font-semibold text-kitch-accent">
                Live
              </span>
            </div>
            <ul className="relative mt-5 grid gap-2">
              {d.with.map((item, idx) => {
                const Icon = withIcons[idx] ?? CheckCircle2;
                return (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-kitch-bg/55 px-4 py-3"
                  >
                    <span className="mt-0.5 flex size-8 items-center justify-center rounded-xl border border-kitch-accent/25 bg-kitch-accent/10 text-kitch-accent">
                      <Icon className="size-4" strokeWidth={1.6} />
                    </span>
                    <p className="text-sm font-medium text-white/95">{item}</p>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

