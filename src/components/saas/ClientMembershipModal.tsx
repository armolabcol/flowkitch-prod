"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { withLocale } from "@/lib/i18n";
import { InstallationApiKeyActions } from "@/components/saas/InstallationApiKeyActions";
import { InstallationLicenseActions } from "@/components/saas/InstallationLicenseActions";
import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { formatMembershipAmount, paymentProviderLabel } from "@/lib/billing-utils";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import type { LicenseStatus } from "@/types/saas";
import type { Locale } from "@/lib/i18n";

type HubDetail = {
  client: {
    id: string;
    name: string;
    email: string;
    country: string;
    payment_provider: string | null;
    tax_id: string | null;
  };
  membership: {
    status: LicenseStatus;
    planName: string | null;
    amountCents: number | null;
    currency: string | null;
    periodEnd: string | null;
    expiresAt: string | null;
    daysRemaining: number | null;
  };
  restaurants: Array<{ id: string; name: string; city: string }>;
  installations: Array<{
    id: string;
    site_url: string;
    license_status: string;
    license_expires_at: string;
    grace_until: string | null;
    restaurant_name: string;
    api_key_last4: string;
  }>;
  assignedAgent: { id: string; email: string; full_name: string | null } | null;
};

function countdownCopy(days: number | null, locale: Locale) {
  if (days === null) {
    return locale === "es" ? "Sin fecha" : "No date";
  }
  if (days < 0) {
    return locale === "es"
      ? `Vencida hace ${Math.abs(days)} día${Math.abs(days) === 1 ? "" : "s"}`
      : `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  }
  if (days === 0) {
    return locale === "es" ? "Vence hoy" : "Expires today";
  }
  return locale === "es"
    ? `${days} día${days === 1 ? "" : "s"}`
    : `${days} day${days === 1 ? "" : "s"}`;
}

export function ClientMembershipModal({
  clientId,
  locale,
  canManageLicense,
  onClose,
}: {
  clientId: string;
  locale: Locale;
  canManageLicense: boolean;
  onClose: () => void;
}) {
  const dict = getSaasDictionary(locale);
  const isEs = locale === "es";
  const [detail, setDetail] = useState<HubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`);
      const data = (await res.json()) as { ok?: boolean; message?: string } & HubDetail;
      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? (isEs ? "No se pudo cargar" : "Could not load"));
      }
      setDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [clientId, isEs]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const days = detail?.membership.daysRemaining ?? null;
  const countdownTone =
    days === null
      ? "text-kitch-muted"
      : days <= 0
        ? "text-red-300"
        : days <= 30
          ? "text-amber-200"
          : "text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label={isEs ? "Cerrar" : "Close"}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-membership-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/[0.08] bg-[#121212] shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kitch-accent">
              {isEs ? "Ficha del cliente" : "Client file"}
            </p>
            <h2
              id="client-membership-title"
              className="mt-1 truncate text-xl font-semibold text-white"
            >
              {detail?.client.name ?? (isEs ? "Cargando…" : "Loading…")}
            </h2>
            <p className="truncate text-sm text-kitch-muted">
              {detail?.client.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-kitch-muted hover:bg-white/5 hover:text-white"
            aria-label={isEs ? "Cerrar" : "Close"}
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {loading ? (
            <p className="text-sm text-kitch-muted">
              {isEs ? "Cargando detalle…" : "Loading details…"}
            </p>
          ) : null}
          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          {detail ? (
            <div className="space-y-6">
              <section className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-kitch-subtle">
                    {isEs ? "Membresía" : "Membership"}
                  </p>
                  <div className="mt-2">
                    <LicenseStatusBadge
                      status={detail.membership.status}
                      label={
                        dict.licenseStatus[detail.membership.status] ??
                        detail.membership.status
                      }
                    />
                  </div>
                  <p className="mt-3 text-sm text-white">
                    {detail.membership.planName ?? (isEs ? "Sin plan" : "No plan")}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-kitch-subtle">
                    {isEs ? "Próxima renovación" : "Next renewal"}
                  </p>
                  <p className={`mt-2 text-3xl font-semibold tracking-tight ${countdownTone}`}>
                    {countdownCopy(days, locale)}
                  </p>
                  <p className="mt-1 text-xs text-kitch-muted">
                    {detail.membership.expiresAt
                      ? formatSaasDate(detail.membership.expiresAt, locale)
                      : "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-kitch-subtle">
                    {isEs ? "Facturación" : "Billing"}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {detail.membership.amountCents != null &&
                    detail.membership.currency
                      ? formatMembershipAmount(
                          detail.membership.amountCents,
                          detail.membership.currency,
                          locale,
                        )
                      : "—"}
                  </p>
                  <p className="mt-1 text-xs text-kitch-muted">
                    {paymentProviderLabel(detail.client.payment_provider, locale)}
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-white/[0.06] p-4">
                <h3 className="text-sm font-medium text-white">
                  {isEs ? "Datos del cliente" : "Client details"}
                </h3>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-kitch-subtle">{isEs ? "País" : "Country"}</dt>
                    <dd className="text-kitch-muted">
                      {dict.countries[detail.client.country] ?? detail.client.country}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-kitch-subtle">NIT / Tax ID</dt>
                    <dd className="text-kitch-muted">{detail.client.tax_id || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-kitch-subtle">
                      {isEs ? "Agente comercial" : "Sales agent"}
                    </dt>
                    <dd className="text-kitch-muted">
                      {detail.assignedAgent?.full_name ||
                        detail.assignedAgent?.email ||
                        "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-kitch-subtle">
                      {isEs ? "Restaurantes" : "Restaurants"}
                    </dt>
                    <dd className="text-kitch-muted">
                      {detail.restaurants.length > 0
                        ? detail.restaurants
                            .map((restaurant) => restaurant.name)
                            .join(", ")
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-medium text-white">
                  {isEs ? "API y licencias" : "API and licenses"}
                </h3>
                {detail.installations.length === 0 ? (
                  <p className="text-sm text-kitch-muted">
                    {isEs ? "Sin instalaciones todavía." : "No installations yet."}
                  </p>
                ) : (
                  detail.installations.map((installation) => (
                    <article
                      key={installation.id}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">
                            {installation.restaurant_name}
                          </p>
                          <p className="truncate text-xs text-kitch-muted">
                            {installation.site_url}
                          </p>
                          <p className="mt-2 text-xs text-kitch-muted">
                            API ••••{installation.api_key_last4} —{" "}
                            {isEs ? "vence" : "expires"}{" "}
                            {formatSaasDate(installation.license_expires_at, locale)}
                          </p>
                          <div className="mt-2">
                            <LicenseStatusBadge
                              status={installation.license_status as LicenseStatus}
                              label={
                                dict.licenseStatus[
                                  installation.license_status as LicenseStatus
                                ] ?? installation.license_status
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          {canManageLicense ? (
                            <InstallationLicenseActions
                              installationId={installation.id}
                              currentStatus={
                                installation.license_status as LicenseStatus
                              }
                              locale={locale}
                              statusLabels={dict.licenseStatus}
                              onDone={() => void load()}
                            />
                          ) : null}
                          {canManageLicense ? (
                            <InstallationApiKeyActions
                              installationId={installation.id}
                              locale={locale}
                            />
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </section>

              <p className="text-xs text-kitch-subtle">
                <Link
                  href={withLocale(locale, `/admin/clients/${detail.client.id}`)}
                  className="text-kitch-accent hover:underline"
                >
                  {isEs
                    ? "Abrir ficha completa (usuarios y restaurantes)"
                    : "Open full file (users and restaurants)"}
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
