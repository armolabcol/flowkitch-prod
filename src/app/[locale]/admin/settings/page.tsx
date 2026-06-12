import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { isSupabaseConfigured, isHmacConfigured, env } from "@/lib/env";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminSettingsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);

  const settings = [
    {
      label: "Supabase",
      value: isSupabaseConfigured()
        ? locale === "es"
          ? "Configurado"
          : "Configured"
        : locale === "es"
          ? "Pendiente"
          : "Pending",
    },
    {
      label: "HMAC",
      value: isHmacConfigured()
        ? locale === "es"
          ? "Configurado"
          : "Configured"
        : locale === "es"
          ? "Pendiente"
          : "Pending",
    },
    {
      label: "Site URL",
      value: env.siteUrl,
    },
  ];

  return (
    <>
      <SaasPageHeader
        title={dict.admin.nav.settings}
        description={
          locale === "es"
            ? "Configuración del entorno SaaS (mock en esta fase)."
            : "SaaS environment settings (mock in this phase)."
        }
      />
      <div className="space-y-3">
        {settings.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-kitch-surface/60 px-5 py-4"
          >
            <span className="text-sm text-kitch-muted">{s.label}</span>
            <span className="font-mono text-sm text-white">{s.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}
