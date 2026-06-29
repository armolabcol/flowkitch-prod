import type {
  HomepageV2LiveOrderBoard,
  HomepageV2SectionProps,
} from "@/components/home/v2/types";

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

function LiveOrderFlowBoard({ board }: { board: HomepageV2LiveOrderBoard }) {
  const { liveOrder } = board;

  return (
    <div
      className="live-order-board"
      role="region"
      aria-label={`${board.boardLabel}. ${board.boardSublabel}`}
    >
      <header className="live-order-board__header">
        <span className="live-order-board__label">{board.boardLabel}</span>
        <span className="live-order-board__sublabel">{board.boardSublabel}</span>
      </header>

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

          <p className="live-order-card__status-label">{liveOrder.statusLabel}</p>
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
                <span className="live-order-card__meta-label">{row.label}</span>
                <span className="live-order-card__meta-value">{row.value}</span>
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
                <span className="live-flow-station__badge">{station.badge}</span>
                <h3 className="live-flow-station__title">{station.title}</h3>
                <p className="live-flow-station__action">{station.action}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="live-order-board__benefits">
        {board.benefits.map((benefit) => (
          <div key={benefit} className="live-order-board__benefit">
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OperationalFlow({ content }: HomepageV2SectionProps) {
  const board = content.flowMap;

  return (
    <section
      id={content.id}
      className="flow-section relative flex min-h-[100svh] flex-col justify-center"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="flow-section__inner">
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

        {board ? <LiveOrderFlowBoard board={board} /> : null}
      </div>
    </section>
  );
}
