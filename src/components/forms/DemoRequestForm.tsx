"use client";

import { useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/cn";

type DemoRequestFormProps = {
  dictionary: Dictionary;
};

type FormState = "idle" | "submitting" | "done";

type FieldErrors = Partial<
  Record<"name" | "restaurant" | "country" | "city" | "email" | "whatsapp" | "tables" | "uses_pos", string>
>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8;
}

export function DemoRequestForm({ dictionary }: DemoRequestFormProps) {
  const d = dictionary.demoPage;
  const err = d.errors;
  const [status, setStatus] = useState<FormState>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submitLockRef = useRef(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting" || status === "done" || submitLockRef.current) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const next: FieldErrors = {};

    const name = String(data.get("name") ?? "").trim();
    const restaurant = String(data.get("restaurant") ?? "").trim();
    const country = String(data.get("country") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const whatsapp = String(data.get("whatsapp") ?? "").trim();
    const tablesRaw = String(data.get("tables") ?? "").trim();
    const usesPos = String(data.get("uses_pos") ?? "");
    if (!name) next.name = err.required;
    if (!restaurant) next.restaurant = err.required;
    if (!country) next.country = err.required;
    if (!city) next.city = err.required;
    if (!email) next.email = err.required;
    else if (!isValidEmail(email)) next.email = err.email;
    if (whatsapp && !isValidWhatsapp(whatsapp)) next.whatsapp = err.whatsapp;
    if (!usesPos) next.uses_pos = err.pos;
    if (tablesRaw) {
      const n = Number(tablesRaw);
      if (!Number.isFinite(n) || n < 1) next.tables = err.tablesMin;
    }

    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    submitLockRef.current = true;
    const payload = Object.fromEntries(data.entries());
    setStatus("submitting");
    console.log("[Kitch demo] form payload (integración futura):", payload);
    setTimeout(() => setStatus("done"), 450);
  }

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-kitch-border bg-kitch-bg/80 px-3 py-2.5 text-sm text-kitch-fg outline-none transition-colors placeholder:text-kitch-subtle focus:border-kitch-accent/50";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-3xl border border-kitch-border bg-kitch-elevated/40 p-6 sm:grid-cols-2 sm:p-8"
      noValidate
    >
      <Field
        label={d.fields.name}
        name="name"
        required
        className={cn(fieldClass, fieldErrors.name && "border-red-400/40")}
        error={fieldErrors.name}
        onChange={() => setFieldErrors((p) => ({ ...p, name: undefined }))}
      />
      <Field
        label={d.fields.restaurant}
        name="restaurant"
        required
        className={cn(fieldClass, fieldErrors.restaurant && "border-red-400/40")}
        error={fieldErrors.restaurant}
        onChange={() => setFieldErrors((p) => ({ ...p, restaurant: undefined }))}
      />
      <Field
        label={d.fields.country}
        name="country"
        required
        className={cn(fieldClass, fieldErrors.country && "border-red-400/40")}
        error={fieldErrors.country}
        onChange={() => setFieldErrors((p) => ({ ...p, country: undefined }))}
      />
      <Field
        label={d.fields.city}
        name="city"
        required
        className={cn(fieldClass, fieldErrors.city && "border-red-400/40")}
        error={fieldErrors.city}
        onChange={() => setFieldErrors((p) => ({ ...p, city: undefined }))}
      />
      <Field
        label={d.fields.whatsapp}
        name="whatsapp"
        type="tel"
        autoComplete="tel"
        className={cn(fieldClass, fieldErrors.whatsapp && "border-red-400/40")}
        error={fieldErrors.whatsapp}
        onChange={() => setFieldErrors((p) => ({ ...p, whatsapp: undefined }))}
      />
      <Field
        label={d.fields.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        className={cn(fieldClass, fieldErrors.email && "border-red-400/40")}
        error={fieldErrors.email}
        onChange={() => setFieldErrors((p) => ({ ...p, email: undefined }))}
      />
      <Field
        label={d.fields.tables}
        name="tables"
        type="number"
        min={1}
        inputMode="numeric"
        className={cn(fieldClass, fieldErrors.tables && "border-red-400/40")}
        error={fieldErrors.tables}
        onChange={() => setFieldErrors((p) => ({ ...p, tables: undefined }))}
      />
      <div className="sm:col-span-2">
        <label className="text-xs font-medium uppercase tracking-wide text-kitch-subtle">
          {d.fields.pos}
        </label>
        <select
          name="uses_pos"
          className={cn(fieldClass, fieldErrors.uses_pos && "border-red-400/40")}
          defaultValue=""
          onChange={() => setFieldErrors((p) => ({ ...p, uses_pos: undefined }))}
        >
          <option value="" disabled>
            —
          </option>
          <option value="yes">{d.posOptions.yes}</option>
          <option value="no">{d.posOptions.no}</option>
          <option value="evaluating">{d.posOptions.evaluating}</option>
        </select>
        {fieldErrors.uses_pos ? (
          <p className="mt-1 text-xs text-red-300/90">{fieldErrors.uses_pos}</p>
        ) : null}
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-medium uppercase tracking-wide text-kitch-subtle">
          {d.fields.improve}
        </label>
        <textarea name="improve" rows={4} className={`${fieldClass} resize-y`} />
      </div>

      <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-kitch-subtle">{d.extra}</p>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-semibold sm:w-auto"
            disabled={status === "submitting" || status === "done"}
            aria-busy={status === "submitting"}
          >
            {status === "submitting"
              ? d.submitting
              : status === "done"
                ? d.successTitle
                : d.submit}
          </Button>
          <p className="text-center text-[11px] text-kitch-subtle sm:text-right">{d.noCommitment}</p>
        </div>
      </div>

      {status === "done" && (
        <output
          className="sm:col-span-2 rounded-2xl border border-kitch-accent/25 bg-kitch-accent/10 px-4 py-3 text-sm text-kitch-muted"
          aria-live="polite"
        >
          <strong className="text-kitch-fg">{d.successTitle}</strong> — {d.successBody}
        </output>
      )}
    </form>
  );
}

function Field({
  label,
  className,
  error,
  ...inputProps
}: {
  label: string;
  className: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-kitch-subtle">
        {label}
        {inputProps.required ? <span className="text-kitch-accent"> *</span> : null}
      </label>
      <input className={className} {...inputProps} />
      {error ? <p className="mt-1 text-xs text-red-300/90">{error}</p> : null}
    </div>
  );
}
