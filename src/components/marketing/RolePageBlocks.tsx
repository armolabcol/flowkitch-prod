import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  type LucideIcon,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type InsightCardProps = {
  title: string;
  body: string;
  tone?: "default" | "accent";
};

export function InsightCard({ title, body, tone = "default" }: InsightCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 shadow-[0_18px_58px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-kitch-accent/35 hover:bg-kitch-elevated/70",
        tone === "accent"
          ? "border-kitch-accent/20 bg-gradient-to-br from-kitch-accent/[0.12] via-kitch-elevated/70 to-kitch-surface/45"
          : "border-white/[0.08] bg-gradient-to-b from-kitch-elevated/70 to-kitch-surface/45",
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-kitch-accent/[0.07] blur-3xl transition-opacity group-hover:opacity-100 sm:opacity-70"
        aria-hidden
      />
      <h3 className="relative text-base font-semibold text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-kitch-muted">{body}</p>
    </article>
  );
}

type RoleHeroProps = {
  locale: Locale;
  label: string;
  headline: string;
  lead: string;
  cta: string;
  proof: string[];
  children: React.ReactNode;
};

export function RoleHero({
  locale,
  label,
  headline,
  lead,
  cta,
  proof,
  children,
}: RoleHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] py-12 sm:py-16 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_55%_-20%,rgba(230,57,70,0.16),transparent_58%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_42%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-kitch-accent/45 to-transparent"
        aria-hidden
      />
      <Container className="relative grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-kitch-accent">
            {label}
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]">
            {headline}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
            {lead}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="min-h-[3.25rem] w-full font-semibold shadow-[0_0_44px_rgba(230,57,70,0.36)] ring-1 ring-white/15 sm:w-auto"
            >
              <Link href={withLocale(locale, "/demo")}>{cta}</Link>
            </Button>
            <p className="text-sm font-medium text-white/72">
              {locale === "es" ? "Demo personalizada. Sin compromiso." : "Personalized demo. No commitment."}
            </p>
          </div>
          <ul className="mt-7 grid gap-2 sm:grid-cols-3">
            {proof.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2 text-xs font-medium leading-relaxed text-white/76"
              >
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-kitch-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-kitch-accent/[0.08] blur-3xl"
            aria-hidden
          />
          {children}
        </div>
      </Container>
    </section>
  );
}

type OperationalPanelProps = {
  label: string;
  title: string;
  body: string;
  metrics: readonly { value: string; label: string }[];
  steps: readonly string[];
  icon?: LucideIcon;
};

export function OperationalPanel({
  label,
  title,
  body,
  metrics,
  steps,
  icon: Icon = Clock3,
}: OperationalPanelProps) {
  return (
    <section className="border-y border-white/[0.06] bg-gradient-to-b from-kitch-surface/20 to-kitch-bg py-14 lg:py-20">
      <Container className="grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-kitch-elevated/80 to-kitch-surface/45 p-6 shadow-[0_24px_76px_rgba(0,0,0,0.34)] sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-kitch-accent/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex size-12 items-center justify-center rounded-2xl border border-kitch-accent/25 bg-kitch-accent/10 text-kitch-accent">
            <Icon className="size-6" strokeWidth={1.7} />
          </div>
          <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-kitch-accent">
            {label}
          </p>
          <h2 className="relative mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="relative mt-4 text-pretty text-base leading-relaxed text-kitch-muted">
            {body}
          </p>
          <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/[0.07] bg-kitch-bg/45 p-4"
              >
                <p className="text-xl font-semibold tabular-nums text-white">{metric.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-kitch-subtle">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
        <ol className="grid gap-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-4 rounded-2xl border border-white/[0.07] bg-kitch-elevated/45 p-4 transition-colors hover:border-kitch-accent/25 hover:bg-kitch-elevated/70"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-kitch-accent/20 bg-kitch-accent/10 text-sm font-semibold text-kitch-accent">
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-relaxed text-kitch-muted">{step}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

type MidPageCTAProps = {
  locale: Locale;
  title: string;
  body: string;
  button: string;
};

export function MidPageCTA({ locale, title, body, button }: MidPageCTAProps) {
  return (
    <section className="py-12 lg:py-16">
      <Container className="max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-kitch-accent/25 bg-gradient-to-r from-kitch-accent/[0.14] via-kitch-elevated/70 to-kitch-surface/55 p-6 shadow-[0_24px_76px_rgba(230,57,70,0.09)] sm:p-8">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-kitch-muted sm:text-base">
                {body}
              </p>
            </div>
            <Button
              asChild
              variant="primary"
              size="lg"
              className="min-h-[3.25rem] w-full shrink-0 font-semibold shadow-[0_0_40px_rgba(230,57,70,0.34)] sm:w-auto"
            >
              <Link href={withLocale(locale, "/demo")} className="group">
                <span className="inline-flex items-center gap-2">
                  {button}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FinalPageCTA({
  locale,
  title,
  body,
  button,
}: MidPageCTAProps) {
  return (
    <section className="border-t border-white/[0.06] py-14 lg:py-20">
      <Container className="max-w-4xl text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-kitch-accent/25 bg-kitch-accent/10 text-kitch-accent">
          <ShieldCheck className="size-6" strokeWidth={1.7} />
        </div>
        <h2 className="mx-auto mt-5 max-w-3xl text-balance text-2xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-kitch-muted">
          {body}
        </p>
        <Button
          asChild
          variant="primary"
          size="lg"
          className="mt-8 min-h-[3.25rem] w-full max-w-sm font-semibold shadow-[0_0_44px_rgba(230,57,70,0.34)] sm:w-auto"
        >
          <Link href={withLocale(locale, "/demo")}>{button}</Link>
        </Button>
        <p className="mt-3 text-xs font-medium text-kitch-subtle">
          {locale === "es"
            ? "Te contactaremos en menos de 24 horas."
            : "We will contact you within 24 hours."}
        </p>
      </Container>
    </section>
  );
}
