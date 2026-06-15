import { OnboardingForm } from "@/components/saas/OnboardingForm";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { listSalesAgents } from "@/services/saas/profiles-admin-service";
import { requireAdminRoute } from "@/lib/auth/page-scope";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminOnboardingPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  await requireAdminRoute(locale, "onboarding");
  const salesAgents = await listSalesAgents();

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.onboarding}
        description={
          locale === "es"
            ? "Crea cliente, restaurante, instalación, suscripción y API key en un solo paso."
            : "Create client, restaurant, installation, subscription and API key in one step."
        }
      />
      <OnboardingForm locale={locale} salesAgents={salesAgents} />
    </>
  );
}
