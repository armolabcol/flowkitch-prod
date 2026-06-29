"use client";

import { useState } from "react";
import { ActiveEcosystemModule } from "@/components/home/v2/ActiveEcosystemModule";
import { KitchFlowMockupCarousel } from "@/components/home/v2/KitchFlowMockupCarousel";
import type {
  HomepageV2FlowPhoto,
  HomepageV2OperatingSystemBoard,
  HomepageV2SectionProps,
} from "@/components/home/v2/types";

const DEFAULT_FLOW_MEDIA =
  "/assets/sections/flow/KITCH_SECTION_04_TABLE_QR_FLOW_v01.webp";

function ImpactStrip({ text }: { text: string }) {
  const items = text.split("·").map((item) => item.trim());

  return (
    <div className="flow-impact-strip">
      <ul className="flow-impact-strip__list">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="flow-impact-strip__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="flow-impact-strip__item">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowSectionVisual({
  mediaSrc,
  mediaAlt,
  photo,
}: {
  mediaSrc: string;
  mediaAlt: string;
  photo: HomepageV2FlowPhoto;
}) {
  const [imageOk, setImageOk] = useState(true);

  return (
    <div className="kitch-live-order-visual">
      {imageOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaSrc}
          alt={mediaAlt}
          className="kitch-live-order-visual__img"
          loading="lazy"
          onError={() => setImageOk(false)}
        />
      ) : (
        <div className="kitch-live-order-visual__fallback" aria-hidden />
      )}

      <span className="flow-photo-badge" aria-hidden>
        {photo.topBadge}
      </span>

      <div className="flow-photo-status" aria-hidden>
        <strong>{photo.title}</strong>
        <p className="flow-photo-status__detail flow-photo-status__detail--full">
          {photo.description}
        </p>
        <p className="flow-photo-status__detail flow-photo-status__detail--short">
          {photo.descriptionMobile ?? photo.description}
        </p>
      </div>
    </div>
  );
}

function KitchOperatingSystemBoard({
  board,
}: {
  board: HomepageV2OperatingSystemBoard;
}) {
  const { liveOrder, flowSteps, ui } = board;
  const [activeSlide, setActiveSlide] = useState(0);
  const activeStep = flowSteps[activeSlide];
  const loyaltyStep = flowSteps[5];
  const moduleLabels = {
    activeModule: board.activeModuleLabel,
    impact: board.impactLabel,
    owner: board.ownerInsightLabel,
  };

  if (!activeStep) return null;

  return (
    <div
      className="kitch-operating-system-board"
      role="region"
      aria-label={`${board.systemLabel}. ${board.journeyLabel}`}
    >
      <div className="kitch-operating-system-board__mesh" aria-hidden />
      <div className="kitch-operating-system-board__pulse" aria-hidden />

      <header className="kitch-operating-system-board__header">
        <span className="kos-board__system-label">{board.systemLabel}</span>
        <span className="kos-board__journey-label">{board.journeyLabel}</span>
        <span className="kos-board__journey-sublabel">
          {board.journeySublabel}
        </span>
      </header>

      <div className="kos-board__journey">
        <div className="kitch-operating-board">
          <div className="kitch-operating-board__main">
            <KitchFlowMockupCarousel
              steps={flowSteps}
              activeIndex={activeSlide}
              onActiveChange={setActiveSlide}
              labels={ui}
            />
          </div>

          <aside className="kitch-operating-board__side">
            <article className="live-order-card live-order-card--compact">
              <div className="live-order-card__top">
                <div>
                  <p className="live-order-card__table">{liveOrder.table}</p>
                  <p className="live-order-card__id">{liveOrder.orderId}</p>
                </div>
                <span className="live-order-card__live-badge">
                  <span className="live-order-card__live-dot" aria-hidden />
                  {liveOrder.liveBadge}
                </span>
              </div>

              <p className="live-order-card__status-label">
                {liveOrder.statusLabel}
              </p>
              <p
                key={activeStep.step}
                className="live-order-card__status-value"
              >
                {activeStep.orderStatus}
              </p>

              <div className="live-order-card__meta">
                {liveOrder.meta.map((row) => (
                  <div key={row.label} className="live-order-card__meta-item">
                    <span className="live-order-card__meta-label">
                      {row.label}
                    </span>
                    <span className="live-order-card__meta-value">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <ActiveEcosystemModule
              key={activeStep.step}
              module={activeStep.module}
              labels={moduleLabels}
            />
          </aside>
        </div>

        <div className="live-order-board__rail">
          <div className="live-order-board__pulse-line" aria-hidden />
          <div className="live-order-board__stations">
            {flowSteps.map((step, index) => {
              const station = step.station;
              if (!station) return null;

              return (
                <article
                  key={step.step}
                  className={`live-flow-station${
                    activeSlide === index
                      ? " live-flow-station--carousel-active"
                      : ""
                  }`}
                >
                  <span className="live-flow-station__symbol" aria-hidden>
                    {station.symbol}
                  </span>
                  <span className="live-flow-station__badge">
                    {station.badge}
                  </span>
                  <h3 className="live-flow-station__title">{station.title}</h3>
                  <p className="live-flow-station__action">{station.action}</p>
                </article>
              );
            })}
            {loyaltyStep ? (
              <article
                className={`live-flow-station live-flow-station--loyalty${
                  activeSlide === 5 ? " live-flow-station--carousel-active" : ""
                }`}
              >
                <span className="live-flow-station__symbol" aria-hidden>
                  ★
                </span>
                <span className="live-flow-station__badge">
                  {loyaltyStep.stepLabel}
                </span>
                <h3 className="live-flow-station__title">
                  {loyaltyStep.stepLabel}
                </h3>
                <p className="live-flow-station__action">
                  {loyaltyStep.module.description}
                </p>
              </article>
            ) : null}
          </div>
        </div>
      </div>

      <div className="kos-board__value">
        <h3 className="kos-board__value-title">{board.valueTitle}</h3>
        <div className="kos-board__benefits">
          {board.benefits.map((benefit) => (
            <div key={benefit} className="kos-board__benefit">
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OperationalFlow({ content, locale }: HomepageV2SectionProps) {
  const board = content.operatingSystem;
  const mediaSrc = content.mediaSrc ?? DEFAULT_FLOW_MEDIA;
  const mediaAlt =
    content.mediaAlt ??
    (locale === "es"
      ? "Restaurante premium con mesas activas donde inicia el flujo de pedidos mediante QR"
      : "Premium restaurant with active tables where the QR ordering flow begins");
  const photo = content.flowPhoto;

  return (
    <section
      id={content.id}
      className="flow-section relative flex min-h-[100svh] flex-col justify-center"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="flow-section__inner">
        <div className="flow-section__hero-grid">
          <header className="flow-section__copy">
            {content.eyebrow ? (
              <p className="flow-section__eyebrow">{content.eyebrow}</p>
            ) : null}

            <h2 id={`${content.id}-title`} className="flow-section__headline">
              <span className="block">{content.title}</span>
              {content.titleLine2 ? (
                <span className="flow-section__headline-line2">
                  {content.titleLine2}
                </span>
              ) : null}
            </h2>

            <p className="flow-section__body">{content.description}</p>

            {content.footerStrip ? (
              <ImpactStrip text={content.footerStrip} />
            ) : null}
          </header>

          {photo ? (
            <div className="flow-section__visual-wrap">
              <FlowSectionVisual
                mediaSrc={mediaSrc}
                mediaAlt={mediaAlt}
                photo={photo}
              />
            </div>
          ) : null}
        </div>

        {board ? (
          <div className="flow-section__board-wrap">
            <KitchOperatingSystemBoard board={board} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
