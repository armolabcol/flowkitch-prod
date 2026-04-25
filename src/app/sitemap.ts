import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const baseUrl = "https://flowkitch.com";

const paths = [
  "",
  "/product",
  "/restaurants",
  "/waiters",
  "/kitchen",
  "/manager",
  "/demo",
  "/portal/login",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      const url = path ? `${baseUrl}/${locale}${path}` : `${baseUrl}/${locale}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
