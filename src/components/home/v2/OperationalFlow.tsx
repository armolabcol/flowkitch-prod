"use client";

import { useState } from "react";
import type {
  HomepageV2FlowPhoto,
  HomepageV2OperatingSystemBoard,
  HomepageV2SectionProps,
} from "@/components/home/v2/types";

const MODULE_SYNC_DELAYS = ["0s", "2s", "4s", "6s", "8s", "9s"];

const DEFAULT_FLOW_MEDIA =
  "/assets/sections/flow/KITCH_SECTION_04_TABLE_QR_FLOW_v01.webp";
const DEFAULT_FLOW_MEDIA_ALT =
  "Restaurante premium con mesas activas donde inicia el flujo de pedidos mediante QR";

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
  const { liveOrder } = board;

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
        <div className="live-order-board__canvas">
          <article className="live-order-card">
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
            <div className="live-order-card__status-cycle">
              {liveOrder.statusCycle.map((status) => (
                <span key={status} className="live-order-card__status-item">
                  {status}
                </span>
              ))}
            </div>

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

          <div className="live-order-board__rail">
            <div className="live-order-board__pulse-line" aria-hidden />
            <div className="live-order-board__stations">
              {board.stations.map((station) => (
                <article key={station.title} className="live-flow-station">
                  <span className="live-flow-station__symbol" aria-hidden>
                    {station.symbol}
                  </span>
                  <span className="live-flow-station__badge">
                    {station.badge}
                  </span>
                  <h3 className="live-flow-station__title">{station.title}</h3>
                  <p className="live-flow-station__action">{station.action}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="kos-board__bridge">
        <span className="kos-board__bridge-label">{board.modulesLabel}</span>
        <p className="kos-board__bridge-copy">{board.modulesSublabel}</p>
      </div>

      <div className="kos-board__modules">
        {board.modules.map((module, index) => (
          <article
            key={module.title}
            className="kos-module-card"
            style={
              {
                "--module-sync-delay": MODULE_SYNC_DELAYS[index] ?? "0s",
              } as React.CSSProperties
            }
          >
            <div className="kos-module-card__header">
              <span className="kos-module-card__symbol" aria-hidden>
                {module.symbol}
              </span>
              <span className="kos-module-card__badge">{module.badge}</span>
            </div>
            <h3 className="kos-module-card__title">{module.title}</h3>
            <p className="kos-module-card__description">{module.description}</p>
            <p className="kos-module-card__benefit">{module.benefit}</p>
          </article>
        ))}
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

export function OperationalFlow({ content }: HomepageV2SectionProps) {
  const board = content.operatingSystem;
  const mediaSrc = content.mediaSrc ?? DEFAULT_FLOW_MEDIA;
  const mediaAlt = content.mediaAlt ?? DEFAULT_FLOW_MEDIA_ALT;
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
