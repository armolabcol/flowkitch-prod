import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { getClientPortalData } from "@/services/saas/portal-service";
import {
  formatSaasCurrency,
  formatSaasDate,
  type SaasDictionary,
} from "@/lib/saas-dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

export async function PortalDashboard({
  locale,
  dictionary,
  clientId,
}: {
  locale: Locale;
  dictionary: SaasDictionary;
  clientId?: string | null;
}) {
  const { client, installation, subscription } =
    await getClientPortalData(clientId ?? null);
  const d = dictionary.portal;

  if (!client || !installation) {
    return (
      <p className="text-kitch-muted">
        {locale === "es"
          ? "Sin datos de cliente. Contacta a soporte ARMO para vincular tu cuenta."
          : "No client data. Contact ARMO support to link your account."}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {installation.restaurant.name}
        </h2>
        <p className="mt-1 text-sm text-kitch-muted">{d.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-kitch-surface/80 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-kitch-subtle">
            {d.membership.title}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LicenseStatusBadge
              status={installation.license_status}
              label={dictionary.licenseStatus[installation.license_status]}
            />
            {subscription && (
              <span className="text-sm text-kitch-muted">
                {subscription.plan_name}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm text-kitch-muted">
            {d.membership.expiresAt}:{" "}
            <span className="text-white">
              {formatSaasDate(
                subscription?.current_period_end ??
                  installation.license_expires_at,
                locale,
              )}
            </span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="md">{d.membership.renew}</Button>
            <Button asChild variant="secondary" size="md">
              <Link href={withLocale(locale, "/portal/support")}>
                {d.membership.contactSupport}
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-kitch-surface/80 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-kitch-subtle">
            {d.installation.title}
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-kitch-subtle">{d.installation.siteUrl}</dt>
              <dd className="mt-0.5 text-white">{installation.site_url}</dd>
            </div>
            <div>
              <dt className="text-kitch-subtle">{d.installation.pluginVersion}</dt>
              <dd className="mt-0.5 font-mono text-kitch-muted">
                v{installation.plugin_version}
              </dd>
            </div>
            <div>
              <dt className="text-kitch-subtle">{d.installation.lastValidation}</dt>
              <dd className="mt-0.5 text-kitch-muted">
                {formatSaasDate(installation.last_license_check_at, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-kitch-subtle">{d.installation.apiKey}</dt>
              <dd className="mt-0.5 font-mono text-kitch-muted">
                ••••{installation.api_key_last4}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {subscription && (
        <div className="rounded-2xl border border-white/[0.08] bg-kitch-surface/60 p-6">
          <h3 className="font-medium text-white">{d.billing.title}</h3>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div>
              <p className="text-white">{subscription.plan_name}</p>
              <p className="text-xs text-kitch-subtle">
                {formatSaasDate(subscription.current_period_end, locale)}
              </p>
            </div>
            <p className="text-kitch-muted">
              {formatSaasCurrency(
                subscription.amount_cents,
                subscription.currency,
                locale,
              )}
            </p>
          </div>
          <Link
            href={withLocale(locale, "/portal/billing")}
            className="mt-4 inline-block text-sm text-kitch-accent hover:underline"
          >
            {locale === "es" ? "Ver membresía completa" : "View full membership"} →
          </Link>
        </div>
      )}
    </div>
  );
}
