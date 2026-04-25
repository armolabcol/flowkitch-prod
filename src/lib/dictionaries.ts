import type { Locale } from "./i18n";

export type Dictionary = (typeof dictionaries)[Locale];

export const dictionaries = {
  es: {
    brand: {
      name: "Kitch",
      byArmo: "By Armo",
      slogan: "The flow behind great service",
      domainNote: "flowkitch.com",
    },
    nav: {
      product: "Producto",
      restaurants: "Restaurantes",
      waiters: "Meseros",
      kitchen: "Cocina",
      manager: "Manager",
      demo: "Demo",
      portal: "Portal",
    },
    header: {
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      requestDemo: "Solicitar demo",
      portalLogin: "Portal",
    },
    home: {
      hero: {
        headline: "Cada orden. Cada mesa. Cada paso. Bajo control.",
        lead: "Diseñado para restaurantes donde el servicio no puede depender de suposiciones.",
        trace: "Del QR a cocina y administración, cada orden conserva su trazabilidad.",
        posLayer:
          "Kitch no es otro POS. Es la capa de flujo operativo que tu restaurante necesitaba.",
        ctaPrimary: "Solicitar una demo",
        ctaSecondary: "Ver cómo funciona el flujo",
      },
      operations: {
        eyebrow: "Restaurante real",
        title: "Un restaurante no opera en una sola pantalla.",
        body: "Kitch conecta lo que ocurre en mesa, salón, cocina y administración para que cada orden avance con trazabilidad.",
        cards: [
          {
            key: "guestQr",
            title: "Guest QR",
            body: "Invitación a ordenar con mesa, turno y ronda claramente ligados al ticket.",
          },
          {
            key: "waiter",
            title: "Aprobación mesero",
            body: "Validación y rondas antes de que cocina asuma el ticket con información completa.",
          },
          {
            key: "kitchen",
            title: "Cola cocina",
            body: "Tickets priorizados con estados Preparing, Ready y tiempos visibles para toda la línea.",
          },
          {
            key: "manager",
            title: "Insight manager",
            body: "KPIs y alertas alineados con lo que está pasando ahora en sala y cocina.",
          },
        ],
      },
      flowStory: {
        title: "El flujo como sistema vivo",
        subtitle:
          "Una orden es un punto rojo que avanza: cada rol ve el mismo estado, en el mismo instante.",
        nodes: [
          "Cliente",
          "Mesa",
          "Mesero",
          "Cocina",
          "Entrega",
          "Manager",
          "Orden cerrada",
        ],
        states: [
          { key: "qr", label: "QR escaneado" },
          { key: "round", label: "Ronda enviada" },
          { key: "waiter", label: "Mesero aprobó" },
          { key: "kitchen", label: "Enviado a cocina" },
          { key: "prep", label: "Preparando" },
          { key: "ready", label: "Listo" },
          { key: "delivered", label: "Entregado" },
          { key: "closed", label: "Cerrado" },
        ],
      },
      problem: {
        eyebrow: "Operación real",
        title: "Cuando un restaurante crece, la operación se fragmenta.",
        body: "El cliente pide por un lado. El mesero valida por otro. Cocina recibe información incompleta. El manager intenta entender qué está pasando cuando el servicio ya está corriendo.",
        beforeTitle: "Before Kitch",
        beforeItems: [
          "Órdenes dispersas",
          "Presión para meseros",
          "Ruido en cocina",
          "Administración a ciegas",
        ],
      },
      solution: {
        eyebrow: "Trazabilidad",
        title: "Kitch convierte ese recorrido en un flujo claro, visible y trazable.",
        differentiation:
          "No es solo un menú digital. No es solo una pantalla para cocina. Kitch conecta todo el servicio.",
        benefit: "Menos confusión. Más velocidad. Mejor servicio.",
        withTitle: "With Kitch",
        withItems: [
          "Flujo trazable",
          "Aprobaciones claras",
          "Cocina organizada",
          "Control en vivo",
        ],
      },
      modules: {
        eyebrow: "Plataforma",
        title: "Capas de producto para operaciones que ya no caben en un chat.",
      },
      mockups: {
        eyebrow: "Producto",
        title: "Mockups del flujo en acción",
        subtitle:
          "Interfaces simuladas para visualizar el control operativo antes de capturas reales.",
        labels: {
          mobileMenu: "Menú móvil",
          waiterPanel: "Panel mesero",
          kitchenQueue: "Cola cocina",
          managerControl: "Control manager",
        },
      },
      markets: {
        eyebrow: "Mercados",
        title: "Colombia + Estados Unidos",
        body: "Implementación comercial bilingüe, configuración guiada y asesoría según país.",
        colombiaTitle: "Colombia",
        colombiaBullets: [
          "Asesoría local",
          "Pagos locales (cuando aplique)",
          "Implementación acompañada",
        ],
        usTitle: "United States",
        usBullets: [
          "English sales flow",
          "Subscription setup (cuando aplique)",
          "Restaurant onboarding",
        ],
      },
      finalCta: {
        title: "Si tu restaurante ya creció, tu operación también necesita crecer.",
        support:
          "Agenda una demo y descubre cómo Kitch puede ordenar el flujo real de tu restaurante.",
        ctaPrimary: "Solicitar demo",
        ctaSecondary: "Hablar con un asesor",
      },
    },
    footer: {
      legal:
        "Kitch es una marca By Armo. La entidad comercial responsable puede variar según el país de contratación.",
      colombia: "Colombia",
      unitedStates: "Estados Unidos",
    },
    seo: {
      title: "Kitch | The flow behind great service",
      description:
        "Kitch conecta clientes, meseros, cocina y administración en un flujo digital trazable para restaurantes que necesitan velocidad, claridad y control.",
    },
    placeholder: {
      backHome: "Volver al inicio",
      seeDemo: "Ir a demo",
      learnMore: "Más información próximamente",
    },
    demoPage: {
      title: "Solicita una demo",
      description:
        "Cuéntanos sobre tu restaurante. Este formulario es visual en esta fase; pronto conectaremos con tu equipo.",
      submit: "Enviar solicitud",
      submitting: "Enviando…",
      successTitle: "Listo",
      successBody:
        "Pronto integraremos el envío a CRM o email. Por ahora tu solicitud se registró solo en esta vista.",
      fields: {
        name: "Nombre",
        restaurant: "Restaurante",
        country: "País",
        city: "Ciudad",
        whatsapp: "WhatsApp",
        email: "Email",
        tables: "Número aproximado de mesas",
        pos: "¿Ya usa POS?",
        improve: "¿Qué necesita mejorar?",
      },
      posOptions: {
        yes: "Sí",
        no: "No",
        evaluating: "En evaluación",
      },
    },
    portal: {
      title: "Portal Kitch",
      subtitle: "Acceso para equipos y clientes Kitch.",
      email: "Email",
      password: "Contraseña",
      login: "Iniciar sesión",
      notice:
        "El acceso al portal será activado para clientes Kitch.",
    },
    internalPages: {
      product: {
        title: "Producto",
        description:
          "Visión unificada del flujo: menú, órdenes, cocina, servicio y cierre en un solo sistema trazable.",
      },
      restaurants: {
        title: "Restaurantes",
        description:
          "Operación por mesa y turno, con claridad para sala y cocina sin depender de mensajes sueltos.",
      },
      waiters: {
        title: "Meseros",
        description:
          "Validación, seguimiento de rondas y coordinación con cocina sin fricción.",
      },
      kitchen: {
        title: "Cocina",
        description:
          "Pantalla viva con estados, prioridades y señales claras para preparar y despachar.",
      },
      manager: {
        title: "Manager",
        description:
          "Control en vivo: qué se pide, qué se prepara y qué se cierra, cuando aún importa.",
      },
    },
  },
  en: {
    brand: {
      name: "Kitch",
      byArmo: "By Armo",
      slogan: "The flow behind great service",
      domainNote: "flowkitch.com",
    },
    nav: {
      product: "Product",
      restaurants: "Restaurants",
      waiters: "Waiters",
      kitchen: "Kitchen",
      manager: "Manager",
      demo: "Demo",
      portal: "Portal",
    },
    header: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      requestDemo: "Request demo",
      portalLogin: "Portal",
    },
    home: {
      hero: {
        headline: "Every order. Every table. Every step. Under control.",
        lead: "Built for restaurants where service cannot depend on guesswork.",
        trace: "From QR to kitchen to management, every order keeps its trace.",
        posLayer:
          "Kitch is not another POS. It is the operational flow layer your restaurant was missing.",
        ctaPrimary: "Request a demo",
        ctaSecondary: "See how the flow works",
      },
      operations: {
        eyebrow: "Real restaurant",
        title: "Operations do not live on a single screen.",
        body: "They live across tables, devices and simultaneous decisions. Kitch turns that intensity into one traceable flow — without losing service momentum.",
        cards: [
          {
            key: "guestQr",
            title: "Guest QR",
            body: "Ordering starts with table, shift and round clearly bound to the ticket.",
          },
          {
            key: "waiter",
            title: "Waiter approval",
            body: "Validation and rounds before the kitchen owns the ticket with complete context.",
          },
          {
            key: "kitchen",
            title: "Kitchen queue",
            body: "Prioritized tickets with Preparing, Ready and timing visible for the entire line.",
          },
          {
            key: "manager",
            title: "Manager insight",
            body: "KPIs and alerts aligned with what is happening right now on the floor and in the kitchen.",
          },
        ],
      },
      flowStory: {
        title: "The flow as a living system",
        subtitle:
          "An order is a red dot in motion: every role sees the same state, at the same moment.",
        nodes: [
          "Guest",
          "Table",
          "Waiter",
          "Kitchen",
          "Delivery",
          "Manager",
          "Closed Order",
        ],
        states: [
          { key: "qr", label: "QR scanned" },
          { key: "round", label: "Round submitted" },
          { key: "waiter", label: "Waiter approved" },
          { key: "kitchen", label: "Sent to kitchen" },
          { key: "prep", label: "Preparing" },
          { key: "ready", label: "Ready" },
          { key: "delivered", label: "Delivered" },
          { key: "closed", label: "Closed" },
        ],
      },
      problem: {
        eyebrow: "Real operations",
        title: "When a restaurant grows, operations become fragmented.",
        body: "Guests order in one place. Waiters validate somewhere else. The kitchen receives incomplete information. Managers try to understand what is happening while service is already moving.",
        beforeTitle: "Before Kitch",
        beforeItems: [
          "Scattered orders",
          "Waiter pressure",
          "Kitchen noise",
          "Blind management",
        ],
      },
      solution: {
        eyebrow: "Traceability",
        title: "Kitch turns that journey into a clear, visible and traceable flow.",
        differentiation:
          "Not just a digital menu. Not just a kitchen screen. Kitch connects the entire service flow.",
        benefit: "Less confusion. More speed. Better service.",
        withTitle: "With Kitch",
        withItems: [
          "Traceable flow",
          "Clear approvals",
          "Organized kitchen",
          "Live control",
        ],
      },
      modules: {
        eyebrow: "Platform",
        title: "Product layers for operations that no longer fit in a chat thread.",
      },
      mockups: {
        eyebrow: "Product",
        title: "Flow mockups in action",
        subtitle:
          "Simulated interfaces to visualize operational control before real screenshots.",
        labels: {
          mobileMenu: "Mobile menu",
          waiterPanel: "Waiter panel",
          kitchenQueue: "Kitchen queue",
          managerControl: "Manager control",
        },
      },
      markets: {
        eyebrow: "Markets",
        title: "Colombia + United States",
        body: "Bilingual commercial rollout, guided configuration and country-specific advisory.",
        colombiaTitle: "Colombia",
        colombiaBullets: [
          "Local advisory",
          "Local payments (when applicable)",
          "Guided implementation",
        ],
        usTitle: "United States",
        usBullets: [
          "English sales flow",
          "Subscription setup (when applicable)",
          "Restaurant onboarding",
        ],
      },
      finalCta: {
        title: "If your restaurant has grown, your operation needs to grow too.",
        support:
          "Schedule a demo and see how Kitch can organize your restaurant’s real service flow.",
        ctaPrimary: "Request a demo",
        ctaSecondary: "Talk to an advisor",
      },
    },
    footer: {
      legal:
        "Kitch is a By Armo brand. The responsible commercial entity may vary depending on the country of service.",
      colombia: "Colombia",
      unitedStates: "United States",
    },
    seo: {
      title: "Kitch | The flow behind great service",
      description:
        "Kitch connects guests, waiters, kitchen teams and managers in one traceable digital flow built for restaurants that need speed, clarity and control.",
    },
    placeholder: {
      backHome: "Back to home",
      seeDemo: "Go to demo",
      learnMore: "More details coming soon",
    },
    demoPage: {
      title: "Request a demo",
      description:
        "Tell us about your restaurant. This form is visual in this phase; we will connect with your team soon.",
      submit: "Submit request",
      submitting: "Sending…",
      successTitle: "Received",
      successBody:
        "We will wire this to CRM or email later. For now your request is only reflected in this view.",
      fields: {
        name: "Name",
        restaurant: "Restaurant",
        country: "Country",
        city: "City",
        whatsapp: "WhatsApp",
        email: "Email",
        tables: "Approximate number of tables",
        pos: "Do you already use a POS?",
        improve: "What do you need to improve?",
      },
      posOptions: {
        yes: "Yes",
        no: "No",
        evaluating: "Evaluating",
      },
    },
    portal: {
      title: "Kitch Portal",
      subtitle: "Access for Kitch teams and clients.",
      email: "Email",
      password: "Password",
      login: "Sign in",
      notice: "Portal access will be activated for Kitch clients.",
    },
    internalPages: {
      product: {
        title: "Product",
        description:
          "A unified view of the flow: menu, orders, kitchen, service and closing in one traceable system.",
      },
      restaurants: {
        title: "Restaurants",
        description:
          "Table- and shift-aware operations with clarity for front and back of house without scattered messages.",
      },
      waiters: {
        title: "Waiters",
        description:
          "Validation, round tracking and kitchen coordination without friction.",
      },
      kitchen: {
        title: "Kitchen",
        description:
          "A live display with states, priorities and clear signals to prepare and dispatch.",
      },
      manager: {
        title: "Manager",
        description:
          "Live control: what is ordered, what is cooking and what is closed while it still matters.",
      },
    },
  },
} as const;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
