"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Headphones,
  LayoutDashboard,
  Package,
  Shield,
} from "lucide-react";
import { KitchLogo } from "@/components/brand/KitchLogo";
import { SaasLocaleSwitcher } from "@/components/saas/SaasLocaleSwitcher";
import { SaasSignOutLink } from "@/components/saas/SaasSignOutLink";
import { cn } from "@/lib/cn";
import type { SaasDictionary } from "@/lib/saas-dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

const navItems = [
  { key: "overview", href: "/portal", icon: LayoutDashboard, exact: true },
  { key: "membership", href: "/portal/membership", icon: Shield },
  { key: "installation", href: "/portal/installation", icon: Package },
  { key: "billing", href: "/portal/billing", icon: CreditCard },
  { key: "support", href: "/portal/support", icon: Headphones },
] as const;

export function PortalShell({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: SaasDictionary;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const d = dictionary.portal;

  return (
    <div className="flex min-h-dvh flex-col bg-kitch-bg">
      <header className="border-b border-white/[0.06] bg-kitch-surface/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <KitchLogo locale={locale} />
          <div className="flex items-center gap-3">
            <SaasLocaleSwitcher locale={locale} />
            <SaasSignOutLink locale={locale} />
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {navItems.map((item) => {
            const href = withLocale(locale, item.href);
            const active =
              "exact" in item && item.exact
                ? pathname === href || pathname === `${href}/`
                : pathname.startsWith(href);
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-kitch-accent/15 text-white"
                    : "text-kitch-muted hover:bg-white/5 hover:text-kitch-fg",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {d.nav[item.key]}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
