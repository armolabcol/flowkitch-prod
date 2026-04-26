import type { Metadata } from "next";
import { RestaurantsPageView } from "@/components/marketing/RestaurantsPageView";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata, localeFromParams } from "@/lib/build-page-metadata";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const seo = dict.marketing.restaurants.seo;
  return buildPageMetadata({
    locale,
    path: "/restaurants",
    title: seo.title,
    description: seo.description,
  });
}

export default async function RestaurantsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = localeFromParams(raw);
  const dict = getDictionary(locale);

  return <RestaurantsPageView locale={locale} dictionary={dict} />;
}
