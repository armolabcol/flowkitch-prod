import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/lib/dictionaries";
import { withLocale, type Locale } from "@/lib/i18n";

type SubPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  title: string;
  description: string;
  visual: ReactNode;
};

export function SubPage({
  locale,
  dictionary,
  title,
  description,
  visual,
}: SubPageProps) {
  return (
    <Container className="py-16 lg:py-24">
      <div className="max-w-3xl">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-kitch-muted">
          {description}
        </p>
      </div>
      <div className="mt-12">{visual}</div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild variant="primary" size="md">
          <Link href={withLocale(locale, "/demo")}>
            {dictionary.placeholder.seeDemo}
          </Link>
        </Button>
        <Button asChild variant="secondary" size="md">
          <Link href={withLocale(locale, "/")}>
            {dictionary.placeholder.backHome}
          </Link>
        </Button>
      </div>
    </Container>
  );
}

export function SubPageVisualBlock() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-kitch-border bg-gradient-to-br from-kitch-elevated to-kitch-surface p-10 sm:p-14">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-kitch-accent/15 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-32 w-64 rounded-full bg-kitch-accent/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl border border-kitch-border bg-kitch-bg/80 shadow-[0_0_40px_rgba(230,57,70,0.2)]">
          <span className="size-4 rounded-full bg-kitch-accent shadow-[0_0_20px_rgba(230,57,70,0.9)]" />
        </span>
        <div className="flex w-full max-w-md items-center justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-px flex-1 bg-gradient-to-r from-transparent via-kitch-accent/40 to-transparent"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
