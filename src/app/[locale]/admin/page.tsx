import { AdminDashboard } from "@/components/saas/AdminDashboard";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dictionary = getSaasDictionary(locale);

  return <AdminDashboard locale={locale} dictionary={dictionary} />;
}
