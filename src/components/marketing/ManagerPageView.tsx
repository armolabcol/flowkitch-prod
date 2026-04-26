import { ManagerScreenRich } from "@/components/mockups/ProductUIScreens";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MockupDevice } from "@/components/ui/MockupDevice";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { MarketingHero } from "./MarketingHero";
import { MarketingSection } from "./MarketingSection";

type Props = { locale: Locale; dictionary: Dictionary };

export function ManagerPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.manager;

  return (
    <>
      <MarketingHero
        locale={locale}
        headline={m.hero.headline}
        lead={m.hero.lead}
        cta={m.hero.cta}
      />

      <MarketingSection label={m.sees.label} title={m.sees.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {m.sees.items.map((item) => (
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

      <MarketingSection label={m.insights.label} title={m.insights.title}>
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
          {m.insights.body}
        </p>
      </MarketingSection>

      <MarketingSection
        label={m.mockup.label}
        title={m.mockup.title}
        subtitle={m.mockup.subtitle}
      >
        <MockupDevice variant="manager" className="mx-auto">
          <ManagerScreenRich locale={locale} />
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
