import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PortalRenewButton } from "@/components/saas/PortalRenewButton";
import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getPortalClientId } from "@/lib/auth/guards";
import { getClientPortalData } from "@/services/saas/portal-service";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import { formatMembershipAmount } from "@/lib/billing-utils";
import { withLocale, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function PortalMembershipPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const clientId = await getPortalClientId();
  const { subscription, installation } = await getClientPortalData(clientId);
  const d = dict.portal.membership;

  if (!installation) return null;

  return (
    <>
      <SaasPageHeader title={d.title} />
      <div className="rounded-2xl border border-white/[0.08] bg-kitch-surface/80 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <LicenseStatusBadge
            status={installation.license_status}
            label={dict.licenseStatus[installation.license_status]}
          />
          {subscription && (
            <span className="text-lg text-white">{subscription.plan_name}</span>
          )}
        </div>
        {subscription && (
          <p className="mt-4 text-kitch-muted">
            {locale === "es" ? "Membresía" : "Membership"}:{" "}
            <span className="text-white">
              {formatMembershipAmount(
                subscription.amount_cents,
                subscription.currency,
                locale,
              )}
            </span>
          </p>
        )}
        <p className="mt-6 text-kitch-muted">
          {d.expiresAt}:{" "}
          <span className="text-white">
            {formatSaasDate(
              subscription?.current_period_end ??
                installation.license_expires_at,
              locale,
            )}
          </span>
        </p>
        {subscription?.grace_until && (
          <p className="mt-2 text-sm text-amber-300/90">
            {locale === "es" ? "Periodo de gracia hasta" : "Grace period until"}:{" "}
            {formatSaasDate(subscription.grace_until, locale)}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <PortalRenewButton
            label={d.renew}
            locale={locale}
            amountLabel={
              subscription
                ? formatMembershipAmount(
                    subscription.amount_cents,
                    subscription.currency,
                    locale,
                  )
                : undefined
            }
          />
          <Button asChild variant="secondary" size="md">
            <Link href={withLocale(locale, "/portal/support")}>{d.contactSupport}</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
