"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClientMembershipModal } from "@/components/saas/ClientMembershipModal";
import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { formatSaasDate, getSaasDictionary } from "@/lib/saas-dictionaries";
import type { ClientListItem } from "@/types/saas";
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

export function AdminClientHub({
  clients,
  locale,
  canManageLicense,
  initialClientId,
}: {
  clients: ClientListItem[];
  locale: Locale;
  canManageLicense: boolean;
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

  useEffect(() => {
    const fromUrl = searchParams.get("client");
    setActiveId(fromUrl);
  }, [searchParams]);

  const openClient = useCallback(
    (id: string) => {
      setActiveId(id);
      router.replace(`${pathname}?client=${id}`, { scroll: false });
    },
    [pathname, router],
  );

  const closeClient = useCallback(() => {
    setActiveId(null);
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-kitch-surface/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-kitch-subtle">
                <th className="px-5 py-3 font-medium">
                  {isEs ? "Cliente" : "Client"}
                </th>
                <th className="px-5 py-3 font-medium">{dict.admin.table.country}</th>
                <th className="px-5 py-3 font-medium">
                  {isEs ? "Membresía" : "Membership"}
                </th>
                <th className="px-5 py-3 font-medium">{dict.admin.table.expiresAt}</th>
                <th className="px-5 py-3 font-medium">
                  {isEs ? "Renovación" : "Renewal"}
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-kitch-muted">
                    {isEs ? "No hay clientes todavía." : "No clients yet."}
                  </td>
                </tr>
              ) : (
                clients.map((client) => {
                  const days = client.daysRemaining;
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
                      key={client.id}
                      className="cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.04]"
                      onClick={() => openClient(client.id)}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-xs text-kitch-muted">{client.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-kitch-muted">
                        {dict.countries[client.country] ?? client.country}
                      </td>
                      <td className="px-5 py-3.5">
                        <LicenseStatusBadge
                          status={client.membershipStatus}
                          label={
                            client.installationCount === 0 && !client.planName
                              ? isEs
                                ? "Sin membresía"
                                : "No membership"
                              : (dict.licenseStatus[client.membershipStatus] ??
                                client.membershipStatus)
                          }
                        />
                        {client.planName ? (
                          <p className="mt-1 text-xs text-kitch-subtle">
                            {client.planName}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5 text-kitch-muted">
                        {formatSaasDate(client.expiresAt, locale)}
                      </td>
                      <td className={`px-5 py-3.5 font-medium ${renewalTone}`}>
                        {renewalLabel(days, locale)}
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
          onClose={closeClient}
        />
      ) : null}
    </>
  );
}
