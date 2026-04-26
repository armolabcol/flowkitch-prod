import { ChefHat, Flame, TimerReset, UtensilsCrossed } from "lucide-react";
import {
  FinalPageCTA,
  InsightCard,
  MidPageCTA,
  OperationalPanel,
  RoleHero,
} from "@/components/marketing/RolePageBlocks";
import { KitchenScreenRich } from "@/components/mockups/ProductUIScreens";
import { MockupDevice } from "@/components/ui/MockupDevice";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { MarketingSection } from "./MarketingSection";

type Props = { locale: Locale; dictionary: Dictionary };

export function KitchenPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.kitchen;
  const es = locale === "es";
  const c = es
    ? {
        label: "Para cocina y línea",
        proof: ["Prioridad visible", "Tickets con estado", "Menos errores de despacho"],
        panelLabel: "KDS operativo",
        panelTitle: "La cocina necesita orden visual, no más ruido.",
        panelBody:
          "Kitch ayuda a leer la presión del servicio: qué entró, qué se prepara, qué está listo y qué requiere atención.",
        metrics: [
          { value: "3", label: "estados críticos visibles" },
          { value: "1", label: "cola priorizada" },
          { value: "0", label: "assets pesados en mockups" },
        ],
        steps: [
          "Los tickets entran con mesa, ronda y notas claras.",
          "La brigada distingue preparación, listo y cierre.",
          "Las prioridades se leen sin depender de gritos o capturas.",
          "Sala y cocina comparten el mismo estado en tiempo real.",
        ],
        midTitle: "Una línea ordenada cambia todo el servicio.",
        midBody:
          "Cuando cocina ve prioridad y contexto, el restaurante gana velocidad sin sacrificar precisión.",
        finalTitle: "Ve cómo Kitch organiza tu línea en una demo guiada.",
        finalBody:
          "Revisamos tus tipos de pedido, tiempos y puntos de saturación para mostrar un flujo realista.",
      }
    : {
        label: "For kitchen teams",
        proof: ["Visible priority", "Tickets with state", "Fewer dispatch errors"],
        panelLabel: "Operational KDS",
        panelTitle: "The kitchen needs visual order, not more noise.",
        panelBody:
          "Kitch helps teams read service pressure: what arrived, what is cooking, what is ready and what needs attention.",
        metrics: [
          { value: "3", label: "critical states visible" },
          { value: "1", label: "prioritized queue" },
          { value: "0", label: "heavy assets in mockups" },
        ],
        steps: [
          "Tickets arrive with table, round and clear notes.",
          "The brigade distinguishes preparing, ready and closed.",
          "Priorities are readable without shouting or screenshots.",
          "Floor and kitchen share the same state in real time.",
        ],
        midTitle: "An organized line changes the entire service.",
        midBody:
          "When the kitchen sees priority and context, the restaurant gains speed without losing precision.",
        finalTitle: "See how Kitch organizes your line in a guided demo.",
        finalBody:
          "We review your order types, timings and saturation points to show a realistic flow.",
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
        <KitchenHeroVisual locale={locale} />
      </RoleHero>

      <MarketingSection label={m.problems.label} title={m.problems.title}>
        <ul className="grid gap-4 md:grid-cols-3">
          {m.problems.items.map((item) => (
            <InsightCard key={item.title} title={item.title} body={item.body} />
          ))}
        </ul>
      </MarketingSection>

      <OperationalPanel
        label={c.panelLabel}
        title={c.panelTitle}
        body={c.panelBody}
        metrics={c.metrics}
        steps={c.steps}
        icon={ChefHat}
      />

      <MarketingSection label={m.solution.label} title={m.solution.title}>
        <ul className="grid gap-4 md:grid-cols-3">
          {m.solution.items.map((item, index) => (
            <InsightCard
              key={item.title}
              title={item.title}
              body={item.body}
              tone={index === 0 ? "accent" : "default"}
            />
          ))}
        </ul>
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
        <MockupDevice variant="kitchen" className="mx-auto">
          <KitchenScreenRich locale={locale} />
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

function KitchenHeroVisual({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-kitch-elevated/80 to-kitch-bg p-5 shadow-[0_32px_96px_rgba(0,0,0,0.42)]">
      <div className="absolute right-5 top-5 z-10 rounded-full border border-kitch-accent/25 bg-kitch-accent/10 px-3 py-1.5 text-xs font-semibold text-kitch-accent">
        {es ? "KDS vivo" : "Live KDS"}
      </div>
      <MockupDevice variant="kitchen" className="mt-10 shadow-[0_26px_76px_rgba(0,0,0,0.55)]">
        <KitchenScreenRich locale={locale} />
      </MockupDevice>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: TimerReset,
            label: es ? "Tiempo visible" : "Visible timing",
          },
          {
            icon: Flame,
            label: es ? "Prioridad de línea" : "Line priority",
          },
          {
            icon: UtensilsCrossed,
            label: es ? "Despacho claro" : "Clear dispatch",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-kitch-bg/45 px-4 py-3 text-sm font-medium text-white/78"
            >
              <Icon className="size-4 text-kitch-accent" strokeWidth={1.7} />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
