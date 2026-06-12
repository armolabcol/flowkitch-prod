"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/cn";
import { withLocale, type Locale } from "@/lib/i18n";

type Mode = "login" | "forgot";

type ApiPayload = {
  ok?: boolean;
  error?: string;
  code?: string;
  redirect?: "admin" | "portal";
};

async function parseApiResponse(res: Response): Promise<ApiPayload> {
  const text = await res.text();
  if (!text) {
    return { error: `HTTP ${res.status}`, code: "empty_response" };
  }
  try {
    return JSON.parse(text) as ApiPayload;
  } catch {
    return { error: text.slice(0, 200) || `HTTP ${res.status}`, code: "parse_error" };
  }
}

function mapSignInError(
  code: string | undefined,
  message: string,
  locale: Locale,
): string {
  if (code === "profile_missing") {
    return locale === "es"
      ? "Tu perfil no está vinculado. Contacta a soporte ARMO."
      : "Your profile is not linked. Contact ARMO support.";
  }
  if (code === "profile_error") {
    return locale === "es"
      ? `Error al leer tu perfil: ${message}`
      : `Profile read error: ${message}`;
  }
  if (code === "email_not_confirmed" || message.toLowerCase().includes("confirm")) {
    return locale === "es"
      ? "Confirma tu email en Supabase Auth antes de ingresar."
      : "Confirm your email before signing in.";
  }
  if (
    code === "invalid_credentials" ||
    message.toLowerCase().includes("invalid login credentials")
  ) {
    return locale === "es"
      ? "Email o contraseña incorrectos."
      : "Incorrect email or password.";
  }
  if (code === "config") {
    return locale === "es"
      ? "Autenticación no configurada en el servidor."
      : "Authentication not configured on server.";
  }
  return message || (locale === "es" ? "No se pudo iniciar sesión." : "Sign in failed.");
}

export function SaasLoginForm({
  locale,
  dictionary,
  initialError,
}: {
  locale: Locale;
  dictionary: Dictionary;
  initialError?: string;
}) {
  const d = dictionary.portal;
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/[0.12] bg-kitch-bg/90 px-3.5 py-3 text-sm text-kitch-fg outline-none transition-colors placeholder:text-kitch-subtle/80 focus:border-kitch-accent/55 focus:ring-1 focus:ring-kitch-accent/25";

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const payload = await parseApiResponse(res);

      if (!res.ok || !payload.ok) {
        setError(mapSignInError(payload.code, payload.error ?? "", locale));
        setLoading(false);
        return;
      }

      const target =
        payload.redirect === "admin"
          ? withLocale(locale, "/admin")
          : withLocale(locale, "/portal");

      window.location.assign(target);
    } catch (err) {
      setError(
        locale === "es"
          ? `Error de conexión: ${err instanceof Error ? err.message : "desconocido"}`
          : `Connection error: ${err instanceof Error ? err.message : "unknown"}`,
      );
      setLoading(false);
    }
  }

  async function onForgot(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email }),
      });

      const payload = await parseApiResponse(res);

      if (!res.ok) {
        setError(payload.error ?? (locale === "es" ? "Error al enviar." : "Send failed."));
        setLoading(false);
        return;
      }

      setSuccess(d.resetEmailSent);
      setLoading(false);
    } catch (err) {
      setError(
        locale === "es"
          ? `Error de conexión: ${err instanceof Error ? err.message : "desconocido"}`
          : `Connection error: ${err instanceof Error ? err.message : "unknown"}`,
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
      <div className="relative space-y-5 rounded-[1.3rem] border border-white/[0.08] bg-kitch-elevated/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-kitch-accent/30 bg-kitch-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-kitch-accent">
            {mode === "login" ? d.accessLabel : d.forgotPasswordTitle}
          </span>
        </div>

        {mode === "login" ? (
          <form onSubmit={onLogin} className="space-y-5">
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wide text-kitch-subtle"
                htmlFor="saas-email"
              >
                {d.email}
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
              <div className="flex items-center justify-between gap-2">
                <label
                  className="text-xs font-semibold uppercase tracking-wide text-kitch-subtle"
                  htmlFor="saas-password"
                >
                  {d.password}
                  <span className="text-kitch-accent"> *</span>
                </label>
                <button
                  type="button"
                  className="text-xs text-kitch-accent hover:underline"
                  onClick={() => {
                    setMode("forgot");
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  {d.forgotPassword}
                </button>
              </div>
              <div className="relative mt-2">
                <input
                  id="saas-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className={cn(inputClass, "mt-0 pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kitch-subtle hover:text-kitch-fg"
                  aria-label={showPassword ? d.hidePassword : d.showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-xs text-red-200" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full font-semibold shadow-[0_0_28px_rgba(230,57,70,0.22)] ring-1 ring-white/10"
              size="lg"
            >
              {loading ? d.signingIn : d.login}
            </Button>
          </form>
        ) : (
          <form onSubmit={onForgot} className="space-y-5">
            <p className="text-center text-xs text-kitch-muted">{d.forgotPasswordHint}</p>
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-wide text-kitch-subtle"
                htmlFor="forgot-email"
              >
                {d.email}
                <span className="text-kitch-accent"> *</span>
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-xs text-red-200" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-xs text-emerald-200" role="status">
                {success}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={loading} className="w-full" size="lg">
              {loading ? d.sending : d.sendResetLink}
            </Button>
            <button
              type="button"
              className="w-full text-center text-xs text-kitch-muted hover:text-kitch-fg"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccess(null);
              }}
            >
              {d.backToLogin}
            </button>
          </form>
        )}

        {mode === "login" && (
          <p className="text-center text-xs leading-relaxed text-kitch-subtle">{d.notice}</p>
        )}
      </div>
    </div>
  );
}
