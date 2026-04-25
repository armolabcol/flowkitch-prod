"use client";

import { motion } from "framer-motion";
import { QrCode, ChefHat, LineChart, UserCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/lib/dictionaries";

const cardIcons = [QrCode, UserCheck, ChefHat, LineChart] as const;

type OperationsRealitySectionProps = {
  dictionary: Dictionary;
};

export function OperationsRealitySection({
  dictionary,
}: OperationsRealitySectionProps) {
  const d = dictionary.home.operations;
  const t = dictionary.home.flowStory.states;

  return (
    <section className="relative border-b border-kitch-border/50 bg-gradient-to-b from-kitch-bg via-[#1a1a1a] to-kitch-bg py-14 lg:py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-kitch-accent/25 to-transparent"
        aria-hidden
      />
      <Container className="relative max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <SectionLabel>{d.eyebrow}</SectionLabel>
            <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {d.title}
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
              {d.body}
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_70%_30%,rgba(230,57,70,0.12),transparent_55%)] blur-2xl"
              aria-hidden
            />
            <div className="relative grid gap-3 sm:grid-cols-2">
              {d.cards.map((card, i) => {
                const Icon = cardIcons[i] ?? QrCode;
                const meta = [
                  { status: t[0]?.label ?? "QR", time: "00:18" },
                  { status: t[2]?.label ?? "Approval", time: "01:06" },
                  { status: t[4]?.label ?? "Preparing", time: "06:12" },
                  { status: t[7]?.label ?? "Closed", time: "—" },
                ][i];
                return (
                  <motion.article
                    key={card.key}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: 0.05 * i }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-kitch-elevated/75 to-kitch-surface/55 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-kitch-accent/30 hover:shadow-[0_24px_64px_rgba(230,57,70,0.10)]"
                  >
                    <div className="absolute -right-8 -top-8 size-24 rounded-full bg-kitch-accent/[0.07] blur-2xl transition-opacity group-hover:opacity-100" />
                    <div className="relative flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-kitch-bg/80 text-kitch-accent transition-colors group-hover:border-kitch-accent/25">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </span>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-white">
                            {card.title}
                          </h3>
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-kitch-muted">
                            <span className="size-1.5 rounded-full bg-kitch-accent shadow-[0_0_10px_rgba(230,57,70,0.6)]" />
                            {meta?.status}
                            <span className="text-kitch-subtle">·</span>
                            <span className="font-mono text-kitch-subtle">{meta?.time}</span>
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-kitch-muted sm:text-sm">
                          {card.body}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
            <div
              className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/[0.04]"
              aria-hidden
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
