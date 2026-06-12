import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getPortalClientId } from "@/lib/auth/guards";
import { getClientPortalData } from "@/services/saas/portal-service";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function PortalInstallationPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const clientId = await getPortalClientId();
  const { installation } = await getClientPortalData(clientId);
  const d = dict.portal.installation;

  if (!installation) return null;

  return (
    <>
      <SaasPageHeader title={d.title} />
      <div className="rounded-2xl border border-white/[0.08] bg-kitch-surface/80 p-6 sm:p-8">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-kitch-subtle">
              {d.siteUrl}
            </dt>
            <dd className="mt-1 text-white">{installation.site_url}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-kitch-subtle">
              {d.pluginVersion}
            </dt>
            <dd className="mt-1 font-mono text-kitch-muted">
              v{installation.plugin_version}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-kitch-subtle">
              {d.lastValidation}
            </dt>
            <dd className="mt-1 text-kitch-muted">
              {formatSaasDate(installation.last_license_check_at, locale)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-kitch-subtle">
              {d.lastSync}
            </dt>
            <dd className="mt-1 text-kitch-muted">
              {formatSaasDate(installation.last_sync_at, locale)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-kitch-subtle">
              {d.apiKey}
            </dt>
            <dd className="mt-1 font-mono text-lg text-white">
              ••••{installation.api_key_last4}
            </dd>
            <p className="mt-2 text-xs text-kitch-subtle">{d.apiKeyNote}</p>
          </div>
        </dl>
      </div>
    </>
  );
}
