"use client";

import { type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/cn";

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
    "mt-2 w-full rounded-xl border border-white/[0.12] bg-kitch-bg/90 px-3.5 py-3 text-sm text-kitch-fg outline-none transition-colors placeholder:text-kitch-subtle/80 focus:border-kitch-accent/55 focus:ring-1 focus:ring-kitch-accent/25";

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
            {d.clientsOnly}
          </span>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-kitch-subtle" htmlFor="portal-email">
            {d.email}
            <span className="text-kitch-accent"> *</span>
          </label>
          <input
            id="portal-email"
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
            htmlFor="portal-password"
          >
            {d.password}
            <span className="text-kitch-accent"> *</span>
          </label>
          <input
            id="portal-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className={cn(
            "w-full font-semibold shadow-[0_0_28px_rgba(230,57,70,0.22)] ring-1 ring-white/10",
          )}
          size="lg"
        >
          {d.login}
        </Button>
        <p className="text-center text-xs leading-relaxed text-kitch-subtle">{d.notice}</p>
      </form>
    </div>
  );
}
