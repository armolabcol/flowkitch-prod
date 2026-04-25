import { FinalCTASection } from "@/components/home/FinalCTASection";
import { FlowStorySection } from "@/components/home/FlowStorySection";
import { HeroSection } from "@/components/home/HeroSection";
import { BeforeAfterSection } from "@/components/home/BeforeAfterSection";
import { MidDemoCTASection } from "@/components/home/MidDemoCTASection";
import { OperationsRealitySection } from "@/components/home/OperationsRealitySection";
import { MarketsSection } from "@/components/home/MarketsSection";
import { MockupShowcaseSection } from "@/components/home/MockupShowcaseSection";
import { ModuleCardsSection } from "@/components/home/ModuleCardsSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dictionary = getDictionary(locale);

  return (
    <>
      <HeroSection locale={locale} dictionary={dictionary} />
      <SocialProofSection dictionary={dictionary} />
      <OperationsRealitySection dictionary={dictionary} />
      <FlowStorySection dictionary={dictionary} />
      <ProblemSection dictionary={dictionary} />
      <SolutionSection dictionary={dictionary} />
      <BeforeAfterSection dictionary={dictionary} />
      <ModuleCardsSection locale={locale} dictionary={dictionary} />
      <MidDemoCTASection locale={locale} dictionary={dictionary} />
      <MockupShowcaseSection locale={locale} dictionary={dictionary} />
      <MarketsSection dictionary={dictionary} />
      <FinalCTASection locale={locale} dictionary={dictionary} />
    </>
  );
}
