import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";
import { MarketingHero } from "./MarketingHero";
import { MarketingSection } from "./MarketingSection";

type Props = { locale: Locale; dictionary: Dictionary };

export function RestaurantsPageView({ locale, dictionary }: Props) {
  const m = dictionary.marketing.restaurants;

  return (
    <>
      <MarketingHero
        locale={locale}
        headline={m.hero.headline}
        lead={m.hero.lead}
        cta={m.hero.cta}
      />

      <MarketingSection label={m.pains.label} title={m.pains.title}>
        <div className="grid gap-4 sm:grid-cols-2">
          {m.pains.items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-kitch-border bg-kitch-elevated/40 p-5"
            >
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-kitch-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection label={m.better.label} title={m.better.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {m.better.items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/[0.07] bg-kitch-surface/35 p-5 text-center md:text-left"
            >
              <h3 className="text-base font-semibold text-kitch-accent">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-kitch-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        label={m.cases.label}
        title={m.cases.title}
        subtitle={m.cases.subtitle}
      >
        <ul className="grid gap-4 lg:grid-cols-3">
          {m.cases.items.map((c) => (
            <li
              key={c.title}
              className="rounded-2xl border border-kitch-border bg-gradient-to-b from-kitch-elevated/80 to-kitch-bg/60 p-5"
            >
              <p className="text-sm font-semibold text-white">{c.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-kitch-muted">{c.body}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <section className="border-t border-white/[0.06] py-16 lg:py-20">
        <Container className="max-w-3xl text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {m.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-kitch-muted">{m.cta.body}</p>
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
