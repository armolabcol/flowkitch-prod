import type { Metadata } from "next";
import { defaultLocale, isLocale, locales, withLocale, type Locale } from "@/lib/i18n";

const siteUrl = "https://flowkitch.com";

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
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((l) => [
          l,
          normalized === "/"
            ? `${siteUrl}/${l}`
            : `${siteUrl}${withLocale(l, normalized)}`,
        ]),
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
  };
}

export function localeFromParams(raw: string): Locale {
  return isLocale(raw) ? raw : defaultLocale;
}
