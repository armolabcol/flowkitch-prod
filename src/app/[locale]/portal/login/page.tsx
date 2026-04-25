import type { Metadata } from "next";
import Link from "next/link";
import { PortalLoginPlaceholder } from "@/components/forms/PortalLoginPlaceholder";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale, withLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  return { title: dict.portal.title };
}

export default async function PortalLoginPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const d = dict.portal;

  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {d.title}
        </h1>
        <p className="mt-4 text-pretty text-kitch-muted">{d.subtitle}</p>
      </div>
      <div className="mt-12">
        <PortalLoginPlaceholder dictionary={dict} />
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild variant="secondary" size="md">
          <Link href={withLocale(locale, "/demo")}>{dict.placeholder.seeDemo}</Link>
        </Button>
        <Button asChild variant="ghost" size="md">
          <Link href={withLocale(locale, "/")}>{dict.placeholder.backHome}</Link>
        </Button>
      </div>
    </Container>
  );
}
