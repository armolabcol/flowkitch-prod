"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/lib/dictionaries";

export function SocialProofSection({ dictionary }: { dictionary: Dictionary }) {
  const d = dictionary.home.socialProof;

  return (
    <section className="border-b border-kitch-border/50 bg-kitch-bg py-12 lg:py-16">
      <Container className="max-w-7xl">
        <SectionLabel>{dictionary.home.modules.eyebrow}</SectionLabel>
        <h2 className="max-w-3xl text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {d.title}
        </h2>

        <motion.ul
          className="mt-8 grid gap-4 sm:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {d.items.map((it) => (
            <motion.li
              key={it.metric}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-kitch-elevated/75 to-kitch-surface/55 p-5 shadow-[0_16px_56px_rgba(0,0,0,0.32)]"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-kitch-accent/[0.06] blur-2xl" />
              <p className="relative text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {it.metric}
              </p>
              <p className="relative mt-2 text-sm leading-relaxed text-white/70">
                {it.label}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}

