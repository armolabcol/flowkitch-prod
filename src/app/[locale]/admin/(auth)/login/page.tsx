import type { Metadata } from "next";
import { SaasLoginForm } from "@/components/forms/SaasLoginForm";
import { Container } from "@/components/ui/Container";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  return {
    title: `${dict.admin.title} — Login | Kitch`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminLoginPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-kitch-bg px-4 py-16">
      <Container className="max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold text-white">{dict.admin.title}</h1>
          <p className="mt-2 text-sm text-kitch-muted">{dict.admin.subtitle}</p>
        </div>
        <SaasLoginForm
          locale={locale}
          audience="admin"
          badgeLabel="ARMO Admin"
          emailLabel={locale === "es" ? "Correo corporativo" : "Work email"}
          passwordLabel={locale === "es" ? "Contraseña" : "Password"}
          submitLabel={locale === "es" ? "Ingresar al admin" : "Sign in to admin"}
          notice={
            locale === "es"
              ? "Acceso restringido al equipo ARMO."
              : "Restricted to ARMO team members."
          }
          mockNotice={
            locale === "es"
              ? "Modo mock: sin Supabase configurado, el acceso es abierto."
              : "Mock mode: Supabase not configured, access is open."
          }
        />
      </Container>
    </div>
  );
}
