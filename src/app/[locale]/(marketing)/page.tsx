import type { Metadata } from "next";
import {
  AndroidSection,
  HomeHero,
  HomepageCTA,
  OperationalFlow,
  OperationalProblem,
  ProductProof,
  RestaurantTransformation,
  ResultsSection,
} from "@/components/home/v2";
import { getHomepageV2Content } from "@/data/homepage-v2-content";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata, localeFromParams } from "@/lib/build-page-metadata";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/",
    title: dict.seoHome.title,
    description: dict.seoHome.description,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const v2 = getHomepageV2Content(locale);

  return (
    <>
      <HomeHero content={v2.hero} locale={locale} />
      <OperationalProblem content={v2.operationalProblem} locale={locale} />
      <RestaurantTransformation content={v2.restaurantTransformation} locale={locale} />
      <OperationalFlow content={v2.operationalFlow} locale={locale} />
      <AndroidSection content={v2.android} locale={locale} />
      <ResultsSection content={v2.results} locale={locale} />
      <ProductProof content={v2.productProof} locale={locale} />
      <HomepageCTA content={v2.finalCta} locale={locale} />
    </>
  );
}
