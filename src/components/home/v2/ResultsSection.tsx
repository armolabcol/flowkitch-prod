import type {
  HomepageV2ImpactDashboard,
  HomepageV2ImpactMetric,
  HomepageV2SectionProps,
} from "@/components/home/v2/types";
import "@/styles/section-results.css";

const COMPARE_BAR_WIDTHS_BEFORE = ["38%", "42%", "35%"] as const;
const COMPARE_BAR_WIDTHS_KITCH = ["88%", "92%", "86%"] as const;

function SignalStrip({ text }: { text: string }) {
  const items = text.split("·").map((item) => item.trim());

  return (
    <div className="results-signal-strip">
      <ul className="results-signal-strip__list">
        {items.map((item, index) => (
          <li key={item} className="results-signal-strip__item-row">
            {index > 0 ? (
              <span className="results-signal-strip__sep" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="results-signal-strip__item">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImpactMetricCard({ metric }: { metric: HomepageV2ImpactMetric }) {
  const trendClass =
    metric.trend === "up"
      ? "is-up"
      : metric.trend === "down"
        ? "is-down"
        : "is-neutral";
  const valueAccent = metric.trend === "up" || metric.trend === "neutral";

  return (
    <article className="kitch-impact-metric">
      <div className="kitch-impact-metric__top">
        <h3 className="kitch-impact-metric__title">{metric.title}</h3>
        <span
          className={`kitch-impact-metric__indicator ${trendClass}`}
          aria-hidden
        />
      </div>
      <p
        className={`kitch-impact-metric__value${valueAccent ? " is-accent" : ""}`}
      >
        {metric.value}
      </p>
      <p className="kitch-impact-metric__caption">{metric.caption}</p>
    </article>
  );
}

function ImpactDashboard({ dashboard }: { dashboard: HomepageV2ImpactDashboard }) {
  return (
    <div className="kitch-impact-dashboard">
      <header className="kitch-impact-dashboard__header">
        <p className="kitch-impact-dashboard__label">{dashboard.label}</p>
        <p className="kitch-impact-dashboard__sublabel">{dashboard.sublabel}</p>
      </header>

      <div className="kitch-impact-dashboard__metrics">
        {dashboard.metrics.map((metric) => (
          <ImpactMetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div
        className="kitch-impact-compare"
        role="group"
        aria-label={`${dashboard.before.label} / ${dashboard.withKitch.label}`}
      >
        <div className="kitch-impact-compare__col">
          <p className="kitch-impact-compare__label">{dashboard.before.label}</p>
          <ul className="kitch-impact-compare__list">
            {dashboard.before.items.map((item, index) => (
              <li key={item} className="kitch-impact-compare__item">
                <span className="kitch-impact-compare__text">{item}</span>
                <span className="kitch-impact-compare__bar" aria-hidden>
                  <span
                    className="kitch-impact-compare__bar-fill"
                    style={{ width: COMPARE_BAR_WIDTHS_BEFORE[index] }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="kitch-impact-compare__bridge" aria-hidden>
          <span className="kitch-impact-compare__arrow">→</span>
        </div>

        <div className="kitch-impact-compare__col is-kitch">
          <p className="kitch-impact-compare__label">
            {dashboard.withKitch.label}
          </p>
          <ul className="kitch-impact-compare__list">
            {dashboard.withKitch.items.map((item, index) => (
              <li key={item} className="kitch-impact-compare__item">
                <span className="kitch-impact-compare__text">{item}</span>
                <span className="kitch-impact-compare__bar" aria-hidden>
                  <span
                    className="kitch-impact-compare__bar-fill"
                    style={{ width: COMPARE_BAR_WIDTHS_KITCH[index] }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="kitch-impact-outcome">
        <span className="kitch-impact-outcome__dot" aria-hidden />
        <p className="kitch-impact-outcome__copy">
          <span className="kitch-impact-outcome__label">
            {dashboard.outcomeBand.label}
          </span>{" "}
          {dashboard.outcomeBand.text}
        </p>
      </div>

      <p className="kitch-impact-dashboard__disclaimer">{dashboard.disclaimer}</p>
    </div>
  );
}

export function ResultsSection({ content }: HomepageV2SectionProps) {
  const dashboard = content.impactDashboard;

  return (
    <section
      id={content.id}
      className="results-section"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="results-section__inner">
        <div className="results-section__grid">
          <div className="results-section__content">
            {content.eyebrow ? (
              <p className="results-section__eyebrow">{content.eyebrow}</p>
            ) : null}

            <h2 id={`${content.id}-title`} className="results-section__headline">
              <span className="results-section__headline-primary">
                {content.title}
              </span>
              {content.titleLine2 ? (
                <span className="results-section__headline-line2">
                  {content.titleLine2}
                </span>
              ) : null}
            </h2>

            <p className="results-section__body">{content.description}</p>

            {content.footerStrip ? (
              <SignalStrip text={content.footerStrip} />
            ) : null}
          </div>

          {dashboard ? (
            <div className="results-section__visual">
              <ImpactDashboard dashboard={dashboard} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
