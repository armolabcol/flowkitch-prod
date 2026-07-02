"use client";

import { useState } from "react";
import type {
  HomepageV2AndroidOverlay,
  HomepageV2SectionProps,
} from "@/components/home/v2/types";

const DEFAULT_MEDIA =
  "/assets/sections/android/KITCH_ANDROID_COLLABORATOR_v01.webp";

function SignalStrip({ text }: { text: string }) {
  const items = text.split("·").map((item) => item.trim());

  return (
    <div className="android-signal-strip">
      <ul className="android-signal-strip__list">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="android-signal-strip__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="android-signal-strip__item">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MicroBenefits({ items }: { items: string[] }) {
  return (
    <ul className="android-microbenefits">
      {items.map((item) => (
        <li key={item} className="android-microbenefit">
          <span className="android-microbenefit__dot" aria-hidden />
          <span className="android-microbenefit__text">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function AndroidVisualCard({
  mediaSrc,
  mediaAlt,
  placeholderLabel,
  placeholderPendingLabel,
  overlay,
}: {
  mediaSrc: string;
  mediaAlt: string;
  placeholderLabel: string;
  placeholderPendingLabel: string;
  overlay: HomepageV2AndroidOverlay;
}) {
  const [imageOk, setImageOk] = useState(false);

  return (
    <article className="android-visual-card">
      <div className="android-visual-card__media">
        {imageOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaSrc}
            alt={mediaAlt}
            className="android-visual-card__img"
            loading="lazy"
          />
        ) : (
          <div className="android-visual-card__fallback" role="img" aria-label={mediaAlt}>
            <span className="android-visual-card__fallback-file">
              {placeholderLabel}
            </span>
            <span className="android-visual-card__fallback-label">
              {placeholderPendingLabel}
            </span>
          </div>
        )}
        {/* Preload without showing broken image */}
        {!imageOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaSrc}
            alt=""
            aria-hidden
            className="android-visual-card__preload"
            onLoad={() => setImageOk(true)}
            onError={() => setImageOk(false)}
          />
        ) : null}
        <div className="android-visual-card__mesh" aria-hidden />
      </div>

      <div className="android-visual-card__overlay">
        <p className="android-visual-card__overlay-title">{overlay.title}</p>
        <p className="android-visual-card__overlay-sub">{overlay.subtitle}</p>
        <ul className="android-visual-card__indicators">
          {overlay.indicators.map((indicator, index) => (
            <li
              key={indicator}
              className={`android-visual-card__indicator${
                index === 0 ? " is-live" : ""
              }`}
            >
              <span className="android-visual-card__indicator-dot" aria-hidden />
              <span>{indicator}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function AndroidSection({ content, locale }: HomepageV2SectionProps) {
  const mediaSrc = content.mediaSrc ?? DEFAULT_MEDIA;
  const mediaAlt =
    content.mediaAlt ??
    (locale === "es"
      ? "Android de Kitch integrado en restaurante como colaborador digital del equipo operativo"
      : "Kitch android integrated in the restaurant as a digital teammate for the operations team");
  const placeholderLabel = content.mediaPlaceholder;
  const microBenefits = content.microBenefits ?? [];
  const overlay = content.androidOverlay;
  const placeholderPending =
    locale === "es" ? "Mockup pendiente" : "Pending mockup";

  return (
    <section
      id={content.id}
      className="android-section relative flex min-h-[100svh] flex-col justify-center"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="android-section__inner">
        <div className="android-section__grid">
          <header className="android-section__copy">
            {content.eyebrow ? (
              <p className="android-section__eyebrow">{content.eyebrow}</p>
            ) : null}

            <h2 id={`${content.id}-title`} className="android-section__headline">
              <span className="block">{content.title}</span>
              {content.titleLine2 ? (
                <span className="android-section__headline-line2">
                  {content.titleLine2}
                </span>
              ) : null}
            </h2>

            <p className="android-section__body">{content.description}</p>

            {content.footerStrip ? (
              <SignalStrip text={content.footerStrip} />
            ) : null}

            {microBenefits.length > 0 ? (
              <MicroBenefits items={microBenefits} />
            ) : null}
          </header>

          {overlay ? (
            <div className="android-section__visual-wrap">
              <AndroidVisualCard
                mediaSrc={mediaSrc}
                mediaAlt={mediaAlt}
                placeholderLabel={placeholderLabel}
                placeholderPendingLabel={placeholderPending}
                overlay={overlay}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
