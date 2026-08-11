"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClientMembershipModal } from "@/components/saas/ClientMembershipModal";
import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import type { OperationHubRow } from "@/types/saas";
import type { Locale } from "@/lib/i18n";

function renewalLabel(days: number | null, locale: Locale) {
  if (days === null) return "—";
  if (days < 0) {
    return locale === "es" ? "Vencida" : "Expired";
  }
  if (days === 0) {
    return locale === "es" ? "Hoy" : "Today";
  }
  return locale === "es"
    ? `${days} día${days === 1 ? "" : "s"}`
    : `${days} day${days === 1 ? "" : "s"}`;
}

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function SiteUrlCell({
  url,
  locale,
}: {
  url: string | null;
  locale: Locale;
}) {
  const isEs = locale === "es";
  const [copied, setCopied] = useState(false);

  if (!url) {
    return (
      <span className="text-xs text-kitch-subtle">
        {isEs ? "Sin API" : "No API"}
      </span>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="truncate font-mono text-xs text-kitch-accent hover:underline"
        title={url}
      >
        {displayUrl(url)}
      </a>
      <button
        type="button"
        className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-kitch-subtle hover:bg-white/5 hover:text-white"
        onClick={(event) => {
          event.stopPropagation();
          void navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          });
        }}
      >
        {copied ? (isEs ? "OK" : "OK") : isEs ? "Copiar" : "Copy"}
      </button>
    </div>
  );
}

export function AdminClientHub({
  rows,
  locale,
  canManageLicense,
  canWrite,
  initialClientId,
}: {
  rows: OperationHubRow[];
  locale: Locale;
  canManageLicense: boolean;
  canWrite: boolean;
  initialClientId?: string;
}) {
  const dict = getSaasDictionary(locale);
  const isEs = locale === "es";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState(
    initialClientId || searchParams.get("client") || null,
  );
  const [focusRestaurantId, setFocusRestaurantId] = useState(
    searchParams.get("restaurant"),
  );

  useEffect(() => {
    setActiveId(searchParams.get("client"));
    setFocusRestaurantId(searchParams.get("restaurant"));
  }, [searchParams]);

  const openClient = useCallback(
    (clientId: string, restaurantId?: string) => {
      setActiveId(clientId);
      setFocusRestaurantId(restaurantId ?? null);
      const query = restaurantId
        ? `?client=${clientId}&restaurant=${restaurantId}`
        : `?client=${clientId}`;
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router],
  );

  const closeClient = useCallback(() => {
    setActiveId(null);
    setFocusRestaurantId(null);
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-kitch-surface/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-kitch-subtle">
                <th className="px-5 py-3 font-medium">
                  {isEs ? "Restaurante" : "Restaurant"}
                </th>
                <th className="px-5 py-3 font-medium">
                  {isEs ? "Cliente" : "Client"}
                </th>
                <th className="px-5 py-3 font-medium">
                  {isEs ? "URL / API" : "URL / API"}
                </th>
                <th className="px-5 py-3 font-medium">
                  {isEs ? "Membresía" : "Membership"}
                </th>
                <th className="px-5 py-3 font-medium">
                  {isEs ? "Renovación" : "Renewal"}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-kitch-muted">
                    {isEs
                      ? "No hay restaurantes todavía."
                      : "No restaurants yet."}
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const days = row.daysRemaining;
                  const renewalTone =
                    days === null
                      ? "text-kitch-muted"
                      : days <= 0
                        ? "text-red-300"
                        : days <= 30
                          ? "text-amber-200"
                          : "text-kitch-muted";

                  return (
                    <tr
                      key={`${row.restaurantId}-${row.installationId ?? "none"}`}
                      className="cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.04]"
                      onClick={() => openClient(row.clientId, row.restaurantId)}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-white">
                          {row.restaurantName}
                        </p>
                        <p className="text-xs text-kitch-muted">
                          {row.city} · {dict.countries[row.country] ?? row.country}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-white">{row.clientName}</p>
                        <p className="text-xs text-kitch-muted">
                          {row.clientEmail}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <SiteUrlCell url={row.siteUrl} locale={locale} />
                        {row.apiKeyLast4 ? (
                          <p className="mt-1 font-mono text-[10px] text-kitch-subtle">
                            API ••••{row.apiKeyLast4}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5">
                        <LicenseStatusBadge
                          status={row.membershipStatus}
                          label={
                            !row.siteUrl
                              ? isEs
                                ? "Sin API"
                                : "No API"
                              : (dict.licenseStatus[row.membershipStatus] ??
                                row.membershipStatus)
                          }
                        />
                        {row.planName ? (
                          <p className="mt-1 text-xs text-kitch-subtle">
                            {row.planName}
                          </p>
                        ) : null}
                      </td>
                      <td className={`px-5 py-3.5 font-medium ${renewalTone}`}>
                        <p>{renewalLabel(days, locale)}</p>
                        <p className="text-xs font-normal text-kitch-subtle">
                          {formatSaasDate(row.expiresAt, locale)}
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeId ? (
        <ClientMembershipModal
          clientId={activeId}
          locale={locale}
          canManageLicense={canManageLicense}
          canWrite={canWrite}
          focusRestaurantId={focusRestaurantId}
          onClose={closeClient}
        />
      ) : null}
    </>
  );
}
