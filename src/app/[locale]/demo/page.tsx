import type { Metadata } from "next";
import Link from "next/link";
import { DemoRequestForm } from "@/components/forms/DemoRequestForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata, localeFromParams } from "@/lib/build-page-metadata";
import { withLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const title = `${dict.demoPage.title} | Kitch`;
  return buildPageMetadata({
    locale,
    path: "/demo",
    title,
    description: dict.demoPage.description,
  });
}

export default async function DemoPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const d = dict.demoPage;

  return (
    <Container className="py-16 lg:py-24">
      <div className="max-w-2xl">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {d.title}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-kitch-muted">{d.description}</p>
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-kitch-accent/20 bg-kitch-accent/[0.07] px-4 py-3 text-sm text-kitch-muted">
            <span className="font-medium text-kitch-fg">{d.trustLine}</span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">{d.directToTeam}</p>
        </div>
      </div>
      <div className="mt-10 max-w-3xl">
        <DemoRequestForm dictionary={dict} />
      </div>
      <div className="mt-10">
        <Button asChild variant="ghost" size="sm">
          <Link href={withLocale(locale, "/")}>{dict.placeholder.backHome}</Link>
        </Button>
      </div>
    </Container>
  );
}
