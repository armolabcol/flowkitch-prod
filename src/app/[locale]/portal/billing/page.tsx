import { SaasMockTable, SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getClientPortalData } from "@/data/saas-mock";
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
  const { payments } = getClientPortalData();
  const d = dict.portal.billing;

  return (
    <>
      <SaasPageHeader title={d.title} />
      <SaasMockTable
        headers={[d.date, d.description, d.amount, d.status]}
        rows={payments.map((p) => [
          formatSaasDate(p.paid_at, locale),
          p.description,
          formatSaasCurrency(p.amount_cents, p.currency, locale),
          dict.portal.paymentStatus[p.status],
        ])}
      />
    </>
  );
}
