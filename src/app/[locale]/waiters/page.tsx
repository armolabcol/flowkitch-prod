import type { Metadata } from "next";
import { SubPage, SubPageVisualBlock } from "@/components/marketing/SubPage";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  return { title: dict.internalPages.waiters.title };
}

export default async function WaitersPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const p = dict.internalPages.waiters;

  return (
    <SubPage
      locale={locale}
      dictionary={dict}
      title={p.title}
      description={p.description}
      visual={<SubPageVisualBlock />}
    />
  );
}
