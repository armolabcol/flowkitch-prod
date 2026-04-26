import { Building2, Gauge, ReceiptText, UsersRound } from "lucide-react";
import {
  FinalPageCTA,
  InsightCard,
  MidPageCTA,
  OperationalPanel,
  RoleHero,
} from "@/components/marketing/RolePageBlocks";
import {
  KitchenScreenRich,
  ManagerScreenRich,
  WaiterScreenRich,
} from "@/components/mockups/ProductUIScreens";
import { MockupDevice } from "@/components/ui/MockupDevice";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { MarketingSection } from "./MarketingSection";

type Props = { locale: Locale; dictionary: Dictionary };

export function RestaurantsPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.restaurants;
  const es = locale === "es";
  const c = es
    ? {
        label: "Para dueños y operadores",
        proof: ["Mesa, sala y cocina conectadas", "Demo según tu operación", "Sin compromiso"],
        panelLabel: "Operación completa",
        panelTitle: "Deja de administrar el servicio con señales incompletas.",
        panelBody:
          "Kitch crea una línea clara entre lo que el cliente pide, lo que el mesero valida, lo que cocina prepara y lo que el manager controla.",
        metrics: [
          { value: "1", label: "flujo compartido entre roles" },
          { value: "24h", label: "respuesta comercial" },
          { value: "0", label: "compromiso para pedir demo" },
        ],
        steps: [
          "La mesa inicia el pedido con contexto claro de ronda y ubicación.",
          "Sala valida antes de enviar trabajo real a cocina.",
          "Cocina recibe tickets legibles, priorizados y con estado.",
          "El manager revisa servicio en curso, no solo reportes tarde.",
        ],
        midTitle: "Tu restaurante no necesita más pantallas sueltas.",
        midBody:
          "Necesita un flujo operativo que reduzca dudas cuando el comedor se llena.",
        finalTitle: "Conversemos sobre tus mesas, turnos y puntos de fricción.",
        finalBody:
          "Preparamos una demo personalizada para mostrar cómo Kitch se adapta a tu operación real.",
      }
    : {
        label: "For owners and operators",
        proof: ["Table, floor and kitchen connected", "Demo tailored to your operation", "No commitment"],
        panelLabel: "Full operation",
        panelTitle: "Stop running service with incomplete signals.",
        panelBody:
          "Kitch creates a clear line between what guests order, what waiters validate, what the kitchen prepares and what managers control.",
        metrics: [
          { value: "1", label: "shared flow across roles" },
          { value: "24h", label: "commercial response" },
          { value: "0", label: "commitment to request a demo" },
        ],
        steps: [
          "The table starts the order with round and location context.",
          "The floor validates before real work reaches the kitchen.",
          "The kitchen receives readable, prioritized tickets with state.",
          "The manager reviews live service, not only late reports.",
        ],
        midTitle: "Your restaurant does not need more disconnected screens.",
        midBody:
          "It needs an operational flow that reduces doubt when the dining room fills.",
        finalTitle: "Let’s discuss your tables, shifts and real friction points.",
        finalBody:
          "We prepare a personalized demo to show how Kitch fits your actual operation.",
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
        <RestaurantHeroVisual locale={locale} />
      </RoleHero>

      <MarketingSection label={m.pains.label} title={m.pains.title}>
        <div className="grid gap-4 sm:grid-cols-2">
          {m.pains.items.map((item) => (
            <InsightCard key={item.title} title={item.title} body={item.body} />
          ))}
        </div>
      </MarketingSection>

      <OperationalPanel
        label={c.panelLabel}
        title={c.panelTitle}
        body={c.panelBody}
        metrics={c.metrics}
        steps={c.steps}
        icon={Building2}
      />

      <MarketingSection label={m.better.label} title={m.better.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {m.better.items.map((item, index) => (
            <InsightCard
              key={item.title}
              title={item.title}
              body={item.body}
              tone={index === 0 ? "accent" : "default"}
            />
          ))}
        </div>
      </MarketingSection>

      <MidPageCTA
        locale={locale}
        title={c.midTitle}
        body={c.midBody}
        button={m.cta.button}
      />

      <MarketingSection
        label={m.cases.label}
        title={m.cases.title}
        subtitle={m.cases.subtitle}
      >
        <ul className="grid gap-4 lg:grid-cols-3">
          {m.cases.items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-kitch-elevated/80 to-kitch-bg/60 p-5 shadow-[0_18px_56px_rgba(0,0,0,0.26)]"
            >
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-kitch-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <FinalPageCTA
        locale={locale}
        title={c.finalTitle}
        body={c.finalBody}
        button={m.cta.button}
      />
    </>
  );
}

function RestaurantHeroVisual({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-kitch-elevated/80 to-kitch-bg p-4 shadow-[0_32px_96px_rgba(0,0,0,0.42)] sm:min-h-[500px]">
      <div className="absolute left-5 top-5 z-10 rounded-2xl border border-kitch-accent/20 bg-kitch-bg/75 px-4 py-3 backdrop-blur">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-kitch-accent">
          {es ? "Servicio en vivo" : "Live service"}
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          {es ? "Mesa 12 → Cocina → Manager" : "Table 12 → Kitchen → Manager"}
        </p>
      </div>
      <MockupDevice
        variant="kitchen"
        className="absolute left-4 top-24 w-[86%] shadow-[0_26px_76px_rgba(0,0,0,0.5)] sm:left-8 sm:w-[78%]"
      >
        <KitchenScreenRich locale={locale} />
      </MockupDevice>
      <MockupDevice
        variant="tablet"
        className="absolute bottom-8 right-4 z-10 w-[62%] shadow-[0_24px_70px_rgba(0,0,0,0.5)] sm:right-8"
      >
        <WaiterScreenRich locale={locale} />
      </MockupDevice>
      <MockupDevice
        variant="manager"
        className="absolute bottom-5 left-4 z-20 w-[66%] shadow-[0_24px_70px_rgba(0,0,0,0.5)] sm:left-8 sm:w-[56%]"
      >
        <ManagerScreenRich locale={locale} />
      </MockupDevice>
      <div className="absolute right-7 top-8 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/72">
        <Gauge className="size-4 text-kitch-accent" />
        {es ? "Control real" : "Real control"}
      </div>
      <div className="absolute right-8 top-20 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/72">
        <ReceiptText className="size-4 text-kitch-accent" />
        {es ? "Ticket trazable" : "Traceable ticket"}
      </div>
      <div className="absolute right-7 top-32 hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/72 sm:flex">
        <UsersRound className="size-4 text-kitch-accent" />
        {es ? "Roles alineados" : "Aligned roles"}
      </div>
    </div>
  );
}
