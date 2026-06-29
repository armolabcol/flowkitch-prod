"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  SectionDescription,
  SectionEyebrow,
} from "@/components/home/v2/placeholders";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

const DEFAULT_MEDIA =
  "/assets/sections/problem/KITCH_SECTION_02_OPERATIONAL_PROBLEM_v01.webp";
const DEFAULT_MEDIA_ALT =
  "Cocina de restaurante en hora pico con equipo bajo presión y pantalla KDS visible";

function OperationalProblemVisual({
  mediaSrc,
  badges,
  alt,
}: {
  mediaSrc: string;
  badges: string[];
  alt: string;
}) {
  const [imageOk, setImageOk] = useState(true);

  return (
    <div className="section-problem-visual">
      {imageOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaSrc}
          alt={alt}
          className="section-problem-visual__img"
          onError={() => setImageOk(false)}
          loading="lazy"
        />
      ) : (
        <div className="section-problem-visual__fallback" aria-hidden />
      )}

      <div className="problem-visual-badges" aria-hidden>
        {badges.map((badge) => (
          <span key={badge} className="problem-badge">
            <span className="problem-badge__dot" aria-hidden />
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

function FooterStrip({ text }: { text: string }) {
  const items = text.split("·").map((item) => item.trim());

  return (
    <div className="section-problem-footer">
      <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-2 sm:gap-x-3">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2.5 sm:gap-3">
            {index > 0 ? (
              <span className="text-[#e63946]/55" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="section-problem-footer__item">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OperationalProblem({ content }: HomepageV2SectionProps) {
  const mediaSrc = content.mediaSrc ?? DEFAULT_MEDIA;
  const mediaAlt = content.mediaAlt ?? DEFAULT_MEDIA_ALT;
  const badges = content.visualBadges ?? [];

  return (
    <section
      id={content.id}
      className="relative flex min-h-[100svh] flex-col justify-center border-b border-white/[0.06] py-16 sm:py-20 lg:py-28"
      aria-labelledby={`${content.id}-title`}
    >
      <Container>
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-20">
          <div className="flex flex-col gap-6 lg:gap-8">
            {content.eyebrow ? (
              <SectionEyebrow>{content.eyebrow}</SectionEyebrow>
            ) : null}

            <h2
              id={`${content.id}-title`}
              className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              <span className="block">{content.title}</span>
              {content.titleLine2 ? (
                <span className="mt-2 block text-kitch-muted sm:mt-3">
                  {content.titleLine2}
                </span>
              ) : null}
            </h2>

            <SectionDescription>{content.description}</SectionDescription>

            {content.footerStrip ? (
              <FooterStrip text={content.footerStrip} />
            ) : null}
          </div>

          <div className="flex w-full justify-center lg:justify-end">
            <OperationalProblemVisual
              mediaSrc={mediaSrc}
              badges={badges}
              alt={mediaAlt}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
