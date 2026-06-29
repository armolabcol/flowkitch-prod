"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  SectionDescription,
  SectionEyebrow,
} from "@/components/home/v2/placeholders";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

const DEFAULT_MEDIA = "/assets/hero/RM001_WEB_HERO_DESKTOP_CLEAN_v01.webp";

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
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
        {imageOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaSrc}
            alt={alt}
            className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center saturate-[0.82] brightness-[0.72]"
            onError={() => setImageOk(false)}
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#1c1c1c] to-[#242424]"
            aria-hidden
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/90 via-[#1c1c1c]/35 to-[#1c1c1c]/15"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[#e63946]/[0.07] mix-blend-multiply"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/25"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-4 sm:p-5">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-[#e63946]/35 bg-black/55 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md sm:text-[11px]"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterStrip({ text }: { text: string }) {
  const items = text.split("·").map((item) => item.trim());

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm sm:px-5 sm:py-4">
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-3">
            {index > 0 ? (
              <span className="hidden text-[#e63946]/70 sm:inline" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-kitch-muted sm:text-[11px]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OperationalProblem({ content }: HomepageV2SectionProps) {
  const mediaSrc = content.mediaSrc ?? DEFAULT_MEDIA;
  const badges = content.visualBadges ?? [];

  return (
    <section
      id={content.id}
      className="relative flex min-h-[100svh] flex-col justify-center border-b border-white/[0.06] py-16 sm:py-20 lg:py-28"
      aria-labelledby={`${content.id}-title`}
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
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

          <div className="w-full lg:justify-self-end">
            <OperationalProblemVisual
              mediaSrc={mediaSrc}
              badges={badges}
              alt=""
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
