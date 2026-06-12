import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SaasPageHeader } from "@/components/saas/SaasPageBlocks";
import { getSaasDictionary } from "@/lib/saas-dictionaries";
import { getWhatsAppLeadHref } from "@/lib/whatsapp";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function PortalSupportPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSaasDictionary(locale);
  const d = dict.portal.support;

  return (
    <>
      <SaasPageHeader title={d.title} description={d.body} />
      <div className="rounded-2xl border border-white/[0.08] bg-kitch-surface/80 p-6 sm:p-8">
        <Button asChild size="lg">
          <Link href={getWhatsAppLeadHref(locale)} target="_blank" rel="noopener noreferrer">
            {d.cta}
          </Link>
        </Button>
      </div>
    </>
  );
}
