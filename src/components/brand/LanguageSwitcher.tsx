"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocaleFromPathname, withLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const options: { code: Locale; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() ?? "/";
  const pathWithoutLocale = stripLocaleFromPathname(pathname);

  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-kitch-border bg-kitch-surface/80 p-0.5 backdrop-blur",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {options.map(({ code, label }) => {
        const href = withLocale(code, pathWithoutLocale);
        const active =
          pathname === `/${code}` ||
          pathname.startsWith(`/${code}/`);

        return (
          <Link
            key={code}
            href={href}
            className={cn(
              "min-w-[2.5rem] rounded-full px-2.5 py-1 text-center text-xs font-semibold transition-colors",
              active
                ? "bg-kitch-accent text-white"
                : "text-kitch-muted hover:text-kitch-fg",
            )}
            hrefLang={code}
            aria-label={code === "es" ? "Español" : "English"}
            aria-current={active ? "true" : undefined}
            prefetch
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
