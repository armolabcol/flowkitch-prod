import type { Locale } from "@/lib/i18n";

export type HomepageV2Cta = {
  primaryLabel: string;
  secondaryLabel?: string;
};

export type HomepageV2HeroContent = {
  id: string;
  eyebrow?: string;
  title: string;
  tagline?: string;
  description: string;
  microcopy?: string;
  cta: HomepageV2Cta;
};

export type HomepageV2TransformationPanel = {
  title: string;
  subcopy: string;
  items: string[];
};

export type HomepageV2TransformationBoard = {
  boardLabel: string;
  boardSublabel: string;
  before: HomepageV2TransformationPanel;
  after: HomepageV2TransformationPanel;
  flowSteps: string[];
};

export type HomepageV2FlowNode = {
  title: string;
  subcopy: string;
  badge: string;
  symbol: string;
};

export type HomepageV2FlowMap = {
  mapLabel: string;
  mapSublabel?: string;
  nodes: HomepageV2FlowNode[];
  timeline: string[];
};

export type HomepageV2SectionContent = {
  id: string;
  eyebrow?: string;
  title: string;
  titleLine2?: string;
  description: string;
  mediaPlaceholder: string;
  animationPlaceholder: string;
  footerStrip?: string;
  visualBadges?: string[];
  diagnosticLabel?: string;
  diagnosticSublabel?: string;
  transformationBoard?: HomepageV2TransformationBoard;
  flowMap?: HomepageV2FlowMap;
  mediaSrc?: string;
  mediaAlt?: string;
  cta?: HomepageV2Cta;
};

export type HomepageV2Content = {
  hero: HomepageV2HeroContent;
  operationalProblem: HomepageV2SectionContent;
  restaurantTransformation: HomepageV2SectionContent;
  operationalFlow: HomepageV2SectionContent;
  kitchEcosystem: HomepageV2SectionContent;
  android: HomepageV2SectionContent;
  results: HomepageV2SectionContent;
  productProof: HomepageV2SectionContent;
  finalCta: HomepageV2SectionContent;
};

export type HomepageV2SectionProps = {
  content: HomepageV2SectionContent;
  locale: Locale;
};

export type HomepageV2HeroProps = {
  content: HomepageV2HeroContent;
  locale: Locale;
};
