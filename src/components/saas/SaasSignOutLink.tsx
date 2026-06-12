"use client";

import { isSupabaseConfigured } from "@/lib/env";
import { withLocale, type Locale } from "@/lib/i18n";

export function SaasSignOutLink({ locale }: { locale: Locale }) {
  async function handleSignOut() {
    if (isSupabaseConfigured()) {
      await fetch("/api/auth/signout", { method: "POST" });
    }
    window.location.href = withLocale(locale, "/portal/login");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-xs text-kitch-subtle hover:text-kitch-fg"
    >
      {locale === "es" ? "Cerrar sesión" : "Sign out"}
    </button>
  );
}
