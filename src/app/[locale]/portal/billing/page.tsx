import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getPortalClientId } from "@/lib/auth/guards";
import { getClientPortalData } from "@/services/saas/portal-service";
import {
  formatSaasCurrency,
  formatSaasDate,
  getSaasDictionary,
} from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function PortalBillingPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const clientId = await getPortalClientId();
  const { subscription } = await getClientPortalData(clientId);
  const d = dict.portal.billing;

  const rows = subscription
    ? [
        [
          formatSaasDate(subscription.current_period_end, locale),
          subscription.plan_name,
          formatSaasCurrency(
            subscription.amount_cents,
            subscription.currency,
            locale,
          ),
          dict.licenseStatus[
            subscription.status as keyof typeof dict.licenseStatus
          ] ?? subscription.status,
        ],
      ]
    : [];

  return (
    <>
      <SaasPageHeader
        title={d.title}
        description={
          locale === "es"
            ? "Historial de pagos disponible en una fase posterior. Aquí se muestra tu membresía activa."
            : "Payment history coming in a later phase. Your active membership is shown below."
        }
      />
      <SaasMockTable
        headers={[d.date, d.description, d.amount, d.status]}
        rows={
          rows.length > 0
            ? rows
            : [
                [
                  "—",
                  locale === "es" ? "Sin membresía activa" : "No active membership",
                  "—",
                  "—",
                ],
              ]
        }
      />
    </>
  );
}
