import type { Metadata } from "next";
import Link from "next/link";
import { DemoRequestForm } from "@/components/forms/DemoRequestForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale, withLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  return { title: dict.demoPage.title };
}

export default async function DemoPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const d = dict.demoPage;

  return (
    <Container className="py-16 lg:py-24">
      <div className="max-w-2xl">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {d.title}
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-kitch-muted">
          {d.description}
        </p>
        <p className="mt-3 text-pretty text-base leading-relaxed text-white/70">
          {d.extra}
        </p>
      </div>
      <div className="mt-12 max-w-3xl">
        <DemoRequestForm dictionary={dict} />
      </div>
      <div className="mt-10">
        <Button asChild variant="ghost" size="sm">
          <Link href={withLocale(locale, "/")}>{dict.placeholder.backHome}</Link>
        </Button>
      </div>
    </Container>
  );
}
