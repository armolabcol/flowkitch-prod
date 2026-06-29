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

export type HomepageV2FlowStation = {
  title: string;
  action: string;
  badge: string;
  symbol: string;
};

export type HomepageV2LiveOrder = {
  table: string;
  orderId: string;
  statusLabel: string;
  liveBadge: string;
  statusCycle: string[];
  meta: { label: string; value: string }[];
};

export type HomepageV2LiveOrderBoard = {
  boardLabel: string;
  boardSublabel: string;
  liveOrder: HomepageV2LiveOrder;
  stations: HomepageV2FlowStation[];
  benefits: string[];
};

export type HomepageV2OperatingSystemBoard = {
  systemLabel: string;
  journeyLabel: string;
  journeySublabel: string;
  modulesLabel: string;
  modulesSublabel: string;
  liveOrder: HomepageV2LiveOrder;
  stations: HomepageV2FlowStation[];
  modules: HomepageV2EcosystemModule[];
  carouselSlides: HomepageV2FlowCarouselSlide[];
  valueTitle: string;
  benefits: string[];
};

export type HomepageV2FlowPhoto = {
  topBadge: string;
  title: string;
  description: string;
  descriptionMobile?: string;
};

export type HomepageV2EcosystemModule = {
  title: string;
  description: string;
  benefit: string;
  badge: string;
  symbol: string;
};

export type HomepageV2FlowCarouselSlide = {
  step: string;
  title: string;
  description: string;
  badge: string;
  asset: string;
  stepLabel: string;
  stationIndex?: number;
};

export type HomepageV2EcosystemBoard = {
  boardLabel: string;
  boardSublabel: string;
  modules: HomepageV2EcosystemModule[];
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
  operatingSystem?: HomepageV2OperatingSystemBoard;
  flowPhoto?: HomepageV2FlowPhoto;
  mediaSrc?: string;
  mediaAlt?: string;
  cta?: HomepageV2Cta;
};

export type HomepageV2Content = {
  hero: HomepageV2HeroContent;
  operationalProblem: HomepageV2SectionContent;
  restaurantTransformation: HomepageV2SectionContent;
  operationalFlow: HomepageV2SectionContent;
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
