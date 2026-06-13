import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getPortalClientId } from "@/lib/auth/guards";
import { getClientPortalData } from "@/services/saas/portal-service";
import { listPaymentsForClient } from "@/services/saas/payments-service";
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
  const payments = clientId ? await listPaymentsForClient(clientId) : [];
  const d = dict.portal.billing;

  const paymentRows =
    payments.length > 0
      ? payments.map((p) => [
          formatSaasDate(p.paid_at ?? p.id.slice(0, 8), locale),
          p.description || (locale === "es" ? "Pago" : "Payment"),
          formatSaasCurrency(p.amount_cents, p.currency, locale),
          dict.licenseStatus[
            p.status as keyof typeof dict.licenseStatus
          ] ?? p.status,
        ])
      : subscription
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
          payments.length > 0
            ? locale === "es"
              ? "Historial de pagos registrados en tu cuenta."
              : "Payment history recorded on your account."
            : locale === "es"
              ? "Membresía activa. El historial detallado aparecerá cuando se registren pagos."
              : "Active membership. Detailed history appears once payments are recorded."
        }
      />
      <SaasMockTable
        headers={[d.date, d.description, d.amount, d.status]}
        rows={
          paymentRows.length > 0
            ? paymentRows
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
