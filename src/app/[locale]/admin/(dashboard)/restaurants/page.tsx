import { redirect } from "next/navigation";
import { defaultLocale, isLocale, withLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminRestaurantsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  redirect(withLocale(locale, "/admin/clients"));
}
