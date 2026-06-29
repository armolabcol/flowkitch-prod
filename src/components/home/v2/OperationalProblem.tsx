"use client";

import { useState } from "react";
import type { HomepageV2SectionProps } from "@/components/home/v2/types";

const DEFAULT_MEDIA =
  "/assets/sections/problem/KITCH_SECTION_02_OPERATIONAL_PROBLEM_v01.webp";
const DEFAULT_MEDIA_ALT =
  "Cocina de restaurante en hora pico con equipo bajo presión y pantalla KDS visible";

function DiagnosticCard({
  mediaSrc,
  mediaAlt,
  alerts,
  diagnosticLabel,
  diagnosticSublabel,
}: {
  mediaSrc: string;
  mediaAlt: string;
  alerts: string[];
  diagnosticLabel: string;
  diagnosticSublabel: string;
}) {
  const [imageOk, setImageOk] = useState(true);

  return (
    <div className="problem-diagnostic-card">
      <div className="problem-diagnostic-card__media">
        {imageOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaSrc}
            alt={mediaAlt}
            className="problem-diagnostic-card__img"
            onError={() => setImageOk(false)}
            loading="lazy"
          />
        ) : (
          <div className="problem-diagnostic-card__fallback" aria-hidden />
        )}

        <div className="problem-diagnostic-header" aria-hidden>
          <span className="problem-live-dot" />
          <div>
            <strong className="problem-diagnostic-header__title">
              {diagnosticLabel}
            </strong>
            <small className="problem-diagnostic-header__sub">
              {diagnosticSublabel}
            </small>
          </div>
        </div>

        <div className="problem-alerts" aria-hidden>
          {alerts.map((label) => (
            <div key={label} className="problem-alert">
              <span className="problem-alert__dot" aria-hidden />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignalStrip({ text }: { text: string }) {
  const items = text.split("·").map((item) => item.trim());

  return (
    <div className="problem-signal-strip">
      <ul className="problem-signal-strip__list">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="problem-signal-strip__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="problem-signal-strip__item">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OperationalProblem({ content }: HomepageV2SectionProps) {
  const mediaSrc = content.mediaSrc ?? DEFAULT_MEDIA;
  const mediaAlt = content.mediaAlt ?? DEFAULT_MEDIA_ALT;
  const alerts = content.visualBadges ?? [];
  const diagnosticLabel = content.diagnosticLabel ?? "Operational stress";
  const diagnosticSublabel =
    content.diagnosticSublabel ?? "Peak-hour service flow";

  return (
    <section
      id={content.id}
      className="problem-section relative flex min-h-[100svh] flex-col justify-center"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="problem-section__inner">
        <div className="problem-section__grid">
          <div className="problem-section__copy">
            {content.eyebrow ? (
              <p className="problem-section__eyebrow">{content.eyebrow}</p>
            ) : null}

            <h2 id={`${content.id}-title`} className="problem-section__headline">
              <span className="block">{content.title}</span>
              {content.titleLine2 ? (
                <span className="problem-section__headline-line2">
                  {content.titleLine2}
                </span>
              ) : null}
            </h2>

            <p className="problem-section__body">{content.description}</p>

            <div className="problem-accent-line" aria-hidden />

            {content.footerStrip ? (
              <SignalStrip text={content.footerStrip} />
            ) : null}
          </div>

          <div className="problem-section__diagnostic">
            <DiagnosticCard
              mediaSrc={mediaSrc}
              mediaAlt={mediaAlt}
              alerts={alerts}
              diagnosticLabel={diagnosticLabel}
              diagnosticSublabel={diagnosticSublabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
