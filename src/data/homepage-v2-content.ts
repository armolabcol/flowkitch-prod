import type { HomepageV2Content } from "@/components/home/v2/types";
import type { Locale } from "@/lib/i18n";

const es: HomepageV2Content = {
  hero: {
    id: "hero",
    eyebrow: "Sistema operativo digital para restaurantes",
    title: "Kitch",
    tagline: "The flow behind great service.",
    description:
      "Conecta cliente, mesero, cocina y gerencia en una operación fluida, visible y rentable.",
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
    diagnosticLabel: "Estrés operativo",
    diagnosticSublabel: "Flujo de servicio en hora pico",
    mediaSrc:
      "/assets/sections/problem/KITCH_SECTION_02_OPERATIONAL_PROBLEM_v01.webp",
    mediaAlt:
      "Cocina de restaurante en hora pico con equipo bajo presión y pantalla KDS visible",
  },
  restaurantTransformation: {
    id: "restaurant-transformation",
    eyebrow: "Sección 03",
    title: "Donde antes había fricción,",
    titleLine2: "ahora hay flujo.",
    description:
      "Kitch transforma un servicio fragmentado en una operación conectada. Cliente, mesero, cocina y gerencia comparten visibilidad en tiempo real para reducir errores, acelerar decisiones y sostener un mejor servicio incluso en horas pico.",
    mediaPlaceholder: "—",
    animationPlaceholder: "—",
    footerStrip:
      "Cliente · Mesero · Cocina · Gerencia — conectados en tiempo real",
    transformationBoard: {
      boardLabel: "Tablero de transformación",
      boardSublabel: "Cambio operativo del restaurante",
      before: {
        title: "Antes de Kitch",
        subcopy: "Operación fragmentada",
        items: [
          "Pedidos dispersos",
          "Cocina sin visibilidad",
          "Meseros saturados",
          "Gerencia reactiva",
        ],
      },
      after: {
        title: "Con Kitch",
        subcopy: "Operación conectada",
        items: [
          "Flujo centralizado",
          "Estados claros",
          "Meseros con control",
          "Visibilidad en tiempo real",
        ],
      },
      flowSteps: ["Cliente", "Mesero", "Cocina", "Gerencia"],
    },
  },
  operationalFlow: {
    id: "operational-flow",
    eyebrow: "Sección 04",
    title: "Una sola orden.",
    titleLine2: "Todo el restaurante en sincronía.",
    description:
      "Desde que el cliente escanea el QR hasta que cocina y gerencia actúan sobre la misma información, Kitch mantiene cada orden viva, visible y trazable para que el servicio avance con control real.",
    mediaPlaceholder: "—",
    animationPlaceholder: "—",
    footerStrip:
      "Menos errores · Más visibilidad · Rondas más fáciles · Control en tiempo real",
    flowMap: {
      boardLabel: "LIVE ORDER FLOW",
      boardSublabel: "Cómo Kitch mueve una orden por el restaurante",
      liveOrder: {
        table: "Mesa 08",
        orderId: "Orden #1284",
        statusLabel: "Estado actual",
        liveBadge: "En vivo",
        statusCycle: [
          "QR escaneado",
          "Orden viva",
          "Aprobada",
          "Preparing",
          "Supervisada",
        ],
        meta: [
          { label: "Ítems", value: "3" },
          { label: "Ronda", value: "2" },
          { label: "Host", value: "Activo" },
          { label: "Abierta", value: "12 min" },
        ],
      },
      stations: [
        {
          title: "Cliente",
          action: "Escanea QR y arma su pedido.",
          badge: "Inicia",
          symbol: "QR",
        },
        {
          title: "Mesa / Orden viva",
          action: "Crea la orden y mantiene rondas activas.",
          badge: "Orden viva",
          symbol: "M8",
        },
        {
          title: "Mesero",
          action: "Valida, aprueba y envía a cocina.",
          badge: "Aprueba",
          symbol: "✓",
        },
        {
          title: "Cocina",
          action: "Recibe ítems y actualiza estados.",
          badge: "Prepara",
          symbol: "KDS",
        },
        {
          title: "Manager",
          action: "Supervisa operación, cierres y trazabilidad.",
          badge: "Supervisa",
          symbol: "MG",
        },
      ],
      benefits: [
        "Menos errores de comunicación",
        "Más visibilidad en tiempo real",
        "Cocina con estados claros",
        "Meseros con más control",
        "Nuevas rondas sin fricción",
        "Trazabilidad operativa",
      ],
    },
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
    eyebrow: "Digital operating system for restaurants",
    title: "Kitch",
    tagline: "The flow behind great service.",
    description:
      "Connects guests, waiters, kitchen and management in a fluid, visible and profitable operation.",
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
    diagnosticLabel: "Operational stress",
    diagnosticSublabel: "Peak-hour service flow",
    mediaSrc:
      "/assets/sections/problem/KITCH_SECTION_02_OPERATIONAL_PROBLEM_v01.webp",
    mediaAlt:
      "Restaurant kitchen during peak service with team under pressure and KDS screen visible",
  },
  restaurantTransformation: {
    id: "restaurant-transformation",
    eyebrow: "Section 03",
    title: "Where friction once lived,",
    titleLine2: "flow takes over.",
    description:
      "Kitch transforms fragmented service into a connected operation. Guests, waiters, kitchen and management share real-time visibility to reduce errors, speed decisions and sustain better service even during peak hours.",
    mediaPlaceholder: "—",
    animationPlaceholder: "—",
    footerStrip:
      "Guest · Waiter · Kitchen · Management — connected in real time",
    transformationBoard: {
      boardLabel: "Transformation board",
      boardSublabel: "Restaurant operational shift",
      before: {
        title: "Before Kitch",
        subcopy: "Fragmented operation",
        items: [
          "Scattered orders",
          "Kitchen without visibility",
          "Overwhelmed waiters",
          "Reactive management",
        ],
      },
      after: {
        title: "With Kitch",
        subcopy: "Connected operation",
        items: [
          "Centralized flow",
          "Clear states",
          "Waiters in control",
          "Real-time visibility",
        ],
      },
      flowSteps: ["Guest", "Waiter", "Kitchen", "Management"],
    },
  },
  operationalFlow: {
    id: "operational-flow",
    eyebrow: "Section 04",
    title: "One live order.",
    titleLine2: "The whole restaurant in sync.",
    description:
      "From the moment a guest scans the QR until kitchen and management act on the same information, Kitch keeps every order live, visible and traceable so service moves with real control.",
    mediaPlaceholder: "—",
    animationPlaceholder: "—",
    footerStrip:
      "Fewer errors · More visibility · Easier rounds · Real-time control",
    flowMap: {
      boardLabel: "LIVE ORDER FLOW",
      boardSublabel: "How Kitch moves one order through the restaurant",
      liveOrder: {
        table: "Table 08",
        orderId: "Order #1284",
        statusLabel: "Current status",
        liveBadge: "Live",
        statusCycle: [
          "QR scanned",
          "Live order",
          "Approved",
          "Preparing",
          "Supervised",
        ],
        meta: [
          { label: "Items", value: "3" },
          { label: "Round", value: "2" },
          { label: "Host", value: "Active" },
          { label: "Open", value: "12 min" },
        ],
      },
      stations: [
        {
          title: "Guest",
          action: "Scans QR and builds their order.",
          badge: "Starts",
          symbol: "QR",
        },
        {
          title: "Table / Live order",
          action: "Creates the order and keeps rounds active.",
          badge: "Live order",
          symbol: "T8",
        },
        {
          title: "Waiter",
          action: "Validates, approves and sends to kitchen.",
          badge: "Approves",
          symbol: "✓",
        },
        {
          title: "Kitchen",
          action: "Receives items and updates states.",
          badge: "Prepares",
          symbol: "KDS",
        },
        {
          title: "Manager",
          action: "Oversees operations, closes and traceability.",
          badge: "Oversees",
          symbol: "MG",
        },
      ],
      benefits: [
        "Fewer communication errors",
        "More real-time visibility",
        "Kitchen with clear states",
        "Waiters with more control",
        "New rounds without friction",
        "Operational traceability",
      ],
    },
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
