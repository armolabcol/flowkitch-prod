"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { defaultLocale, locales, stripLocaleFromPathname, withLocale, type Locale } from "@/lib/i18n";

export function SaasLocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const basePath = stripLocaleFromPathname(pathname);

  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-kitch-elevated p-0.5 text-xs">
      {locales.map((l) => (
        <Link
          key={l}
          href={withLocale(l, basePath || "/")}
          className={cn(
            "rounded-md px-2.5 py-1 font-medium uppercase transition-colors",
            l === locale
              ? "bg-kitch-accent/20 text-white"
              : "text-kitch-subtle hover:text-kitch-fg",
          )}
          aria-current={l === locale ? "true" : undefined}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

/** Read locale from pathname for SaaS pages under /[locale]/admin|portal */
export function saasLocaleFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first === "es" || first === "en") return first;
  return defaultLocale;
}
