import { redirect } from "next/navigation";
import { defaultLocale, isLocale, withLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminLoginRedirectPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  redirect(withLocale(locale, "/portal/login"));
}
