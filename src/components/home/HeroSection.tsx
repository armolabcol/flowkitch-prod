"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { KitchLogo } from "@/components/brand/KitchLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MockupDevice } from "@/components/ui/MockupDevice";
import {
  KitchenScreenRich,
  ManagerScreenRich,
  MenuScreenRich,
  WaiterScreenRich,
} from "@/components/mockups/ProductUIScreens";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type HeroSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function HeroSection({ locale, dictionary }: HeroSectionProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTabletUp = useMediaQuery("(min-width: 768px)");
  const enableParallax = !reduce && (isDesktop === true || isTabletUp === true);
  const parallaxFactor = isDesktop === true ? 1 : 0.6;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? [0, 28 * parallaxFactor] : [0, 0],
  );
  const redGlowY = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? [0, 16 * parallaxFactor] : [0, 0],
  );
  const mockupsY = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? [0, -18 * parallaxFactor] : [0, 0],
  );

  const [videoOk, setVideoOk] = useState(false);
  const d = dictionary.home.hero;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-0 overflow-hidden border-b border-kitch-border/40 lg:min-h-[min(92vh,880px)]"
    >
      <div className="pointer-events-none absolute inset-0">
        {/* Video background (fallback friendly) */}
        {!reduce && (
          <motion.div
            className="absolute inset-0"
            style={{ y: videoY }}
            aria-hidden
          >
            <video
              className={`h-full w-full object-cover opacity-0 transition-opacity duration-700 ${
                videoOk ? "opacity-100" : ""
              }`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlay={() => setVideoOk(true)}
              onError={() => setVideoOk(false)}
            >
              <source src="/videos/restaurant-operations-hero.webm" type="video/webm" />
              <source src="/videos/restaurant-operations-hero.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}

        {/* Overlays for legibility + cinematic mood (works even if video missing) */}
        <div className="absolute inset-0 bg-[rgba(28,28,28,0.72)]" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#1c1c1c] via-[#1c1c1c]/70 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_25%,rgba(255,255,255,0.05),transparent_55%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_50%,rgba(0,0,0,0),rgba(0,0,0,0.55))]"
          aria-hidden
        />
        <motion.div
          className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-kitch-accent/[0.14] blur-[110px]"
          style={{ y: redGlowY }}
          aria-hidden
        />
        <div className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-kitch-accent/[0.12] blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-kitch-accent/[0.06] blur-[90px]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.14]" aria-hidden>
          <defs>
            <linearGradient id="hero-flow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e63946" stopOpacity="0" />
              <stop offset="45%" stopColor="#e63946" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e63946" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 200 C 200 120 400 280 640 200 S 900 100 1200 220"
            stroke="url(#hero-flow)"
            strokeWidth="1.25"
            fill="none"
          />
        </svg>
      </div>

      <Container className="relative max-w-7xl pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-[18px]">
            <KitchLogo locale={locale} variant="hero" className="leading-none" />
          </div>
        </motion.div>

        <div className="mt-8 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center lg:gap-16">
          <div className="flex flex-col">
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.04 }}
              className="order-1 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[3.65rem]"
            >
              {d.headline}
            </motion.h1>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="order-3 mt-6 space-y-3 border-l-2 border-kitch-accent/35 pl-5 sm:mt-6 sm:space-y-4 sm:pl-6 lg:order-2 lg:mt-6"
            >
              <p className="max-w-xl text-pretty text-base font-medium leading-relaxed text-white/88 sm:text-lg">
                {d.lead}
              </p>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-kitch-muted max-sm:hidden sm:text-base">
                {d.trace}
              </p>
              <p className="max-w-xl text-pretty text-sm font-medium leading-relaxed text-kitch-muted sm:text-base">
                {d.posLayer}
              </p>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="order-2 mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center lg:order-3 lg:mt-8"
            >
              <Button
                asChild
                variant="primary"
                size="lg"
                className="min-h-[3.35rem] w-full min-w-0 px-8 text-base font-semibold shadow-[0_0_48px_rgba(230,57,70,0.38)] ring-1 ring-white/15 hover:bg-[#ff4d5c] hover:shadow-[0_0_56px_rgba(230,57,70,0.5)] sm:w-auto sm:min-w-[200px]"
              >
                <Link href={withLocale(locale, "/demo")}>{d.ctaPrimary}</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="min-h-[3.35rem] w-full border-white/10 bg-transparent px-8 text-base text-kitch-muted backdrop-blur-sm hover:bg-white/[0.05] hover:text-white sm:w-auto sm:min-w-0"
              >
                <Link href={withLocale(locale, "#flow")} className="group">
                  <span className="inline-flex items-center gap-2">
                    <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-kitch-accent/60">
                      {d.ctaSecondary}
                    </span>
                    <ArrowRight className="size-4 opacity-80 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="min-h-[3.35rem] w-full px-8 text-base text-white/80 hover:bg-white/[0.05] hover:text-white sm:w-auto"
              >
                <Link href={withLocale(locale, "/demo") + "?advisor=1"}>{d.ctaAdvisor}</Link>
              </Button>
            </motion.div>

            <p className="order-4 mt-2 text-center text-[11px] font-medium uppercase tracking-wide text-kitch-subtle sm:text-left">
              {dictionary.home.urgency.line}
            </p>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="order-5 mt-3 text-sm font-medium text-white/75 sm:mt-4"
            >
              {d.setupLine}
            </motion.p>
          </div>

          <motion.div style={{ y: mockupsY }}>
            <HeroMockupComposition locale={locale} reduceMotion={!!reduce} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function HeroMockupComposition({
  locale,
  reduceMotion,
}: {
  locale: Locale;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative mx-auto mt-4 w-full max-w-xl lg:mx-0 lg:mt-0 lg:max-w-none">
      <div className="relative aspect-[4/5] min-h-[420px] w-full sm:aspect-[5/6] sm:min-h-[480px] lg:aspect-auto lg:h-[min(620px,calc(100vh-220px))] lg:min-h-[520px]">
        <HeroConnectorSvg reduceMotion={reduceMotion} />

        <motion.div
          className="absolute left-[0%] top-[6%] z-[1] w-[96%] max-w-[460px] opacity-[0.9] lg:left-[1%] lg:top-[4%]"
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 0.88, y: 0, scale: 0.96 }}
          transition={{ duration: 0.65, delay: 0.12 }}
        >
          <MockupDevice
            variant="kitchen"
            className="shadow-[0_36px_96px_rgba(0,0,0,0.7)] ring-1 ring-white/[0.06]"
          >
            <KitchenScreenRich locale={locale} />
          </MockupDevice>
        </motion.div>

        <motion.div
          className="absolute bottom-[5%] right-[0%] z-[2] w-[92%] max-w-[390px] lg:bottom-[7%] lg:right-[-2%]"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <MockupDevice
            variant="manager"
            className="shadow-[0_32px_88px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.08]"
          >
            <ManagerScreenRich locale={locale} />
          </MockupDevice>
        </motion.div>

        <motion.div
          className="absolute right-[2%] top-[24%] z-[3] w-[62%] max-w-[310px] sm:max-w-[330px] lg:right-[4%] lg:top-[22%]"
          initial={reduceMotion ? false : { opacity: 0, y: 22, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 3 }}
          transition={{ duration: 0.65, delay: 0.16 }}
          style={{ transformOrigin: "center center" }}
        >
          <MockupDevice
            variant="tablet"
            className="shadow-[0_26px_72px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.1]"
          >
            <WaiterScreenRich locale={locale} />
          </MockupDevice>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-[-2%] z-[4] w-[48%] max-w-[240px] sm:max-w-[260px] lg:left-0"
          initial={reduceMotion ? false : { opacity: 0, y: 26, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          style={{ transformOrigin: "center bottom" }}
        >
          <MockupDevice
            variant="phone"
            className="shadow-[0_22px_64px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.12]"
          >
            <MenuScreenRich locale={locale} />
          </MockupDevice>
        </motion.div>

        <HeroFlowDot reduce={reduceMotion} />
      </div>
    </div>
  );
}

function HeroConnectorSvg({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-visible"
      viewBox="0 0 400 500"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M 120 420 Q 160 300 200 250 T 280 140 L 320 100"
        fill="none"
        stroke="url(#hero-conn)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="6 10"
        opacity={0.45}
      >
        {!reduceMotion && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="80"
            dur="2.8s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <defs>
        <linearGradient id="hero-conn" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e63946" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#e63946" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e63946" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HeroFlowDot({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-[42%] top-[38%] z-[6] size-3.5 sm:left-[44%] sm:top-[36%]"
      initial={false}
      animate={
        reduce
          ? { opacity: 1 }
          : {
              x: [0, 28, 12, -18, 0],
              y: [0, -22, -40, -18, 0],
              opacity: [0.9, 1, 0.95, 1, 0.9],
            }
      }
      transition={
        reduce ? undefined : { duration: 11, repeat: Infinity, ease: "easeInOut" }
      }
      aria-hidden
    >
      <span className="block size-full rounded-full bg-kitch-accent shadow-[0_0_28px_rgba(230,57,70,0.95)] ring-4 ring-kitch-accent/25" />
    </motion.div>
  );
}
