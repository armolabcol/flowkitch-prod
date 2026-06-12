import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getServerSaasClient } from "@/services/saas/db";
import { isSupabaseConfigured, isHmacConfigured, env } from "@/lib/env";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminSettingsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);

  let dbStats = "—";
  if (isSupabaseConfigured()) {
    const supabase = await getServerSaasClient();
    if (supabase) {
      const [clients, installations] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase
          .from("plugin_installations")
          .select("*", { count: "exact", head: true }),
      ]);
      dbStats = `${clients.count ?? 0} clients / ${installations.count ?? 0} inst.`;
    }
  }

  const settings = [
    {
      label: "Supabase",
      value: isSupabaseConfigured()
        ? locale === "es"
          ? "Conectado"
          : "Connected"
        : locale === "es"
          ? "Pendiente"
          : "Pending",
    },
    {
      label: locale === "es" ? "Registros DB" : "DB records",
      value: dbStats,
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
            ? "Estado del entorno SaaS y conexión a Supabase."
            : "SaaS environment and Supabase connection status."
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
