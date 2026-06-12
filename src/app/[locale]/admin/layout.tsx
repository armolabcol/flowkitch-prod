import type { Metadata } from "next";
import { AdminShell } from "@/components/saas/AdminShell";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  return {
    title: `${dict.admin.title} | Kitch`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dictionary = getSaasDictionary(locale);

  return (
    <AdminShell locale={locale} dictionary={dictionary}>
      {children}
    </AdminShell>
  );
}
