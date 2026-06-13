import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AddInstallationForm,
  AddRestaurantForm,
  ClientUserLinkForm,
  InstallationApiKeyActions,
} from "@/components/saas/ClientDetailActions";
import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getClientDetail } from "@/services/saas/client-detail-service";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import { withLocale, defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function AdminClientDetailPage({ params }: Props) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const detail = await getClientDetail(id);

  if (!detail) notFound();

  const { client, restaurants, installations, subscriptions, profiles } = detail;

  return (
    <>
      <SaasPageHeader
        title={client.name}
        description={client.email}
      />
      <div className="mb-4">
        <Link
          href={withLocale(locale, "/admin/clients")}
          className="text-sm text-kitch-muted hover:text-white"
        >
          ← {dict.admin.nav.clients}
        </Link>
      </div>

      <section className="mb-8 space-y-3">
        <h3 className="text-sm font-medium text-white">
          {locale === "es" ? "Usuarios portal" : "Portal users"}
        </h3>
        {profiles.length > 0 ? (
          <ul className="text-sm text-kitch-muted">
            {profiles.map((p) => (
              <li key={p.id}>
                {p.email} — {p.role}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-kitch-muted">
            {locale === "es" ? "Sin usuarios vinculados" : "No linked users"}
          </p>
        )}
        <ClientUserLinkForm clientId={client.id} locale={locale} />
      </section>

      <section className="mb-8 space-y-3">
        <h3 className="text-sm font-medium text-white">{dict.admin.nav.restaurants}</h3>
        <AddRestaurantForm clientId={client.id} country={client.country} locale={locale} />
        <ul className="space-y-2 text-sm text-kitch-muted">
          {restaurants.map((r) => (
            <li key={r.id}>
              {r.name} — {r.city}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h3 className="text-sm font-medium text-white">{dict.admin.nav.installations}</h3>
        {restaurants.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/[0.06] p-4">
            <p className="text-xs text-kitch-subtle mb-2">{r.name}</p>
            <AddInstallationForm restaurantId={r.id} locale={locale} />
          </div>
        ))}
        {installations.map((i) => (
          <div
            key={i.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] p-4"
          >
            <div>
              <p className="text-sm text-white">{i.site_url}</p>
              <p className="text-xs text-kitch-muted">
                ••••{i.api_key_last4} —{" "}
                <LicenseStatusBadge
                  status={i.license_status as never}
                  label={dict.licenseStatus[i.license_status as keyof typeof dict.licenseStatus]}
                />
                {" — "}
                {formatSaasDate(i.license_expires_at, locale)}
              </p>
            </div>
            <InstallationApiKeyActions installationId={i.id} locale={locale} />
          </div>
        ))}
      </section>

      {subscriptions.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-white mb-2">
            {locale === "es" ? "Suscripción" : "Subscription"}
          </h3>
          <p className="text-sm text-kitch-muted">
            {subscriptions[0].plan_name} — {subscriptions[0].status} —{" "}
            {formatSaasDate(subscriptions[0].current_period_end, locale)}
          </p>
        </section>
      )}
    </>
  );
}
