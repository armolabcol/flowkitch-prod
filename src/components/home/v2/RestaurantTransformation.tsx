"use client";

import { ArrowRight } from "lucide-react";
import type {
  HomepageV2SectionProps,
  HomepageV2TransformationBoard,
} from "@/components/home/v2/types";

function TransformationBoard({ board }: { board: HomepageV2TransformationBoard }) {
  return (
    <div className="transform-board" aria-hidden>
      <header className="transform-board__header">
        <span className="transform-board__label">{board.boardLabel}</span>
        <span className="transform-board__sublabel">{board.boardSublabel}</span>
      </header>

      <div className="transform-board__compare">
        <div className="transform-panel transform-panel--before">
          <h3 className="transform-panel__title">{board.before.title}</h3>
          <p className="transform-panel__subcopy">{board.before.subcopy}</p>
          <ul className="transform-panel__list">
            {board.before.items.map((item) => (
              <li key={item} className="transform-panel__item">
                <span className="transform-panel__dot" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="transform-board__connector" aria-hidden>
          <div className="transform-board__connector-line" />
          <div className="transform-board__core">
            <ArrowRight strokeWidth={2.5} aria-hidden />
          </div>
          <div className="transform-board__connector-line" />
        </div>

        <div className="transform-panel transform-panel--after">
          <h3 className="transform-panel__title">{board.after.title}</h3>
          <p className="transform-panel__subcopy">{board.after.subcopy}</p>
          <ul className="transform-panel__list">
            {board.after.items.map((item) => (
              <li key={item} className="transform-panel__item">
                <span className="transform-panel__dot" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="transform-board__flow">
        {board.flowSteps.map((step, index) => (
          <span key={step} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="transform-board__flow-arrow" aria-hidden>
                →
              </span>
            ) : null}
            <span className="transform-board__flow-step">{step}</span>
          </span>
        ))}
      </footer>
    </div>
  );
}

function SignalStrip({ text }: { text: string }) {
  const parts = text.split("—").map((p) => p.trim());
  const mainPart = parts[0] ?? text;
  const suffix = parts[1];
  const items = mainPart.split("·").map((item) => item.trim());

  return (
    <div className="transform-signal-strip">
      <ul className="transform-signal-strip__list">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="transform-signal-strip__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="transform-signal-strip__item">{item}</span>
          </li>
        ))}
        {suffix ? (
          <>
            <span className="transform-signal-strip__sep" aria-hidden>
              —
            </span>
            <span className="transform-signal-strip__item">{suffix}</span>
          </>
        ) : null}
      </ul>
    </div>
  );
}

export function RestaurantTransformation({ content }: HomepageV2SectionProps) {
  const board = content.transformationBoard;

  return (
    <section
      id={content.id}
      className="transform-section relative flex min-h-[100svh] flex-col justify-center"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="transform-section__inner">
        <div className="transform-section__grid">
          <div className="transform-section__copy">
            {content.eyebrow ? (
              <p className="transform-section__eyebrow">{content.eyebrow}</p>
            ) : null}

            <h2 id={`${content.id}-title`} className="transform-section__headline">
              <span className="block">{content.title}</span>
              {content.titleLine2 ? (
                <span className="transform-section__headline-line2">
                  {content.titleLine2}
                </span>
              ) : null}
            </h2>

            <p className="transform-section__body">{content.description}</p>

            <div className="transform-section__accent" aria-hidden />

            {content.footerStrip ? (
              <SignalStrip text={content.footerStrip} />
            ) : null}
          </div>

          {board ? (
            <div className="transform-section__board-wrap">
              <TransformationBoard board={board} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
