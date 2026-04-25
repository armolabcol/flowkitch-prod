"use client";

import { type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/dictionaries";

export function PortalLoginPlaceholder({
  dictionary,
}: {
  dictionary: Dictionary;
}) {
  const d = dictionary.portal;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log("[Kitch portal] login placeholder — sin auth:", Object.fromEntries(data));
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-kitch-border bg-kitch-bg/80 px-3 py-2.5 text-sm text-kitch-fg outline-none focus:border-kitch-accent/50";

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-md space-y-4 rounded-3xl border border-kitch-border bg-kitch-elevated/50 p-8"
    >
      <div>
        <label className="text-xs font-medium text-kitch-subtle" htmlFor="portal-email">
          {d.email}
        </label>
        <input
          id="portal-email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-kitch-subtle" htmlFor="portal-password">
          {d.password}
        </label>
        <input
          id="portal-password"
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      <Button type="submit" variant="primary" className="w-full" size="lg">
        {d.login}
      </Button>
      <p className="text-center text-xs leading-relaxed text-kitch-subtle">{d.notice}</p>
    </form>
  );
}
