import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { LOCALE_HEADER } from "@/lib/locale-header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://flowkitch.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kitch | The flow behind great service",
    template: "%s | Kitch",
  },
  description:
    "Kitch connects guests, waiters, kitchen teams and managers in one traceable digital flow built for restaurants that need speed, clarity and control.",
  openGraph: {
    siteName: "Kitch",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Kitch | The flow behind great service",
    description:
      "Kitch connects guests, waiters, kitchen teams and managers in one traceable digital flow built for restaurants that need speed, clarity and control.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand/favicon-kitch.webp",
    apple: "/brand/favicon-kitch.webp",
    shortcut: "/brand/favicon-kitch.webp",
  },
};

async function readLocaleFromHeaders(): Promise<Locale> {
  const h = await headers();
  const raw = h.get(LOCALE_HEADER);
  if (raw && isLocale(raw)) return raw;
  return defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await readLocaleFromHeaders();

  return (
    <html lang={locale} className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col antialiased">{children}</body>
    </html>
  );
}
