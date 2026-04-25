"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ChefHat,
  MessagesSquare,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/lib/dictionaries";

export function ProblemSection({ dictionary }: { dictionary: Dictionary }) {
  const d = dictionary.home.problem;
  const icons: LucideIcon[] = [MessagesSquare, AlertTriangle, ChefHat, ShieldAlert];

  return (
    <section className="border-b border-kitch-border/50 bg-kitch-bg py-14 lg:py-20">
      <Container className="max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <SectionLabel>{d.eyebrow}</SectionLabel>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {d.title}
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
              {d.body}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_30%_30%,rgba(230,57,70,0.10),transparent_60%)] blur-2xl" aria-hidden />
            <article className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-kitch-elevated/75 to-kitch-surface/55 p-6 shadow-[0_18px_56px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kitch-subtle">
                  {d.beforeTitle}
                </p>
                <span className="rounded-full bg-kitch-accent/15 px-2 py-0.5 text-[10px] font-semibold text-kitch-accent">
                  Before
                </span>
              </div>
              <ul className="mt-5 grid gap-2">
                {d.beforeItems.map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-kitch-bg/55 px-4 py-3"
                  >
                    <span className="mt-0.5 flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-kitch-muted">
                      {(() => {
                        const Icon = icons[idx];
                        return Icon ? <Icon className="size-4" strokeWidth={1.5} /> : null;
                      })()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/90">{item}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
