"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FlowNode } from "@/components/ui/FlowNode";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/lib/dictionaries";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type FlowStorySectionProps = {
  dictionary: Dictionary;
};

export function FlowStorySection({ dictionary }: FlowStorySectionProps) {
  const reduce = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const d = dictionary.home.flowStory;

  useLayoutEffect(() => {
    if (reduce || isDesktop !== true || !trackRef.current || !dotRef.current) return;

    const track = trackRef.current;
    const dot = dotRef.current;

    const ctx = gsap.context(() => {
      const nodes = Array.from(
        track.querySelectorAll<HTMLElement>("[data-flow-node]"),
      );
      if (nodes.length < 2) return;

      const positions = nodes.map((el) => {
        const tr = track.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return r.left - tr.left + r.width / 2;
      });

      gsap.set(dot, { left: positions[0] });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      positions.forEach((x, i) => {
        tl.to(dot, {
          left: x,
          duration: i === 0 ? 0.05 : 0.82,
          ease: "power2.inOut",
        });
      });
    }, track);

    return () => ctx.revert();
  }, [reduce, isDesktop]);

  return (
    <section
      id="flow"
      className="scroll-mt-24 border-b border-kitch-border/50 bg-gradient-to-b from-kitch-bg to-kitch-surface/25 py-14 lg:py-20"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        aria-hidden
      />
      <Container className="relative max-w-7xl">
        <SectionLabel>{d.title}</SectionLabel>
        <p className="max-w-2xl text-balance text-base text-kitch-muted sm:text-lg">
          {d.subtitle}
        </p>

        {/* Desktop: flujo horizontal vivo */}
        <div
          ref={trackRef}
          className="relative mt-10 hidden overflow-visible pb-4 lg:block"
        >
          <div
            className="absolute left-[3%] right-[3%] top-[calc(50%-1px)] h-[3px] -translate-y-1/2 bg-gradient-to-r from-transparent via-kitch-accent/55 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-[3%] right-[3%] top-[calc(50%-1px)] h-[14px] -translate-y-1/2 bg-gradient-to-r from-transparent via-kitch-accent/12 to-transparent blur-xl"
            aria-hidden
          />
          {!reduce && (
            <div
              ref={dotRef}
              className="absolute top-1/2 z-20 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-kitch-accent shadow-[0_0_28px_rgba(230,57,70,0.98)] ring-4 ring-kitch-accent/25"
              style={{ left: 0 }}
              aria-hidden
            />
          )}
          <div className="relative z-10 flex items-stretch justify-between gap-1 px-1">
            {d.nodes.map((label) => (
              <FlowNode
                key={label}
                data-flow-node
                size="lg"
                className="w-[min(100%,124px)] shrink-0 text-center sm:w-[132px]"
              >
                {label}
              </FlowNode>
            ))}
          </div>
        </div>

        {/* Mobile: timeline vertical */}
        <div className="relative mt-10 space-y-0 lg:hidden">
          <div
            className="absolute bottom-4 left-[19px] top-4 w-[2px] bg-gradient-to-b from-kitch-accent/65 via-kitch-accent/30 to-transparent"
            aria-hidden
          />
          <ul className="relative space-y-1">
            {d.nodes.map((label, i) => (
              <li key={label} className="flex gap-4">
                <div className="flex w-10 shrink-0 flex-col items-center pt-1">
                  <span className="relative z-10 size-3.5 rounded-full border-2 border-kitch-bg bg-kitch-accent shadow-[0_0_14px_rgba(230,57,70,0.85)]" />
                </div>
                <FlowNode
                  size="lg"
                  className="mb-3 min-h-[52px] flex-1 text-left text-sm"
                  active={i === 0}
                >
                  {label}
                </FlowNode>
              </li>
            ))}
          </ul>
        </div>

        <motion.ul
          className="mt-8 grid gap-2 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.04 },
            },
          }}
        >
          {d.states.map((s) => (
            <motion.li
              key={s.key}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-kitch-elevated/50 px-3 py-2.5 text-xs text-kitch-muted backdrop-blur-sm sm:text-[13px]"
            >
              <span className="size-2 shrink-0 rounded-full bg-kitch-accent shadow-[0_0_10px_rgba(230,57,70,0.6)]" />
              {s.label}
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
