import Link from "next/link";
import {
  KitchenScreenRich,
  ManagerScreenRich,
  MenuScreenRich,
  WaiterScreenRich,
} from "@/components/mockups/ProductUIScreens";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MockupDevice } from "@/components/ui/MockupDevice";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";
import { MarketingHero } from "./MarketingHero";
import { MarketingSection } from "./MarketingSection";
import { RoleFlowDiagram } from "./RoleFlowDiagram";

type Props = { locale: Locale; dictionary: Dictionary };

export function ProductPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.product;

  return (
    <>
      <MarketingHero
        locale={locale}
        headline={m.hero.headline}
        lead={m.hero.lead}
        cta={m.hero.cta}
      />

      <MarketingSection
        id="what-is"
        label={m.whatIs.label}
        title={m.whatIs.title}
      >
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
          {m.whatIs.body}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {m.whatIs.bullets.map((b) => (
            <li
              key={b}
              className="rounded-2xl border border-white/[0.06] bg-kitch-bg/50 px-4 py-3 text-sm leading-relaxed text-kitch-muted"
            >
              {b}
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        id="roles"
        label={m.roles.label}
        title={m.roles.title}
        subtitle={m.roles.subtitle}
      >
        <RoleFlowDiagram nodes={m.roles.nodes} />
      </MarketingSection>

      <MarketingSection
        id="flow"
        label={m.flowDeep.label}
        title={m.flowDeep.title}
        subtitle={m.flowDeep.intro}
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {m.flowDeep.states.map((s, i) => (
            <li
              key={s.name}
              className="relative overflow-hidden rounded-2xl border border-kitch-border bg-kitch-elevated/50 p-4"
            >
              <span className="font-mono text-[10px] text-kitch-accent">{(i + 1).toString().padStart(2, "0")}</span>
              <p className="mt-1 text-sm font-semibold text-white">{s.name}</p>
              <p className="mt-2 text-xs leading-relaxed text-kitch-subtle">{s.desc}</p>
            </li>
          ))}
        </ol>
      </MarketingSection>

      <MarketingSection
        id="capabilities"
        label={m.capabilities.label}
        title={m.capabilities.title}
        subtitle={m.capabilities.subtitle}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {m.capabilities.cards.map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-white/[0.07] bg-kitch-surface/40 p-5 sm:p-6"
            >
              <h3 className="text-base font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-kitch-muted">{c.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        id="visual"
        label={m.visual.label}
        title={m.visual.title}
        subtitle={m.visual.subtitle}
      >
        <div className="grid items-start justify-items-center gap-10 lg:grid-cols-2">
          <div className="flex w-full flex-col items-center gap-8">
            <MockupDevice variant="phone">
              <MenuScreenRich locale={locale} />
            </MockupDevice>
            <MockupDevice variant="tablet">
              <WaiterScreenRich locale={locale} />
            </MockupDevice>
          </div>
          <div className="flex w-full max-w-xl flex-col gap-8 lg:max-w-none">
            <MockupDevice variant="kitchen">
              <KitchenScreenRich locale={locale} />
            </MockupDevice>
            <MockupDevice variant="manager">
              <ManagerScreenRich locale={locale} />
            </MockupDevice>
          </div>
        </div>
      </MarketingSection>

      <section className="border-t border-white/[0.06] py-16 lg:py-20">
        <Container className="max-w-3xl text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {m.cta.title}
          </h2>
          <Button
            asChild
            variant="primary"
            size="lg"
            className="mt-8 font-semibold shadow-[0_0_32px_rgba(230,57,70,0.25)]"
          >
            <Link href={withLocale(locale, "/demo")}>{m.cta.button}</Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
