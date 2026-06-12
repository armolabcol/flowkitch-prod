import type { Metadata } from "next";
import { ProductPageView } from "@/components/marketing/ProductPageView";
import { getDictionary } from "@/lib/dictionaries";
import { buildPageMetadata, localeFromParams } from "@/lib/build-page-metadata";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = localeFromParams(raw);
  const dict = getDictionary(locale);
  const seo = dict.marketing.product.seo;
  return buildPageMetadata({
    locale,
    path: "/product",
    title: seo.title,
    description: seo.description,
  });
}

export default async function ProductPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = localeFromParams(raw);
  const dict = getDictionary(locale);

  return <ProductPageView locale={locale} dictionary={dict} />;
}
