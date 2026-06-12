import type { Metadata } from "next";
import Link from "next/link";
import { SaasLoginForm } from "@/components/forms/SaasLoginForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata, localeFromParams } from "@/lib/build-page-metadata";
import { withLocale, type Locale } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const title = `${dict.portal.title} | Kitch`;
  return buildPageMetadata({
    locale,
    path: "/portal/login",
    title,
    description: dict.portal.seoDescription,
  });
}

export default async function PortalLoginPage({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  const { error: errorCode } = await searchParams;
  const locale: Locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const d = dict.portal;

  const initialError =
    errorCode === "callback_failed" ? d.callbackFailed : undefined;

  return (
    <div className="relative border-b border-white/[0.04]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(230,57,70,0.1),transparent)]"
        aria-hidden
      />
      <Container className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {d.title}
          </h1>
          <p className="mt-3 text-pretty text-kitch-muted">{d.subtitle}</p>
        </div>
        <div className="mt-12">
          <SaasLoginForm
            locale={locale}
            dictionary={dict}
            initialError={initialError}
          />
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary" size="md">
            <Link href={withLocale(locale, "/demo")}>{dict.placeholder.seeDemo}</Link>
          </Button>
          <Button asChild variant="ghost" size="md">
            <Link href={withLocale(locale, "/")}>{dict.placeholder.backHome}</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
