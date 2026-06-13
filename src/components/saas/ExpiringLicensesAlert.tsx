import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getExpiringInstallations } from "@/services/saas/webhook-service";
import { formatSaasDate } from "@/lib/saas-dictionaries";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";

export async function ExpiringLicensesAlert({ locale }: { locale: Locale }) {
  const expiring = await getExpiringInstallations(30);
  if (expiring.length === 0) return null;

  const isEs = locale === "es";

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-400" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-amber-100">
            {isEs
              ? `${expiring.length} licencia(s) vencen en los próximos 30 días`
              : `${expiring.length} license(s) expiring within 30 days`}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-100/80">
            {expiring.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.restaurantName} — {item.clientName} —{" "}
                {formatSaasDate(item.license_expires_at, locale)}
                {item.clientEmail && (
                  <>
                    {" "}
                    ·{" "}
                    <a
                      href={`mailto:${item.clientEmail}`}
                      className="underline hover:text-white"
                    >
                      {item.clientEmail}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
          {expiring.length > 5 && (
            <p className="mt-2 text-xs text-amber-100/60">
              {isEs ? `+${expiring.length - 5} más` : `+${expiring.length - 5} more`}
            </p>
          )}
          <Link
            href={withLocale(locale, "/admin/licenses")}
            className="mt-3 inline-block text-sm font-medium text-amber-200 underline hover:text-white"
          >
            {isEs ? "Gestionar licencias →" : "Manage licenses →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
