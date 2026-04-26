import type { Metadata } from "next";
import { defaultLocale, isLocale, locales, withLocale, type Locale } from "@/lib/i18n";

const siteUrl = "https://flowkitch.com";
const metadataBase = new URL(siteUrl);

type BuildPageMetadataArgs = {
  locale: Locale;
  /** Path after locale, e.g. `/product` or `/portal/login` */
  path: string;
  title: string;
  description: string;
};

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: BuildPageMetadataArgs): Metadata {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url =
    normalized === "/"
      ? `${siteUrl}/${locale}`
      : `${siteUrl}${withLocale(locale, normalized)}`;

  return {
    metadataBase,
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        [
          ...locales.map((l) => [
            l,
            normalized === "/"
              ? `${siteUrl}/${l}`
              : `${siteUrl}${withLocale(l, normalized)}`,
          ]),
          [
            "x-default",
            normalized === "/"
              ? `${siteUrl}/${defaultLocale}`
              : `${siteUrl}${withLocale(defaultLocale, normalized)}`,
          ],
        ],
      ),
    },
    openGraph: {
      siteName: "Kitch",
      type: "website",
      url,
      title,
      description,
      locale: locale === "es" ? "es_CO" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function localeFromParams(raw: string): Locale {
  return isLocale(raw) ? raw : defaultLocale;
}
