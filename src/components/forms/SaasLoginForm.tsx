"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { isAdminRole } from "@/lib/auth/roles";
import { cn } from "@/lib/cn";
import { withLocale, type Locale } from "@/lib/i18n";
import type { UserRole } from "@/types/saas";

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

  async function redirectByRole(role: UserRole | null) {
    if (role && isAdminRole(role)) {
      window.location.href = withLocale(locale, "/admin");
      return;
    }
    window.location.href = withLocale(locale, "/portal");
  }

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

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError("Supabase no configurado.");
      setLoading(false);
      return;
    }

    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !authData.user) {
      setError(
        locale === "es"
          ? "Credenciales inválidas o usuario no encontrado."
          : "Invalid credentials or user not found.",
      );
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle<{ role: string }>();

    const role = (profile?.role as UserRole | undefined) ?? null;

    if (!role) {
      setError(
        locale === "es"
          ? "Tu perfil aún no está configurado. Contacta a soporte ARMO."
          : "Your profile is not configured yet. Contact ARMO support.",
      );
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    await redirectByRole(role);
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
