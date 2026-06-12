"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/cn";
import { withLocale, type Locale } from "@/lib/i18n";

async function parseApiResponse(res: Response) {
  const text = await res.text();
  if (!text) return { error: `HTTP ${res.status}` };
  try {
    return JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    return { error: text.slice(0, 200) };
  }
}

export function SaasResetPasswordForm({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary.portal;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/[0.12] bg-kitch-bg/90 px-3.5 py-3 text-sm text-kitch-fg outline-none transition-colors placeholder:text-kitch-subtle/80 focus:border-kitch-accent/55 focus:ring-1 focus:ring-kitch-accent/25";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    if (password !== confirm) {
      setError(d.passwordMismatch);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });

      const payload = await parseApiResponse(res);

      if (!res.ok || !payload.ok) {
        setError(payload.error ?? d.resetFailed);
        setLoading(false);
        return;
      }

      window.location.assign(withLocale(locale, "/portal/login"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : locale === "es" ? "Error de conexión" : "Connection error",
      );
      setLoading(false);
    }
  }

  function PasswordField({
    id,
    name,
    label,
    show,
    onToggle,
  }: {
    id: string;
    name: string;
    label: string;
    show: boolean;
    onToggle: () => void;
  }) {
    return (
      <div>
        <label
          className="text-xs font-semibold uppercase tracking-wide text-kitch-subtle"
          htmlFor={id}
        >
          {label}
          <span className="text-kitch-accent"> *</span>
        </label>
        <div className="relative mt-2">
          <input
            id={id}
            name={name}
            type={show ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            className={cn(inputClass, "mt-0 pr-11")}
          />
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-kitch-subtle hover:text-kitch-fg"
            aria-label={show ? d.hidePassword : d.showPassword}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative mx-auto max-w-md space-y-5 rounded-[1.3rem] border border-white/[0.08] bg-kitch-elevated/95 p-8">
      <p className="text-center text-sm text-kitch-muted">{d.resetPasswordHint}</p>

      <PasswordField
        id="new-password"
        name="password"
        label={d.newPassword}
        show={showPassword}
        onToggle={() => setShowPassword((v) => !v)}
      />
      <PasswordField
        id="confirm-password"
        name="confirm"
        label={d.confirmPassword}
        show={showConfirm}
        onToggle={() => setShowConfirm((v) => !v)}
      />

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-xs text-red-200" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={loading} className="w-full" size="lg">
        {loading ? d.updatingPassword : d.updatePassword}
      </Button>
    </form>
  );
}
