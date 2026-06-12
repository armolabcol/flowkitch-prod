"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { isSupabaseConfigured } from "@/lib/env";
import { cn } from "@/lib/cn";
import { withLocale, type Locale } from "@/lib/i18n";

type SaasLoginFormProps = {
  locale: Locale;
  audience: "portal" | "admin";
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
  badgeLabel: string;
  notice: string;
  mockNotice: string;
};

function mapSignInError(
  code: string | undefined,
  message: string,
  locale: Locale,
): string {
  if (code === "profile_missing") {
    return locale === "es"
      ? "Tu perfil no está vinculado. Verifica que profiles.id = auth.users.id en Supabase."
      : "Your profile is not linked. Ensure profiles.id = auth.users.id in Supabase.";
  }
  if (code === "wrong_audience") {
    return locale === "es"
      ? "Esta cuenta no tiene acceso al panel admin."
      : "This account does not have admin access.";
  }
  if (code === "email_not_confirmed" || message.toLowerCase().includes("confirm")) {
    return locale === "es"
      ? "Confirma tu email en Supabase Auth antes de ingresar."
      : "Confirm your email in Supabase Auth before signing in.";
  }
  if (message.toLowerCase().includes("invalid login credentials")) {
    return locale === "es"
      ? "Email o contraseña incorrectos."
      : "Incorrect email or password.";
  }
  return message;
}

export function SaasLoginForm({
  locale,
  audience,
  emailLabel,
  passwordLabel,
  submitLabel,
  badgeLabel,
  notice,
  mockNotice,
}: SaasLoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authEnabled = isSupabaseConfigured();

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/[0.12] bg-kitch-bg/90 px-3.5 py-3 text-sm text-kitch-fg outline-none transition-colors placeholder:text-kitch-subtle/80 focus:border-kitch-accent/55 focus:ring-1 focus:ring-kitch-accent/25";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    if (!authEnabled) {
      window.location.href = withLocale(
        locale,
        audience === "admin" ? "/admin" : "/portal",
      );
      return;
    }

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, audience }),
      });

      const payload = (await res.json()) as {
        error?: string;
        code?: string;
        redirect?: "admin" | "portal";
      };

      if (!res.ok) {
        setError(
          mapSignInError(payload.code, payload.error ?? "Error", locale),
        );
        setLoading(false);
        return;
      }

      const target =
        payload.redirect === "admin"
          ? withLocale(locale, "/admin")
          : withLocale(locale, "/portal");

      window.location.href = target;
    } catch {
      setError(
        locale === "es"
          ? "Error de conexión. Intenta de nuevo."
          : "Connection error. Please try again.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-md">
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-gradient-to-br from-kitch-accent/35 via-white/[0.08] to-transparent opacity-80"
        aria-hidden
      />
      <form
        onSubmit={onSubmit}
        className="relative space-y-5 rounded-[1.3rem] border border-white/[0.08] bg-kitch-elevated/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md"
      >
        <div className="text-center">
          <span className="inline-flex rounded-full border border-kitch-accent/30 bg-kitch-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-kitch-accent">
            {badgeLabel}
          </span>
        </div>

        {!authEnabled && (
          <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-200">
            {mockNotice}
          </p>
        )}

        <div>
          <label
            className="text-xs font-semibold uppercase tracking-wide text-kitch-subtle"
            htmlFor="saas-email"
          >
            {emailLabel}
            <span className="text-kitch-accent"> *</span>
          </label>
          <input
            id="saas-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@restaurant.com"
            className={inputClass}
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold uppercase tracking-wide text-kitch-subtle"
            htmlFor="saas-password"
          >
            {passwordLabel}
            <span className="text-kitch-accent"> *</span>
          </label>
          <input
            id="saas-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-center text-xs text-red-300" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className={cn(
            "w-full font-semibold shadow-[0_0_28px_rgba(230,57,70,0.22)] ring-1 ring-white/10",
          )}
          size="lg"
        >
          {loading
            ? locale === "es"
              ? "Ingresando…"
              : "Signing in…"
            : submitLabel}
        </Button>
        <p className="text-center text-xs leading-relaxed text-kitch-subtle">
          {notice}
        </p>
      </form>
    </div>
  );
}
