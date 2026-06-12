import { PortalDashboard } from "@/components/saas/PortalDashboard";
import { getPortalClientId } from "@/lib/auth/guards";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function PortalPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dictionary = getSaasDictionary(locale);
  const clientId = await getPortalClientId();

  return (
    <PortalDashboard
      locale={locale}
      dictionary={dictionary}
      clientId={clientId}
    />
  );
}
