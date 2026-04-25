"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { MockupDevice } from "@/components/ui/MockupDevice";
import {
  KitchenScreenRich,
  ManagerScreenRich,
  MenuScreenRich,
  WaiterScreenRich,
} from "@/components/mockups/ProductUIScreens";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type MockupShowcaseSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function MockupShowcaseSection({
  locale,
  dictionary,
}: MockupShowcaseSectionProps) {
  const d = dictionary.home.mockups;

  return (
    <section className="relative border-b border-kitch-border/50 py-14 lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(230,57,70,0.08),transparent_50%)]"
        aria-hidden
      />
      <Container className="relative max-w-7xl">
        <SectionLabel>{d.eyebrow}</SectionLabel>
        <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {d.title}
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-kitch-muted sm:text-lg">{d.subtitle}</p>

        <div className="relative mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            aria-hidden
          >
            <svg className="h-full w-full opacity-[0.5]" viewBox="0 0 1000 700" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mock-conn" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e63946" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#e63946" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#e63946" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M240 220 C 420 140 520 260 650 210 S 820 170 860 260"
                fill="none"
                stroke="url(#mock-conn)"
                strokeWidth="2"
                strokeDasharray="6 10"
              />
              <path
                d="M140 520 C 320 420 520 520 720 470 S 880 420 940 520"
                fill="none"
                stroke="url(#mock-conn)"
                strokeWidth="2"
                strokeDasharray="6 10"
              />
            </svg>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.42 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <LabelBadge>{d.labels.mobileMenu}</LabelBadge>
              <MockupDevice
                variant="phone"
                className="ring-1 ring-white/[0.06] shadow-[0_26px_72px_rgba(0,0,0,0.55)]"
              >
                <MenuScreenRich locale={locale} />
              </MockupDevice>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.42, delay: 0.06 }}
            className="flex justify-center"
          >
            <div className="relative">
              <LabelBadge>{d.labels.waiterPanel}</LabelBadge>
              <MockupDevice
                variant="tablet"
                className="ring-1 ring-white/[0.08] shadow-[0_26px_72px_rgba(0,0,0,0.55)]"
              >
                <WaiterScreenRich locale={locale} />
              </MockupDevice>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.42, delay: 0.08 }}
            className="flex justify-center lg:col-span-2"
          >
            <div className="relative">
              <LabelBadge>{d.labels.kitchenQueue}</LabelBadge>
              <MockupDevice
                variant="kitchen"
                className="ring-1 ring-white/[0.06] shadow-[0_30px_82px_rgba(0,0,0,0.6)]"
              >
                <KitchenScreenRich locale={locale} />
              </MockupDevice>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.42, delay: 0.1 }}
            className="flex justify-center lg:col-span-2"
          >
            <div className="relative">
              <LabelBadge>{d.labels.managerControl}</LabelBadge>
              <MockupDevice
                variant="manager"
                className="ring-1 ring-white/[0.08] shadow-[0_30px_82px_rgba(0,0,0,0.6)]"
              >
                <ManagerScreenRich locale={locale} />
              </MockupDevice>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function LabelBadge({ children }: { children: string }) {
  return (
    <div className="absolute -top-3 left-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-kitch-bg/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-kitch-muted shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <span className="size-1.5 rounded-full bg-kitch-accent shadow-[0_0_10px_rgba(230,57,70,0.7)]" />
      {children}
    </div>
  );
}
