"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  KeyRound,
  LayoutDashboard,
  Mail,
  Settings,
  Store,
  Wrench,
  Users,
} from "lucide-react";
import { KitchLogo } from "@/components/brand/KitchLogo";
import { SaasLocaleSwitcher } from "@/components/saas/SaasLocaleSwitcher";
import { cn } from "@/lib/cn";
import type { SaasDictionary } from "@/lib/saas-dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

const navItems = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { key: "clients", href: "/admin/clients", icon: Users },
  { key: "restaurants", href: "/admin/restaurants", icon: Store },
  { key: "installations", href: "/admin/installations", icon: Building2 },
  { key: "licenses", href: "/admin/licenses", icon: KeyRound },
  { key: "leads", href: "/admin/leads", icon: Mail },
  { key: "maintenance", href: "/admin/maintenance", icon: Wrench },
  { key: "settings", href: "/admin/settings", icon: Settings },
] as const;

export function AdminShell({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: SaasDictionary;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const d = dictionary.admin;

  return (
    <div className="flex min-h-dvh bg-kitch-bg">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-kitch-surface/50 lg:flex">
        <div className="border-b border-white/[0.06] px-5 py-5">
          <KitchLogo locale={locale} />
          <p className="mt-2 text-xs text-kitch-subtle">{d.subtitle}</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-kitch-accent/15 text-white"
                    : "text-kitch-muted hover:bg-white/5 hover:text-kitch-fg",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {d.nav[item.key]}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/[0.06] p-4">
          <span className="inline-flex rounded-full border border-kitch-accent/25 bg-kitch-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-kitch-accent">
            ARMO Admin
          </span>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] bg-kitch-surface/30 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="lg:hidden">
            <KitchLogo locale={locale} />
          </div>
          <h1 className="hidden text-sm font-medium text-kitch-muted lg:block">
            {d.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-white/10 bg-kitch-elevated px-2.5 py-1 text-[10px] uppercase tracking-wider text-kitch-subtle sm:inline-flex">
              {d.mockBadge}
            </span>
            <SaasLocaleSwitcher locale={locale} />
          </div>
        </header>

        <div className="border-b border-white/[0.06] bg-kitch-bg/80 px-4 py-2 lg:hidden">
          <nav className="flex gap-1 overflow-x-auto pb-1 text-xs">
            {navItems.map((item) => {
              const href = withLocale(locale, item.href);
              const active =
                "exact" in item && item.exact
                  ? pathname === href
                  : pathname.startsWith(href);
              return (
                <Link
                  key={item.key}
                  href={href}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5",
                    active
                      ? "bg-kitch-accent/15 text-white"
                      : "text-kitch-muted",
                  )}
                >
                  {d.nav[item.key]}
                </Link>
              );
            })}
          </nav>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
