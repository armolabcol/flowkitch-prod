import {
  Activity,
  AlertTriangle,
  Building2,
  ShoppingBag,
  Users,
} from "lucide-react";
import { LicenseStatusBadge } from "@/components/saas/LicenseStatusBadge";
import { StatCard } from "@/components/saas/StatCard";
import { getAdminDashboardStats } from "@/data/saas-mock";
import {
  formatSaasCurrency,
  formatSaasDate,
  type SaasDictionary,
} from "@/lib/saas-dictionaries";
import type { Locale } from "@/lib/i18n";

export function AdminDashboard({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: SaasDictionary;
}) {
  const stats = getAdminDashboardStats();
  const d = dictionary.admin;

  const formatRevenue = (amount: number, country: string) => {
    const currency = country === "US" ? "USD" : "COP";
    return formatSaasCurrency(amount, currency, locale);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {d.nav.dashboard}
        </h2>
        <p className="mt-1 text-sm text-kitch-muted">{d.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label={d.stats.totalClients}
          value={stats.totalClients}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label={d.stats.activeInstallations}
          value={stats.activeInstallations}
          icon={<Building2 className="size-4" />}
        />
        <StatCard
          label={d.stats.expiringSoon}
          value={stats.expiringSoon}
          icon={<AlertTriangle className="size-4" />}
        />
        <StatCard
          label={d.stats.suspended}
          value={stats.suspendedInstallations}
          icon={<Activity className="size-4" />}
        />
        <StatCard
          label={d.stats.ordersMonth}
          value={stats.totalOrdersMonth.toLocaleString(
            locale === "es" ? "es-CO" : "en-US",
          )}
          icon={<ShoppingBag className="size-4" />}
        />
        <StatCard
          label={d.stats.revenueMonth}
          value={`${stats.totalRevenueMonth.toLocaleString(locale === "es" ? "es-CO" : "en-US")}+`}
          icon={<Activity className="size-4" />}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-kitch-surface/60">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h3 className="font-medium text-white">{d.nav.installations}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-kitch-subtle">
                <th className="px-5 py-3 font-medium">{d.table.restaurant}</th>
                <th className="px-5 py-3 font-medium">{d.table.country}</th>
                <th className="px-5 py-3 font-medium">{d.table.licenseStatus}</th>
                <th className="px-5 py-3 font-medium">{d.table.expiresAt}</th>
                <th className="px-5 py-3 font-medium">{d.table.pluginVersion}</th>
                <th className="px-5 py-3 font-medium">{d.table.lastSync}</th>
                <th className="px-5 py-3 font-medium">{d.table.ordersMonth}</th>
                <th className="px-5 py-3 font-medium">{d.table.revenueMonth}</th>
              </tr>
            </thead>
            <tbody>
              {stats.installations.map((inst) => (
                <tr
                  key={inst.id}
                  className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3.5 font-medium text-white">
                    {inst.restaurant.name}
                  </td>
                  <td className="px-5 py-3.5 text-kitch-muted">
                    {dictionary.countries[inst.restaurant.country] ??
                      inst.restaurant.country}
                  </td>
                  <td className="px-5 py-3.5">
                    <LicenseStatusBadge
                      status={inst.license_status}
                      label={dictionary.licenseStatus[inst.license_status]}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-kitch-muted">
                    {formatSaasDate(inst.license_expires_at, locale)}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-kitch-muted">
                    v{inst.plugin_version}
                  </td>
                  <td className="px-5 py-3.5 text-kitch-muted">
                    {formatSaasDate(inst.last_sync_at, locale)}
                  </td>
                  <td className="px-5 py-3.5 text-kitch-muted">
                    {inst.orders_month.toLocaleString(
                      locale === "es" ? "es-CO" : "en-US",
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-kitch-muted">
                    {formatRevenue(inst.revenue_month, inst.restaurant.country)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
