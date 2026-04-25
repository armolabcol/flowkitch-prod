"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDot, Flame, Gauge, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/lib/dictionaries";

export function SolutionSection({ dictionary }: { dictionary: Dictionary }) {
  const d = dictionary.home.solution;
  const icons: LucideIcon[] = [CircleDot, CheckCircle2, Flame, Gauge];

  return (
    <section className="border-b border-kitch-border/50 bg-gradient-to-b from-kitch-surface/15 to-kitch-bg py-14 lg:py-20">
      <Container className="max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
          >
            <SectionLabel>{d.eyebrow}</SectionLabel>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {d.title}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="space-y-4 rounded-2xl border border-white/[0.08] bg-kitch-elevated/50 p-6 shadow-[0_16px_48px_rgba(0,0,0,0.25)] sm:p-8"
          >
            <p className="text-pretty text-base leading-relaxed text-kitch-muted">
              {d.differentiation}
            </p>
            <p className="text-lg font-medium text-white">{d.benefit}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.04 }}
          className="mt-10 grid gap-3 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-kitch-elevated/70 to-kitch-surface/40 p-6 shadow-[0_18px_56px_rgba(0,0,0,0.25)] sm:p-8 lg:grid-cols-2"
        >
          <div className="lg:pr-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-kitch-subtle">
              {d.withTitle}
            </p>
            <p className="mt-3 text-pretty text-base text-kitch-muted sm:text-lg">
              {dictionary.home.hero.trace}
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {d.withItems.map((item, idx) => {
              const Icon = icons[idx] ?? CheckCircle2;
              return (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-kitch-bg/55 px-4 py-3"
                >
                  <span className="mt-0.5 flex size-8 items-center justify-center rounded-xl border border-kitch-accent/25 bg-kitch-accent/10 text-kitch-accent">
                    <Icon className="size-4" strokeWidth={1.6} />
                  </span>
                  <p className="text-sm font-medium text-white/90">{item}</p>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
