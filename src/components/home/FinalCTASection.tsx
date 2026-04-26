"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

export function FinalCTASection({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary.home.finalCta;
  const urgencyLine = dictionary.home.urgency.line;

  return (
    <section className="py-14 lg:py-20">
      <Container className="max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-kitch-accent/30 bg-gradient-to-br from-kitch-surface/70 to-kitch-elevated/50 px-8 py-11 text-center shadow-[0_24px_80px_rgba(230,57,70,0.08)] sm:px-12 sm:py-14"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,57,70,0.18),transparent_45%)]" />
          <h2 className="relative mx-auto max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {d.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
            {d.support}
          </p>
          <div className="relative mx-auto mt-8 flex max-w-lg flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="min-h-[3.25rem] w-full min-w-0 px-10 text-base font-semibold shadow-[0_0_44px_rgba(230,57,70,0.38)] ring-1 ring-white/12 hover:bg-[#ff4d5c] hover:shadow-[0_0_52px_rgba(230,57,70,0.48)] sm:w-auto sm:min-w-[220px]"
            >
              <Link href={withLocale(locale, "/demo")}>{d.ctaPrimary}</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="min-h-[3.25rem] w-full min-w-0 border-white/10 bg-transparent px-10 text-base text-kitch-muted hover:bg-white/[0.06] hover:text-white sm:w-auto sm:min-w-[220px]"
            >
              <Link href={withLocale(locale, "/demo") + "?advisor=1"}>{d.ctaSecondary}</Link>
            </Button>
          </div>
          <p className="relative mx-auto mt-3 max-w-xl text-center text-[11px] font-medium uppercase tracking-wide text-kitch-subtle">
            {urgencyLine}
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
