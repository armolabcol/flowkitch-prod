"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

export function HomeSalesClosingSection({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary.home.closing;

  return (
    <section className="relative overflow-hidden border-t border-kitch-accent/25 bg-[#0f0f0f] py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(230,57,70,0.22),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 size-[420px] rounded-full bg-kitch-accent/[0.08] blur-[100px]"
        aria-hidden
      />
      <Container className="relative max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.4rem] lg:leading-tight">
            {d.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
            {d.body}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="min-h-[3.25rem] w-full min-w-[220px] px-10 text-base font-semibold shadow-[0_0_48px_rgba(230,57,70,0.45)] ring-1 ring-white/15 hover:bg-[#ff4d5c] hover:shadow-[0_0_56px_rgba(230,57,70,0.55)] sm:w-auto"
            >
              <Link href={withLocale(locale, "/demo")}>{d.ctaDemo}</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="min-h-[3.25rem] w-full min-w-[220px] border-white/15 bg-white/[0.04] px-10 text-base font-semibold text-white hover:border-kitch-accent/35 hover:bg-white/[0.08] sm:w-auto"
            >
              <Link href={withLocale(locale, "/demo") + "?advisor=1"}>{d.ctaAdvisor}</Link>
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
