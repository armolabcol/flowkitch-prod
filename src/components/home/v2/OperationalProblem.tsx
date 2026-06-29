"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
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
      <ul className="section-problem-footer__list">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2 sm:gap-2.5">
            {index > 0 ? (
              <span className="section-problem-footer__sep" aria-hidden>
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
      className="section-problem relative flex min-h-[100svh] flex-col justify-center border-b border-white/[0.06] py-20 sm:py-24 lg:py-32"
      aria-labelledby={`${content.id}-title`}
    >
      <Container className="section-problem__inner">
        <div className="grid items-center gap-12 sm:gap-14 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-24">
          <div className="section-problem__copy">
            {content.eyebrow ? (
              <p className="section-problem__eyebrow">{content.eyebrow}</p>
            ) : null}

            <h2 id={`${content.id}-title`} className="section-problem__headline">
              <span className="block">{content.title}</span>
              {content.titleLine2 ? (
                <span className="section-problem__headline-line2">
                  {content.titleLine2}
                </span>
              ) : null}
            </h2>

            <p className="section-problem__body">{content.description}</p>

            {content.footerStrip ? (
              <FooterStrip text={content.footerStrip} />
            ) : null}
          </div>

          <div className="section-problem__visual-wrap lg:justify-end">
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
