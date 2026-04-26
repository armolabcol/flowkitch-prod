import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { withLocale, type Locale } from "@/lib/i18n";

type MarketingHeroProps = {
  locale: Locale;
  headline: string;
  lead: string;
  cta: string;
};

export function MarketingHero({ locale, headline, lead, cta }: MarketingHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] py-14 sm:py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(230,57,70,0.14),transparent)]"
        aria-hidden
      />
      <Container className="relative max-w-4xl">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
          {headline}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-kitch-muted">
          {lead}
        </p>
        <div className="mt-8">
          <Button
            asChild
            variant="primary"
            size="lg"
            className="font-semibold shadow-[0_0_36px_rgba(230,57,70,0.28)] ring-1 ring-white/10"
          >
            <Link href={withLocale(locale, "/demo")}>{cta}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
