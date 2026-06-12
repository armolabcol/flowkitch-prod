import type { Metadata } from "next";
import { PortalShell } from "@/components/saas/PortalShell";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  return {
    title: `${dict.portal.title} | Kitch`,
    robots: { index: false, follow: false },
  };
}

export default async function PortalLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dictionary = getSaasDictionary(locale);

  return (
    <PortalShell locale={locale} dictionary={dictionary}>
      {children}
    </PortalShell>
  );
}
