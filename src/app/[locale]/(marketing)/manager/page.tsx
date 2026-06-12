import type { Metadata } from "next";
import { ManagerPageView } from "@/components/marketing/ManagerPageView";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata, localeFromParams } from "@/lib/build-page-metadata";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const seo = dict.marketing.manager.seo;
  return buildPageMetadata({
    locale,
    path: "/manager",
    title: seo.title,
    description: seo.description,
  });
}

export default async function ManagerPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = localeFromParams(raw);
  const dict = getDictionary(locale);

  return <ManagerPageView locale={locale} dictionary={dict} />;
}
