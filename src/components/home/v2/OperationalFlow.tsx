import type {
  HomepageV2FlowMap,
  HomepageV2SectionProps,
} from "@/components/home/v2/types";

function SignalStrip({ text }: { text: string }) {
  const parts = text.split("—").map((p) => p.trim());
  const mainPart = parts[0] ?? text;
  const suffix = parts[1];
  const items = mainPart.split("·").map((item) => item.trim());

  return (
    <div className="flow-signal-strip">
      <ul className="flow-signal-strip__list">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="flow-signal-strip__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="flow-signal-strip__item">{item}</span>
          </li>
        ))}
        {suffix ? (
          <>
            <span className="flow-signal-strip__sep" aria-hidden>
              —
            </span>
            <span className="flow-signal-strip__item">{suffix}</span>
          </>
        ) : null}
      </ul>
    </div>
  );
}

function OperatingFlowMap({ flowMap }: { flowMap: HomepageV2FlowMap }) {
  return (
    <div className="kitch-flow-map" aria-hidden>
      <header className="kitch-flow-map__header">
        <div>
          <span className="kitch-flow-map__label">{flowMap.mapLabel}</span>
          {flowMap.mapSublabel ? (
            <span className="kitch-flow-map__sublabel">{flowMap.mapSublabel}</span>
          ) : null}
        </div>
        <span className="kitch-flow-map__core">Kitch Flow</span>
      </header>

      <div className="kitch-flow-map__track">
        <div className="kitch-flow-map__backline" aria-hidden />

        <div className="kitch-flow-map__nodes">
          {flowMap.nodes.map((node, index) => (
            <div key={node.title} className="contents">
              <div className="kitch-flow-node-wrap">
                <article className="kitch-flow-node">
                  <span className="kitch-flow-node__symbol" aria-hidden>
                    {node.symbol}
                  </span>
                  <span className="kitch-flow-node__badge">{node.badge}</span>
                  <h3 className="kitch-flow-node__title">{node.title}</h3>
                  <p className="kitch-flow-node__subcopy">{node.subcopy}</p>
                </article>
              </div>
              {index < flowMap.nodes.length - 1 ? (
                <div className="kitch-flow-connector" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <footer className="kitch-flow-map__timeline">
        {flowMap.timeline.map((step, index) => (
          <span key={step} className="kitch-flow-timeline-step">
            <span className="kitch-flow-timeline-step__num">{index + 1}</span>
            {step}
          </span>
        ))}
      </footer>
    </div>
  );
}

export function OperationalFlow({ content }: HomepageV2SectionProps) {
  const flowMap = content.flowMap;

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
        </header>

        {flowMap ? <OperatingFlowMap flowMap={flowMap} /> : null}

        {content.footerStrip ? (
          <SignalStrip text={content.footerStrip} />
        ) : null}
      </div>
    </section>
  );
}
