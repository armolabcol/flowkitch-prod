"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/dictionaries";

export function HomeTrustCredibilitySection({ dictionary }: { dictionary: Dictionary }) {
  const d = dictionary.home.trustSales;

  return (
    <section className="border-y border-white/[0.06] bg-[#161616] py-14 sm:py-16">
      <Container className="max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="max-w-3xl text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {d.title}
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {d.items.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/[0.07] bg-kitch-surface/35 px-4 py-4 text-sm leading-relaxed text-kitch-muted sm:min-h-[5.5rem] sm:px-5 sm:py-5"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
