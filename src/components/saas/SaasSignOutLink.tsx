"use client";

import { useState } from "react";
import { withLocale, type Locale } from "@/lib/i18n";

export function SaasSignOutLink({ locale }: { locale: Locale }) {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    if (loading) return;
    setLoading(true);

    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // Still navigate — user expects to leave the session UI
    }

    window.location.assign(withLocale(locale, "/portal/login"));
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={loading}
      className="text-xs text-kitch-subtle hover:text-kitch-fg disabled:opacity-50"
    >
      {loading
        ? locale === "es"
          ? "Saliendo…"
          : "Signing out…"
        : locale === "es"
          ? "Cerrar sesión"
          : "Sign out"}
    </button>
  );
}
