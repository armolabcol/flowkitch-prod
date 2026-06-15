import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getExpiringInstallations } from "@/services/saas/webhook-service";
import { listClients } from "@/services/saas/admin-service";
import type { StaffScope } from "@/lib/auth/permissions";
import { formatSaasDate } from "@/lib/saas-dictionaries";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";

export async function ExpiringLicensesAlert({
  locale,
  scope,
}: {
  locale: Locale;
  scope: StaffScope;
}) {
  const [expiring, clients] = await Promise.all([
    getExpiringInstallations(30),
    listClients(scope),
  ]);
  const emails = new Set(clients.map((c) => c.email.toLowerCase()));
  const filtered = expiring.filter((e) =>
    emails.has(e.clientEmail.toLowerCase()),
  );

  if (filtered.length === 0) return null;

  const isEs = locale === "es";

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-amber-100">
            {isEs
              ? `${filtered.length} licencia(s) vencen en los próximos 30 días`
              : `${filtered.length} license(s) expiring within 30 days`}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-100/80">
            {filtered.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.restaurantName} — {item.clientName} —{" "}
                {formatSaasDate(item.license_expires_at, locale)}
              </li>
            ))}
          </ul>
          <Link
            href={withLocale(locale, "/admin/licenses")}
            className="mt-3 inline-block text-sm text-amber-200 underline hover:text-white"
          >
            {isEs ? "Ver licencias" : "View licenses"}
          </Link>
        </div>
      </div>
    </div>
  );
}
