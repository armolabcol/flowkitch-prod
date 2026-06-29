import type { HomepageV2Content } from "@/components/home/v2/types";
import type { Locale } from "@/lib/i18n";

const es: HomepageV2Content = {
  hero: {
    id: "hero",
    eyebrow: "Kitch by Armo",
    title: "Del caos operativo al control total.",
    description:
      "Kitch conecta clientes, mesas, meseros, cocina y administración en un único flujo digital trazable, para que cada orden avance con precisión incluso en las horas de mayor demanda.",
    microcopy:
      "No vendemos otro POS. Construimos el flujo detrás de un gran servicio.",
    cta: {
      primaryLabel: "Agendar demo",
      secondaryLabel: "Ver cómo funciona",
    },
  },
  operationalProblem: {
    id: "operational-problem",
    eyebrow: "Sección 02",
    title: "La operación no falla por falta de esfuerzo.",
    titleLine2: "Falla cuando el flujo se rompe.",
    description:
      "En horas pico, los pedidos se dispersan, la cocina pierde visibilidad, el mesero se satura y la gerencia reacciona tarde. El problema no es la intención del equipo: es la falta de un sistema que conecte cada paso del servicio.",
    mediaPlaceholder: "—",
    animationPlaceholder: "—",
    footerStrip:
      "Pedidos dispersos · Meseros saturados · Cocina sin claridad · Gerencia reactiva",
    visualBadges: [
      "Pedidos dispersos",
      "Cocina sin visibilidad",
      "Rondas perdidas",
    ],
    mediaSrc:
      "/assets/sections/problem/KITCH_SECTION_02_OPERATIONAL_PROBLEM_v01.webp",
    mediaAlt:
      "Cocina de restaurante en hora pico con equipo bajo presión y pantalla KDS visible",
  },
  restaurantTransformation: {
    id: "restaurant-transformation",
    eyebrow: "Sección 03",
    title: "[Transformación del restaurante] Título temporal",
    description:
      "Descripción temporal de la transformación antes y después de Kitch.",
    mediaPlaceholder: "Imagen / video — transformación",
    animationPlaceholder: "Animación — reservado Fase 2",
  },
  operationalFlow: {
    id: "operational-flow",
    eyebrow: "Sección 04",
    title: "[Flujo operativo] Título temporal",
    description:
      "Descripción temporal del flujo entre cliente, mesa, mesero, cocina y manager.",
    mediaPlaceholder: "Diagrama / secuencia — flujo operativo",
    animationPlaceholder: "Animación de flujo — reservado Fase 2",
  },
  kitchEcosystem: {
    id: "kitch-ecosystem",
    eyebrow: "Sección 05",
    title: "[Ecosistema Kitch] Título temporal",
    description:
      "Descripción temporal de módulos y roles conectados en la plataforma.",
    mediaPlaceholder: "Visual ecosistema — placeholder",
    animationPlaceholder: "Animación ecosistema — reservado Fase 2",
  },
  android: {
    id: "the-android",
    eyebrow: "Sección 06",
    title: "[The Android] Título temporal",
    description:
      "Descripción temporal del dispositivo / capa Android en operación de sala.",
    mediaPlaceholder: "Dispositivo / hardware — placeholder",
    animationPlaceholder: "Animación dispositivo — reservado Fase 2",
  },
  results: {
    id: "results",
    eyebrow: "Sección 07",
    title: "[Resultados] Título temporal",
    description:
      "Descripción temporal de métricas e impacto operativo.",
    mediaPlaceholder: "Gráficos / métricas — placeholder",
    animationPlaceholder: "Animación resultados — reservado Fase 2",
  },
  productProof: {
    id: "product-proof",
    eyebrow: "Sección 08",
    title: "[Prueba de producto] Título temporal",
    description:
      "Descripción temporal de mockups, pantallas reales y evidencia del producto.",
    mediaPlaceholder: "Mockups / capturas — placeholder",
    animationPlaceholder: "Animación producto — reservado Fase 2",
  },
  finalCta: {
    id: "final-cta",
    eyebrow: "Sección 09",
    title: "[CTA final] Título temporal",
    description:
      "Descripción temporal del cierre y llamada a la acción.",
    mediaPlaceholder: "—",
    animationPlaceholder: "—",
    cta: {
      primaryLabel: "CTA final — placeholder",
      secondaryLabel: "CTA secundario — placeholder",
    },
  },
};

const en: HomepageV2Content = {
  hero: {
    id: "hero",
    eyebrow: "Kitch by Armo",
    title: "From operational chaos to total control.",
    description:
      "Kitch connects guests, tables, waiters, kitchen and management into one traceable digital flow, so every order moves with precision even during peak service.",
    microcopy:
      "We do not sell another POS. We build the flow behind great service.",
    cta: {
      primaryLabel: "Schedule demo",
      secondaryLabel: "See how it works",
    },
  },
  operationalProblem: {
    id: "operational-problem",
    eyebrow: "Section 02",
    title: "Operations don't fail from lack of effort.",
    titleLine2: "They fail when the flow breaks.",
    description:
      "During peak hours, orders scatter, the kitchen loses visibility, waiters get overwhelmed, and management reacts too late. The problem isn't team intent — it's the lack of a system connecting every step of service.",
    mediaPlaceholder: "—",
    animationPlaceholder: "—",
    footerStrip:
      "Scattered orders · Overwhelmed waiters · Kitchen without clarity · Reactive management",
    visualBadges: [
      "Scattered orders",
      "Kitchen without visibility",
      "Lost rounds",
    ],
    mediaSrc:
      "/assets/sections/problem/KITCH_SECTION_02_OPERATIONAL_PROBLEM_v01.webp",
    mediaAlt:
      "Restaurant kitchen during peak service with team under pressure and KDS screen visible",
  },
  restaurantTransformation: {
    id: "restaurant-transformation",
    eyebrow: "Section 03",
    title: "[Restaurant transformation] Temporary title",
    description:
      "Temporary description of transformation before and after Kitch.",
    mediaPlaceholder: "Image / video — transformation",
    animationPlaceholder: "Animation — Phase 2 reserved",
  },
  operationalFlow: {
    id: "operational-flow",
    eyebrow: "Section 04",
    title: "[Operational flow] Temporary title",
    description:
      "Temporary description of flow across guest, table, waiter, kitchen and manager.",
    mediaPlaceholder: "Diagram / sequence — operational flow",
    animationPlaceholder: "Flow animation — Phase 2 reserved",
  },
  kitchEcosystem: {
    id: "kitch-ecosystem",
    eyebrow: "Section 05",
    title: "[Kitch ecosystem] Temporary title",
    description:
      "Temporary description of connected modules and roles on the platform.",
    mediaPlaceholder: "Ecosystem visual — placeholder",
    animationPlaceholder: "Ecosystem animation — Phase 2 reserved",
  },
  android: {
    id: "the-android",
    eyebrow: "Section 06",
    title: "[The Android] Temporary title",
    description:
      "Temporary description of the device / Android layer in floor operations.",
    mediaPlaceholder: "Device / hardware — placeholder",
    animationPlaceholder: "Device animation — Phase 2 reserved",
  },
  results: {
    id: "results",
    eyebrow: "Section 07",
    title: "[Results] Temporary title",
    description:
      "Temporary description of metrics and operational impact.",
    mediaPlaceholder: "Charts / metrics — placeholder",
    animationPlaceholder: "Results animation — Phase 2 reserved",
  },
  productProof: {
    id: "product-proof",
    eyebrow: "Section 08",
    title: "[Product proof] Temporary title",
    description:
      "Temporary description of mockups, live screens and product evidence.",
    mediaPlaceholder: "Mockups / screenshots — placeholder",
    animationPlaceholder: "Product animation — Phase 2 reserved",
  },
  finalCta: {
    id: "final-cta",
    eyebrow: "Section 09",
    title: "[Final CTA] Temporary title",
    description:
      "Temporary closing description and call to action.",
    mediaPlaceholder: "—",
    animationPlaceholder: "—",
    cta: {
      primaryLabel: "Final CTA — placeholder",
      secondaryLabel: "Secondary CTA — placeholder",
    },
  },
};

export function getHomepageV2Content(locale: Locale): HomepageV2Content {
  return locale === "en" ? en : es;
}
