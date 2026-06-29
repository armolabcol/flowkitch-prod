"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroMedia } from "@/components/home/v2/HeroMedia";
import { HeroMockupStack } from "@/components/home/v2/HeroMockupStack";
import type { HomepageV2HeroProps } from "@/components/home/v2/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { withLocale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function HomeHero({ content, locale }: HomepageV2HeroProps) {
  const reduce = useReducedMotion();

  const fadeIn = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.65, delay, ease: EASE },
        };

  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: EASE },
        };

  return (
    <section
      id={content.id}
      className="kitch-hero relative flex min-h-[100svh] items-center overflow-hidden bg-[#1c1c1c] text-white"
      aria-labelledby={`${content.id}-headline`}
    >
      <HeroMedia />

      <Container className="kitch-hero-content relative z-10 w-full max-w-7xl">
        <div className="grid min-h-[calc(100svh-4.25rem)] items-center gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
          <div
            className={cn(
              "flex flex-col gap-6 sm:gap-7 lg:col-span-6 lg:max-w-xl xl:max-w-2xl",
              "rounded-2xl border border-white/[0.06] bg-[#1c1c1c]/55 p-6 backdrop-blur-md sm:p-8",
              "lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none",
            )}
          >
            {content.eyebrow ? (
              <motion.p className="kitch-hero-eyebrow" {...fadeIn(0.12)}>
                {content.eyebrow}
              </motion.p>
            ) : null}

            <motion.div {...fadeUp(0.2)}>
              <h1
                id={`${content.id}-headline`}
                className="font-kitch text-[clamp(3rem,8vw,4.75rem)] font-semibold leading-[1] tracking-[-0.04em] text-white"
              >
                {content.title}
              </h1>
              {content.tagline ? (
                <p className="mt-3 max-w-lg text-lg font-medium tracking-[-0.02em] text-white/88 sm:mt-4 sm:text-xl">
                  {content.tagline}
                </p>
              ) : null}
            </motion.div>

            <motion.p
              className="max-w-xl text-base leading-relaxed text-kitch-muted sm:text-lg sm:leading-relaxed"
              {...fadeUp(0.34)}
            >
              {content.description}
            </motion.p>

            {content.microcopy ? (
              <motion.p
                className="max-w-lg text-sm leading-relaxed text-kitch-subtle sm:text-[0.95rem]"
                {...fadeUp(0.44)}
              >
                {content.microcopy}
              </motion.p>
            ) : null}

            <motion.div
              className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
              {...fadeUp(content.microcopy ? 0.54 : 0.44)}
            >
              <Button
                asChild
                variant="primary"
                size="lg"
                className="w-full min-w-[11rem] shadow-[0_0_32px_rgba(230,57,70,0.3)] sm:w-auto"
              >
                <Link href={withLocale(locale, "/demo")}>
                  {content.cta.primaryLabel}
                </Link>
              </Button>

              {content.cta.secondaryLabel ? (
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="w-full border-white/15 bg-white/[0.04] sm:w-auto"
                >
                  <Link href={`#operationalFlow`}>
                    {content.cta.secondaryLabel}
                    <ArrowRight
                      className="ml-1.5 inline-block h-4 w-4 opacity-70"
                      aria-hidden
                    />
                  </Link>
                </Button>
              ) : null}
            </motion.div>
          </div>

          <div className="lg:col-span-6 lg:flex lg:items-center lg:justify-end">
            <HeroMockupStack />
          </div>
        </div>
      </Container>
    </section>
  );
}
