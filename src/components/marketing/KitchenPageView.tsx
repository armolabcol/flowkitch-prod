import { KitchenScreenRich } from "@/components/mockups/ProductUIScreens";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MockupDevice } from "@/components/ui/MockupDevice";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { MarketingHero } from "./MarketingHero";
import { MarketingSection } from "./MarketingSection";

type Props = { locale: Locale; dictionary: Dictionary };

export function KitchenPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.kitchen;

  return (
    <>
      <MarketingHero
        locale={locale}
        headline={m.hero.headline}
        lead={m.hero.lead}
        cta={m.hero.cta}
      />

      <MarketingSection label={m.problems.label} title={m.problems.title}>
        <ul className="grid gap-4 md:grid-cols-3">
          {m.problems.items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-kitch-border bg-kitch-surface/40 p-5"
            >
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-kitch-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection label={m.solution.label} title={m.solution.title}>
        <ul className="grid gap-4 md:grid-cols-3">
          {m.solution.items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-kitch-accent/10 to-transparent p-5"
            >
              <h3 className="text-base font-semibold text-kitch-accent">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-kitch-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection
        label={m.mockup.label}
        title={m.mockup.title}
        subtitle={m.mockup.subtitle}
      >
        <MockupDevice variant="kitchen" className="mx-auto">
          <KitchenScreenRich locale={locale} />
        </MockupDevice>
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
