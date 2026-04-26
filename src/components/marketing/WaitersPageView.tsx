import Link from "next/link";
import { WaiterScreenRich } from "@/components/mockups/ProductUIScreens";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MockupDevice } from "@/components/ui/MockupDevice";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";
import { MarketingHero } from "./MarketingHero";
import { MarketingSection } from "./MarketingSection";

type Props = { locale: Locale; dictionary: Dictionary };

export function WaitersPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.waiters;

  return (
    <>
      <MarketingHero
        locale={locale}
        headline={m.hero.headline}
        lead={m.hero.lead}
        cta={m.hero.cta}
      />

      <MarketingSection label={m.benefits.label} title={m.benefits.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {m.benefits.items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-kitch-border bg-kitch-elevated/45 p-5"
            >
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-kitch-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection label={m.workflow.label} title={m.workflow.title}>
        <ol className="max-w-2xl space-y-3">
          {m.workflow.steps.map((step, i) => (
            <li
              key={step}
              className="flex gap-4 rounded-2xl border border-white/[0.06] bg-kitch-bg/50 px-4 py-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-kitch-accent/15 text-xs font-semibold text-kitch-accent">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-kitch-muted">{step}</span>
            </li>
          ))}
        </ol>
      </MarketingSection>

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

      <section className="border-t border-white/[0.06] py-14">
        <Container className="flex justify-center">
          <Button asChild variant="primary" size="lg" className="font-semibold">
            <Link href={withLocale(locale, "/demo")}>{m.hero.cta}</Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
