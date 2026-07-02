import type { Locale } from "@/lib/i18n";

export type HomepageV2Cta = {
  primaryLabel: string;
  secondaryLabel?: string;
};

export type HomepageV2HeroMockupContent = {
  customer: {
    eyebrow: string;
    table: string;
    badge: string;
    addRound: string;
    items: { name: string; meta: string }[];
  };
  manager: {
    eyebrow: string;
    title: string;
    stats: { label: string; value: string }[];
    salesLabel: string;
    salesValue: string;
  };
  kitchen: {
    eyebrow: string;
    title: string;
    table: string;
    liveBadge: string;
    tickets: { item: string; status: string }[];
  };
  waiter: {
    eyebrow: string;
    title: string;
    pendingTitle: string;
    pendingMeta: string;
    approve: string;
    sendToKitchen: string;
  };
};

export type HomepageV2HeroContent = {
  id: string;
  eyebrow?: string;
  title: string;
  tagline?: string;
  description: string;
  microcopy?: string;
  cta: HomepageV2Cta;
  mockups?: HomepageV2HeroMockupContent;
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

export type HomepageV2OperatingSystemUi = {
  placeholderLabel: string;
  carouselAriaLabel: string;
  prevStepLabel: string;
  nextStepLabel: string;
  flowStepsAriaLabel: string;
  stepAriaTemplate: string;
};

export type HomepageV2OperatingSystemBoard = {
  systemLabel: string;
  journeyLabel: string;
  journeySublabel: string;
  activeModuleLabel: string;
  impactLabel: string;
  ownerInsightLabel: string;
  liveOrder: HomepageV2LiveOrderBase;
  flowSteps: HomepageV2FlowStep[];
  valueTitle: string;
  benefits: string[];
  ui: HomepageV2OperatingSystemUi;
};

export type HomepageV2LiveOrderBase = {
  table: string;
  orderId: string;
  statusLabel: string;
  liveBadge: string;
  meta: { label: string; value: string }[];
};

export type HomepageV2FlowStepModule = {
  symbol: string;
  title: string;
  description: string;
  benefit: string;
  signal: string;
  ownerValue: string;
};

export type HomepageV2FlowStep = {
  step: string;
  title: string;
  description: string;
  badge: string;
  asset: string;
  stepLabel: string;
  orderStatus: string;
  stationIndex?: number;
  station?: HomepageV2FlowStation;
  module: HomepageV2FlowStepModule;
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

export type HomepageV2AndroidOverlay = {
  title: string;
  subtitle: string;
  indicators: string[];
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
  microBenefits?: string[];
  androidOverlay?: HomepageV2AndroidOverlay;
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
