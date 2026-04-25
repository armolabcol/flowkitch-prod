"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/dictionaries";

type DemoRequestFormProps = {
  dictionary: Dictionary;
};

type FormState = "idle" | "submitting" | "done";

export function DemoRequestForm({ dictionary }: DemoRequestFormProps) {
  const d = dictionary.demoPage;
  const [status, setStatus] = useState<FormState>("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    setStatus("submitting");
    // Fase 1: sin backend — listo para integrar POST /api/demo u otro servicio
    console.log("[Kitch demo] form payload (integración futura):", payload);
    setTimeout(() => setStatus("done"), 450);
  }

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-kitch-border bg-kitch-bg/80 px-3 py-2.5 text-sm text-kitch-fg outline-none transition-colors placeholder:text-kitch-subtle focus:border-kitch-accent/50";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-3xl border border-kitch-border bg-kitch-elevated/40 p-6 sm:grid-cols-2 sm:p-8"
    >
      <Field label={d.fields.name} name="name" required className={fieldClass} />
      <Field
        label={d.fields.restaurant}
        name="restaurant"
        required
        className={fieldClass}
      />
      <Field label={d.fields.country} name="country" required className={fieldClass} />
      <Field label={d.fields.city} name="city" required className={fieldClass} />
      <Field
        label={d.fields.whatsapp}
        name="whatsapp"
        type="tel"
        className={fieldClass}
      />
      <Field label={d.fields.email} name="email" type="email" required className={fieldClass} />
      <Field
        label={d.fields.tables}
        name="tables"
        type="number"
        min={1}
        className={fieldClass}
      />
      <div className="sm:col-span-2">
        <label className="text-xs font-medium uppercase tracking-wide text-kitch-subtle">
          {d.fields.pos}
        </label>
        <select name="uses_pos" className={fieldClass} defaultValue="">
          <option value="" disabled>
            —
          </option>
          <option value="yes">{d.posOptions.yes}</option>
          <option value="no">{d.posOptions.no}</option>
          <option value="evaluating">{d.posOptions.evaluating}</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-medium uppercase tracking-wide text-kitch-subtle">
          {d.fields.improve}
        </label>
        <textarea
          name="improve"
          rows={4}
          className={`${fieldClass} resize-y`}
          placeholder="…"
        />
      </div>

      <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-kitch-subtle">
          {/* reservado: endpoint, analytics, honeypot */}
          POST /api/demo — pendiente de integración
        </p>
        <div className="flex flex-col items-end gap-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={status === "submitting" || status === "done"}
          >
            {status === "submitting"
              ? d.submitting
              : status === "done"
                ? d.successTitle
                : d.submit}
          </Button>
          <p className="text-[11px] text-kitch-subtle">{d.noCommitment}</p>
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
  ...inputProps
}: {
  label: string;
  className: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-kitch-subtle">
        {label}
      </label>
      <input className={className} {...inputProps} />
    </div>
  );
}
