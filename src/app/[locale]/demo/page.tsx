import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck2, Clock3, ShieldCheck } from "lucide-react";
import { DemoRequestForm } from "@/components/forms/DemoRequestForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata, localeFromParams } from "@/lib/build-page-metadata";
import { withLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const title = `${dict.demoPage.title} | Kitch`;
  return buildPageMetadata({
    locale,
    path: "/demo",
    title,
    description: dict.demoPage.description,
  });
}

export default async function DemoPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const d = dict.demoPage;
  const es = locale === "es";
  const trustItems = es
    ? ["Demo personalizada para tu operación", "Te contactaremos en menos de 24 horas", "Sin compromiso"]
    : ["Personalized demo for your operation", "We will contact you within 24 hours", "No commitment"];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(230,57,70,0.16),transparent_62%)]"
        aria-hidden
      />
      <Container className="relative grid gap-10 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-kitch-accent">
            {es ? "Solicitud de demo" : "Demo request"}
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {d.title}
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-kitch-muted sm:text-lg">
            {d.description}
          </p>
          <div className="mt-7 grid gap-3">
            {trustItems.map((item, index) => {
              const Icon = [CalendarCheck2, Clock3, ShieldCheck][index] ?? ShieldCheck;
              return (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-kitch-elevated/45 px-4 py-3 text-sm font-medium text-white/82"
                >
                  <Icon className="size-4 text-kitch-accent" strokeWidth={1.7} />
                  {item}
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/72">{d.directToTeam}</p>
          <div className="mt-8 hidden lg:block">
            <Button asChild variant="ghost" size="sm">
              <Link href={withLocale(locale, "/")}>{dict.placeholder.backHome}</Link>
            </Button>
          </div>
        </div>
        <div>
          <DemoRequestForm locale={locale} dictionary={dict} />
          <div className="mt-8 lg:hidden">
            <Button asChild variant="ghost" size="sm">
              <Link href={withLocale(locale, "/")}>{dict.placeholder.backHome}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
