"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/lib/dictionaries";

export function MarketsSection({ dictionary }: { dictionary: Dictionary }) {
  const d = dictionary.home.markets;

  return (
    <section className="border-b border-kitch-border/50 py-14 lg:py-20">
      <Container className="max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-kitch-elevated/75 to-kitch-surface/40 p-8 shadow-[0_24px_72px_rgba(0,0,0,0.32)] sm:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-kitch-accent/10 blur-3xl" aria-hidden />
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
            <div>
              <SectionLabel className="mb-2">{d.eyebrow}</SectionLabel>
              <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {d.title}
              </h2>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
                {d.body}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-kitch-bg/35 p-5">
                <p className="text-sm font-semibold text-white">{d.colombiaTitle}</p>
                <ul className="mt-3 space-y-2">
                  {d.colombiaBullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-kitch-muted">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-kitch-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-kitch-bg/35 p-5">
                <p className="text-sm font-semibold text-white">{d.usTitle}</p>
                <ul className="mt-3 space-y-2">
                  {d.usBullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-kitch-muted">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-kitch-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
