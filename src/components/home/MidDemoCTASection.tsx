"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

export function MidDemoCTASection({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary.home.midCta;

  return (
    <section className="border-b border-kitch-border/50 py-12 lg:py-16">
      <Container className="max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-kitch-elevated/75 to-kitch-surface/45 px-7 py-10 shadow-[0_20px_72px_rgba(0,0,0,0.3)] sm:px-10"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-kitch-accent/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h3 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {d.title}
              </h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {d.bullets.map((b) => (
                  <li
                    key={b}
                    className="rounded-xl border border-white/[0.06] bg-kitch-bg/40 px-3 py-2 text-sm text-white/75"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="min-w-[220px] px-10 text-base shadow-[0_0_36px_rgba(230,57,70,0.2)] ring-1 ring-white/10"
              >
                <Link href={withLocale(locale, "/demo")}>{d.button}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

