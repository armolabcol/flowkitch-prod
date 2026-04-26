import { BarChart3, BellRing, Gauge, Radar } from "lucide-react";
import {
  FinalPageCTA,
  InsightCard,
  MidPageCTA,
  OperationalPanel,
  RoleHero,
} from "@/components/marketing/RolePageBlocks";
import { ManagerScreenRich } from "@/components/mockups/ProductUIScreens";
import { MockupDevice } from "@/components/ui/MockupDevice";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { MarketingSection } from "./MarketingSection";

type Props = { locale: Locale; dictionary: Dictionary };

export function ManagerPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.manager;
  const es = locale === "es";
  const c = es
    ? {
        label: "Para managers y administradores",
        proof: ["Servicio en vivo", "Alertas operativas", "Decisiones con contexto"],
        panelLabel: "Control en turno",
        panelTitle: "El manager ve lo importante mientras todavía puede actuar.",
        panelBody:
          "Kitch resume el servicio en señales útiles: órdenes activas, tiempos, cuellos de botella y estado por rol.",
        metrics: [
          { value: "Live", label: "estado de operación" },
          { value: "3", label: "KPIs rápidos de turno" },
          { value: "24h", label: "respuesta comercial" },
        ],
        steps: [
          "Identifica mesas y órdenes que se están quedando atrás.",
          "Detecta saturación entre sala y cocina.",
          "Revisa tiempos sin esperar el cierre del día.",
          "Toma decisiones con el mismo estado que ve el equipo.",
        ],
        midTitle: "La administración no debería llegar tarde al problema.",
        midBody:
          "Kitch está pensado para actuar durante el servicio, no solo para mirar reportes después.",
        finalTitle: "Convierte la operación en señales accionables.",
        finalBody:
          "Agenda una demo para ver cómo Kitch puede darle más control al manager de tu restaurante.",
      }
    : {
        label: "For managers and administrators",
        proof: ["Live service", "Operational alerts", "Decisions with context"],
        panelLabel: "Shift control",
        panelTitle: "Managers see what matters while they can still act.",
        panelBody:
          "Kitch summarizes service into useful signals: active orders, timing, bottlenecks and state by role.",
        metrics: [
          { value: "Live", label: "operation state" },
          { value: "3", label: "fast shift KPIs" },
          { value: "24h", label: "commercial response" },
        ],
        steps: [
          "Identify tables and orders that are falling behind.",
          "Spot saturation between floor and kitchen.",
          "Review timing before the day is closed.",
          "Make decisions with the same state the team sees.",
        ],
        midTitle: "Management should not arrive late to the problem.",
        midBody:
          "Kitch is designed to act during service, not only to review reports after.",
        finalTitle: "Turn operations into actionable signals.",
        finalBody:
          "Schedule a demo to see how Kitch can give your restaurant manager more control.",
      };

  return (
    <>
      <RoleHero
        locale={locale}
        label={c.label}
        headline={m.hero.headline}
        lead={m.hero.lead}
        cta={m.hero.cta}
        proof={c.proof}
      >
        <ManagerHeroVisual locale={locale} />
      </RoleHero>

      <MarketingSection label={m.sees.label} title={m.sees.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {m.sees.items.map((item, index) => (
            <InsightCard
              key={item.title}
              title={item.title}
              body={item.body}
              tone={index === 0 ? "accent" : "default"}
            />
          ))}
        </div>
      </MarketingSection>

      <OperationalPanel
        label={c.panelLabel}
        title={c.panelTitle}
        body={c.panelBody}
        metrics={c.metrics}
        steps={c.steps}
        icon={Gauge}
      />

      <MarketingSection label={m.insights.label} title={m.insights.title}>
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <p className="rounded-3xl border border-white/[0.08] bg-kitch-elevated/45 p-6 text-pretty text-base leading-relaxed text-kitch-muted shadow-[0_20px_60px_rgba(0,0,0,0.26)] sm:text-lg">
            {m.insights.body}
          </p>
          <div className="grid gap-3">
            {[es ? "Decidir en servicio" : "Decide during service", es ? "Priorizar por estado" : "Prioritize by state", es ? "Revisar después" : "Review after"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-kitch-bg/45 px-4 py-3 text-sm font-medium text-white/80"
              >
                <BellRing className="size-4 text-kitch-accent" strokeWidth={1.7} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </MarketingSection>

      <MidPageCTA
        locale={locale}
        title={c.midTitle}
        body={c.midBody}
        button={m.hero.cta}
      />

      <MarketingSection
        label={m.mockup.label}
        title={m.mockup.title}
        subtitle={m.mockup.subtitle}
      >
        <MockupDevice variant="manager" className="mx-auto">
          <ManagerScreenRich locale={locale} />
        </MockupDevice>
      </MarketingSection>

      <FinalPageCTA
        locale={locale}
        title={c.finalTitle}
        body={c.finalBody}
        button={m.hero.cta}
      />
    </>
  );
}

function ManagerHeroVisual({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-kitch-elevated/80 to-kitch-bg p-5 shadow-[0_32px_96px_rgba(0,0,0,0.42)]">
      <div className="grid gap-4">
        <MockupDevice variant="manager" className="shadow-[0_26px_76px_rgba(0,0,0,0.55)]">
          <ManagerScreenRich locale={locale} />
        </MockupDevice>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: BarChart3,
              value: "96%",
              label: es ? "salud del turno" : "shift health",
            },
            {
              icon: Radar,
              value: "2",
              label: es ? "alertas activas" : "active alerts",
            },
            {
              icon: Gauge,
              value: "19m",
              label: es ? "TAT visible" : "visible TAT",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-white/[0.08] bg-kitch-bg/45 p-4"
              >
                <Icon className="size-5 text-kitch-accent" strokeWidth={1.7} />
                <p className="mt-3 text-xl font-semibold tabular-nums text-white">{item.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-kitch-muted">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
