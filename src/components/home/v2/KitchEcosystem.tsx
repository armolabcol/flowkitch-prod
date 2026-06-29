import type {
  HomepageV2EcosystemBoard,
  HomepageV2SectionProps,
} from "@/components/home/v2/types";

function EcosystemSignalStrip({ text }: { text: string }) {
  const parts = text.split("—").map((part) => part.trim());
  const mainPart = parts[0] ?? text;
  const suffix = parts[1];
  const items = mainPart.split("·").map((item) => item.trim());

  return (
    <div className="ecosystem-signal-strip">
      <ul className="ecosystem-signal-strip__list">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="ecosystem-signal-strip__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="ecosystem-signal-strip__item">{item}</span>
          </li>
        ))}
        {suffix ? (
          <>
            <span className="ecosystem-signal-strip__sep" aria-hidden>
              —
            </span>
            <span className="ecosystem-signal-strip__item ecosystem-signal-strip__item--accent">
              {suffix}
            </span>
          </>
        ) : null}
      </ul>
    </div>
  );
}

function EcosystemBoard({
  board,
  footerStrip,
}: {
  board: HomepageV2EcosystemBoard;
  footerStrip?: string;
}) {
  return (
    <div
      className="kitch-ecosystem-board"
      role="region"
      aria-label={`${board.boardLabel}. ${board.boardSublabel}`}
    >
      <div className="kitch-ecosystem-board__mesh" aria-hidden />
      <div className="kitch-ecosystem-board__pulse" aria-hidden />

      <header className="kitch-ecosystem-board__header">
        <span className="kitch-ecosystem-board__label">{board.boardLabel}</span>
        <span className="kitch-ecosystem-board__sublabel">
          {board.boardSublabel}
        </span>
      </header>

      <div className="kitch-ecosystem-board__grid">
        {board.modules.map((module) => (
          <article key={module.title} className="kitch-ecosystem-card">
            <div className="kitch-ecosystem-card__header">
              <span className="kitch-ecosystem-card__symbol" aria-hidden>
                {module.symbol}
              </span>
              <span className="kitch-ecosystem-card__badge">{module.badge}</span>
            </div>

            <h3 className="kitch-ecosystem-card__title">{module.title}</h3>
            <p className="kitch-ecosystem-card__description">
              {module.description}
            </p>
            <p className="kitch-ecosystem-card__benefit">{module.benefit}</p>
          </article>
        ))}
      </div>

      {footerStrip ? <EcosystemSignalStrip text={footerStrip} /> : null}
    </div>
  );
}

export function KitchEcosystem({ content }: HomepageV2SectionProps) {
  const board = content.ecosystemBoard;

  return (
    <section
      id={content.id}
      className="ecosystem-section relative flex min-h-[100svh] flex-col justify-center"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="ecosystem-section__inner">
        <header className="ecosystem-section__header">
          {content.eyebrow ? (
            <p className="ecosystem-section__eyebrow">{content.eyebrow}</p>
          ) : null}

          <h2 id={`${content.id}-title`} className="ecosystem-section__headline">
            <span className="block">{content.title}</span>
            {content.titleLine2 ? (
              <span className="ecosystem-section__headline-line2">
                {content.titleLine2}
              </span>
            ) : null}
          </h2>

          <p className="ecosystem-section__body">{content.description}</p>
        </header>

        {board ? (
          <EcosystemBoard board={board} footerStrip={content.footerStrip} />
        ) : null}
      </div>
    </section>
  );
}
