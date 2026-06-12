import type { Metadata } from "next";
import Link from "next/link";
import { SaasResetPasswordForm } from "@/components/forms/SaasResetPasswordForm";
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
  return buildPageMetadata({
    locale,
    path: "/portal/reset-password",
    title: `${dict.portal.resetPasswordTitle} | Kitch`,
    description: dict.portal.resetPasswordHint,
  });
}

export default async function PortalResetPasswordPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const d = dict.portal;

  return (
    <div className="relative border-b border-white/[0.04]">
      <Container className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {d.resetPasswordTitle}
          </h1>
        </div>
        <div className="mt-12">
          <SaasResetPasswordForm locale={locale} dictionary={dict} />
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="ghost" size="md">
            <Link href={withLocale(locale, "/portal/login")}>{d.backToLogin}</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
