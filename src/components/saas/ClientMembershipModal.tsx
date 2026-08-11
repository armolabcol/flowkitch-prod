"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  AddInstallationForm,
  AddRestaurantForm,
} from "@/components/saas/ClientDetailActions";
import { InstallationApiKeyActions } from "@/components/saas/InstallationApiKeyActions";
import { InstallationLicenseActions } from "@/components/saas/InstallationLicenseActions";
import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { formatMembershipAmount, paymentProviderLabel } from "@/lib/billing-utils";
import { daysUntil } from "@/lib/client-membership";
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
    restaurant_id: string;
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

function CopyableUrl({ url, locale }: { url: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const isEs = locale === "es";

  return (
    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="truncate font-mono text-xs text-kitch-accent hover:underline"
      >
        {url}
      </a>
      <button
        type="button"
        className="rounded-md px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-kitch-subtle hover:bg-white/5 hover:text-white"
        onClick={() => {
          void navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          });
        }}
      >
        {copied ? "OK" : isEs ? "Copiar" : "Copy"}
      </button>
    </div>
  );
}

export function ClientMembershipModal({
  clientId,
  locale,
  canManageLicense,
  canWrite,
  focusRestaurantId,
  onClose,
}: {
  clientId: string;
  locale: Locale;
  canManageLicense: boolean;
  canWrite: boolean;
  focusRestaurantId?: string | null;
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

  const focusedInstallation = focusRestaurantId
    ? detail?.installations.find(
        (installation) => installation.restaurant_id === focusRestaurantId,
      )
    : null;
  const operationalExpiresAt =
    focusedInstallation?.license_expires_at ??
    detail?.membership.expiresAt ??
    null;
  const days =
    focusedInstallation
      ? daysUntil(focusedInstallation.license_expires_at)
      : (detail?.membership.daysRemaining ?? null);
  const membershipStatus =
    (focusedInstallation?.license_status as LicenseStatus | undefined) ??
    detail?.membership.status;
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
              {isEs ? "Cuenta operativa" : "Operating account"}
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
                      status={membershipStatus ?? detail.membership.status}
                      label={
                        dict.licenseStatus[
                          membershipStatus ?? detail.membership.status
                        ] ?? detail.membership.status
                      }
                    />
                  </div>
                  <p className="mt-3 text-sm text-white">
                    {detail.membership.planName ?? (isEs ? "Sin plan" : "No plan")}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-kitch-subtle">
                    {isEs ? "Licencia / API" : "License / API"}
                  </p>
                  <p className={`mt-2 text-3xl font-semibold tracking-tight ${countdownTone}`}>
                    {countdownCopy(days, locale)}
                  </p>
                  <p className="mt-1 text-xs text-kitch-muted">
                    {operationalExpiresAt
                      ? formatSaasDate(operationalExpiresAt, locale)
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
                  {detail.membership.periodEnd ? (
                    <p className="mt-2 text-[11px] text-kitch-subtle">
                      {isEs ? "Periodo de facturación" : "Billing period"}:{" "}
                      {formatSaasDate(detail.membership.periodEnd, locale)}
                    </p>
                  ) : null}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-white">
                    {isEs ? "Restaurantes e instalaciones" : "Restaurants and installations"}
                  </h3>
                  {canWrite ? (
                    <AddRestaurantForm
                      clientId={detail.client.id}
                      country={detail.client.country}
                      locale={locale}
                      onDone={() => void load()}
                    />
                  ) : null}
                </div>

                {detail.restaurants.length === 0 ? (
                  <p className="text-sm text-kitch-muted">
                    {isEs ? "Sin restaurantes todavía." : "No restaurants yet."}
                  </p>
                ) : (
                  detail.restaurants.map((restaurant) => {
                    const restaurantInstallations = detail.installations.filter(
                      (installation) => installation.restaurant_id === restaurant.id,
                    );
                    const focused = focusRestaurantId === restaurant.id;

                    return (
                      <article
                        key={restaurant.id}
                        className={`rounded-2xl border p-4 ${
                          focused
                            ? "border-kitch-accent/50 bg-kitch-accent/5"
                            : "border-white/[0.06] bg-white/[0.02]"
                        }`}
                      >
                        <p className="text-sm font-medium text-white">
                          {restaurant.name}
                        </p>
                        <p className="text-xs text-kitch-muted">{restaurant.city}</p>

                        {restaurantInstallations.length === 0 ? (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-kitch-subtle">
                              {isEs
                                ? "Esta sede aún no tiene API / URL."
                                : "This venue does not have an API / URL yet."}
                            </p>
                            {canWrite ? (
                              <AddInstallationForm
                                restaurantId={restaurant.id}
                                locale={locale}
                                onDone={() => void load()}
                              />
                            ) : null}
                          </div>
                        ) : (
                          <div className="mt-3 space-y-3">
                            {restaurantInstallations.map((installation) => (
                              <div
                                key={installation.id}
                                className="rounded-xl border border-white/[0.06] p-3"
                              >
                                <p className="text-[11px] uppercase tracking-wider text-kitch-subtle">
                                  {isEs ? "Destino de la API" : "API destination"}
                                </p>
                                <CopyableUrl url={installation.site_url} locale={locale} />
                                <p className="mt-2 font-mono text-xs text-kitch-muted">
                                  API ••••{installation.api_key_last4}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <LicenseStatusBadge
                                    status={installation.license_status as LicenseStatus}
                                    label={
                                      dict.licenseStatus[
                                        installation.license_status as LicenseStatus
                                      ] ?? installation.license_status
                                    }
                                  />
                                  <span className="text-xs text-kitch-muted">
                                    {isEs ? "vence" : "expires"}{" "}
                                    {formatSaasDate(
                                      installation.license_expires_at,
                                      locale,
                                    )}
                                  </span>
                                </div>
                                {canManageLicense ? (
                                  <div className="mt-3 flex flex-wrap gap-3">
                                    <InstallationLicenseActions
                                      installationId={installation.id}
                                      currentStatus={
                                        installation.license_status as LicenseStatus
                                      }
                                      locale={locale}
                                      statusLabels={dict.licenseStatus}
                                      onDone={() => void load()}
                                    />
                                    <InstallationApiKeyActions
                                      installationId={installation.id}
                                      locale={locale}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            ))}
                            {canWrite ? (
                              <AddInstallationForm
                                restaurantId={restaurant.id}
                                locale={locale}
                                onDone={() => void load()}
                              />
                            ) : null}
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
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
                      {isEs ? "Pasarela" : "Gateway"}
                    </dt>
                    <dd className="text-kitch-muted">
                      {paymentProviderLabel(detail.client.payment_provider, locale)}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
