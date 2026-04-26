import { ClipboardCheck, HandPlatter, MessageSquareWarning } from "lucide-react";
import {
  FinalPageCTA,
  InsightCard,
  MidPageCTA,
  OperationalPanel,
  RoleHero,
} from "@/components/marketing/RolePageBlocks";
import { WaiterScreenRich } from "@/components/mockups/ProductUIScreens";
import { MockupDevice } from "@/components/ui/MockupDevice";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { MarketingSection } from "./MarketingSection";

type Props = { locale: Locale; dictionary: Dictionary };

export function WaitersPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.waiters;
  const es = locale === "es";
  const c = es
    ? {
        label: "Para sala y servicio",
        proof: ["Aprobación clara", "Menos idas a cocina", "Mesas bajo control"],
        panelLabel: "Turno sin fricción",
        panelTitle: "El mesero deja de perseguir información.",
        panelBody:
          "Kitch convierte cada ronda en una secuencia visible: revisar, validar, enviar, seguir y entregar con menos interrupciones.",
        metrics: [
          { value: "4", label: "pasos visibles por ronda" },
          { value: "1", label: "panel para el turno" },
          { value: "24h", label: "contacto después de demo" },
        ],
        steps: [
          "La mesa llega con contexto de pedido y ronda.",
          "El mesero valida antes de enviar a cocina.",
          "El estado avanza sin depender de mensajes sueltos.",
          "Entrega y escalamiento quedan claros para todos.",
        ],
        midTitle: "Menos presión para el equipo de sala.",
        midBody:
          "Cuando el estado es visible, el mesero puede enfocarse en servicio, no en confirmar lo obvio.",
        finalTitle: "Muestra a tu equipo un flujo de sala más liviano.",
        finalBody:
          "Agenda una demo para revisar cómo Kitch acompaña validaciones, rondas y coordinación con cocina.",
      }
    : {
        label: "For floor teams",
        proof: ["Clear approval", "Fewer kitchen check-ins", "Tables under control"],
        panelLabel: "Frictionless shift",
        panelTitle: "The waiter stops chasing information.",
        panelBody:
          "Kitch turns each round into a visible sequence: review, validate, send, track and deliver with fewer interruptions.",
        metrics: [
          { value: "4", label: "visible steps per round" },
          { value: "1", label: "panel for the shift" },
          { value: "24h", label: "follow-up after demo" },
        ],
        steps: [
          "The table arrives with order and round context.",
          "The waiter validates before sending to the kitchen.",
          "State moves forward without scattered messages.",
          "Delivery and escalation are clear for everyone.",
        ],
        midTitle: "Less pressure on the floor team.",
        midBody:
          "When state is visible, waiters can focus on service instead of confirming the obvious.",
        finalTitle: "Show your team a lighter floor workflow.",
        finalBody:
          "Schedule a demo to review how Kitch supports validations, rounds and kitchen coordination.",
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
        <WaiterHeroVisual locale={locale} />
      </RoleHero>

      <MarketingSection label={m.benefits.label} title={m.benefits.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {m.benefits.items.map((item, index) => (
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
        steps={m.workflow.steps}
        icon={ClipboardCheck}
      />

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
        <div className="flex justify-center">
          <MockupDevice variant="tablet" className="w-full max-w-md sm:max-w-lg">
            <WaiterScreenRich locale={locale} />
          </MockupDevice>
        </div>
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

function WaiterHeroVisual({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-kitch-elevated/80 to-kitch-bg p-5 shadow-[0_32px_96px_rgba(0,0,0,0.42)]">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
        <MockupDevice variant="tablet" className="shadow-[0_26px_76px_rgba(0,0,0,0.55)]">
          <WaiterScreenRich locale={locale} />
        </MockupDevice>
        <div className="grid content-center gap-3">
          {[
            {
              icon: HandPlatter,
              title: es ? "Mesa lista para validar" : "Table ready to validate",
              body: es ? "Ronda, mesa y notas en el mismo lugar." : "Round, table and notes in one place.",
            },
            {
              icon: ClipboardCheck,
              title: es ? "Enviar con contexto" : "Send with context",
              body: es ? "Cocina recibe información completa." : "Kitchen receives complete information.",
            },
            {
              icon: MessageSquareWarning,
              title: es ? "Escalar solo lo necesario" : "Escalate only what matters",
              body: es ? "Menos ruido durante el pico." : "Less noise during peak service.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/[0.08] bg-kitch-bg/45 p-4"
              >
                <Icon className="size-5 text-kitch-accent" strokeWidth={1.7} />
                <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-kitch-muted">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
