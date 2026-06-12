import type { Locale } from "./i18n";
import { marketingEn, marketingEs } from "@/data/marketing-dictionaries";

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
      requestDemo: "Agendar demo",
      portalLogin: "Portal",
    },
    home: {
      hero: {
        headline: "Cada orden. Cada mesa. Cada paso. Bajo control.",
        lead: "Diseñado para restaurantes donde el servicio no puede depender de suposiciones.",
        trace: "Del QR a cocina y administración, cada orden conserva su trazabilidad.",
        posLayer:
          "Kitch no es otro POS. Es la capa de flujo operativo que tu restaurante necesitaba.",
        ctaPrimary: "Agendar demo",
        ctaSecondary: "Ver cómo funciona el flujo",
        ctaAdvisor: "Hablar con un asesor",
        setupLine: "Implementación guiada para tu restaurante en días, no meses.",
      },
      socialProof: {
        title: "Diseñado para operaciones reales de restaurante",
        items: [
          { metric: "+120", label: "mesas gestionadas en servicio real" },
          { metric: "+3,000", label: "órdenes trazadas por día" },
          { metric: "Multi‑rol", label: "flujo validado entre roles operativos" },
        ],
      },
      beforeAfter: {
        title: "Before Kitch vs With Kitch",
        beforeTitle: "Before Kitch",
        withTitle: "With Kitch",
        before: [
          "Órdenes dispersas",
          "Presión para meseros",
          "Confusión en cocina",
          "Administración a ciegas",
        ],
        with: [
          "Flujo trazable",
          "Aprobaciones claras",
          "Cocina organizada",
          "Control en tiempo real",
        ],
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
      midCta: {
        title: "Descubre cómo funciona Kitch en tu restaurante.",
        button: "Agendar demo",
        bullets: [
          "Sin riesgo de implementación",
          "Sin contratos largos",
          "Acompañamiento en todo el proceso",
        ],
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
        ctaPrimary: "Agendar demo",
        ctaSecondary: "Hablar con un asesor",
      },
      urgency: {
        line: "Capacidad limitada de implementación por mes.",
      },
      trustSales: {
        title: "Diseñado con operación real de restaurantes en mente",
        items: [
          "Experiencia en Horeca y picos de servicio reales.",
          "Enfoque en operación de sala, cocina y control — no en pantallas aisladas.",
          "No es una herramienta genérica: está construido para el ritmo de un restaurante.",
        ],
      },
      closing: {
        title: "¿Listo para llevar control real a tu restaurante?",
        body:
          "Descubre cómo Kitch puede ordenar el flujo real de tu servicio, desde la mesa hasta la cocina y la administración.",
        ctaDemo: "Agendar demo",
        ctaAdvisor: "Hablar con un asesor",
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
    seoHome: {
      title: "Software de operación para restaurantes | Kitch",
      description:
        "Convierte mesa, mesero, cocina y administración en un solo flujo trazable. Agenda demo y habla con un asesor.",
    },
    placeholder: {
      backHome: "Volver al inicio",
      seeDemo: "Ir a demo",
      learnMore: "Más información próximamente",
    },
    marketing: marketingEs,
    demoPage: {
      title: "Solicita una demo",
      description:
        "Completa el formulario y nuestro equipo revisará tu operación para preparar una demo enfocada.",
      extra:
        "Sin compromiso: usamos estos datos solo para coordinar la sesión y responder por el canal que elijas.",
      trustLine: "Te contactaremos en menos de 24 horas.",
      directToTeam: "Tu solicitud llega directamente a nuestro equipo comercial.",
      submit: "Enviar solicitud",
      submitting: "Enviando…",
      successTitle: "Listo",
      successBody:
        "Recibimos tu solicitud. Te escribiremos pronto con próximos pasos.",
      noCommitment:
        "Sin compromiso. Solo una visión real de cómo funciona Kitch.",
      errors: {
        required: "Este campo es obligatorio.",
        email: "Introduce un email válido.",
        whatsapp: "Introduce un número de WhatsApp válido.",
        tablesMin: "Indica al menos 1 mesa o deja el campo vacío.",
        pos: "Selecciona una opción de POS.",
      },
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
      subtitle: "Acceso para equipos ARMO y clientes Kitch.",
      accessLabel: "Acceso Kitch",
      clientsOnly: "Acceso exclusivo para clientes Kitch",
      seoDescription:
        "Inicia sesión en el portal Kitch: acceso exclusivo para clientes y equipos con operación activa.",
      email: "Email",
      password: "Contraseña",
      login: "Iniciar sesión",
      signingIn: "Ingresando…",
      notice:
        "Administradores ARMO y clientes activos ingresan aquí; serás redirigido según tu rol.",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      forgotPasswordTitle: "Recuperar contraseña",
      forgotPasswordHint:
        "Te enviaremos un enlace a tu correo para crear una nueva contraseña.",
      sendResetLink: "Enviar enlace",
      sending: "Enviando…",
      resetEmailSent:
        "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      backToLogin: "Volver al inicio de sesión",
      resetPasswordTitle: "Nueva contraseña",
      resetPasswordHint: "Elige una contraseña de al menos 8 caracteres.",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar contraseña",
      updatePassword: "Guardar contraseña",
      updatingPassword: "Guardando…",
      passwordMismatch: "Las contraseñas no coinciden.",
      resetFailed: "No se pudo actualizar la contraseña.",
      callbackFailed: "El enlace expiró o no es válido. Solicita uno nuevo.",
    },
    contact: {
      whatsappCta: "Hablar con un asesor",
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
      requestDemo: "Schedule a demo",
      portalLogin: "Portal",
    },
    home: {
      hero: {
        headline: "Every order. Every table. Every step. Under control.",
        lead: "Built for restaurants where service cannot depend on guesswork.",
        trace: "From QR to kitchen to management, every order keeps its trace.",
        posLayer:
          "Kitch is not another POS. It is the operational flow layer your restaurant was missing.",
        ctaPrimary: "Schedule a demo",
        ctaSecondary: "See how the flow works",
        ctaAdvisor: "Talk to an advisor",
        setupLine: "Guided setup for your restaurant in days, not months.",
      },
      socialProof: {
        title: "Built for real restaurant operations",
        items: [
          { metric: "120+", label: "tables handled in live service" },
          { metric: "3,000+", label: "orders tracked per day" },
          { metric: "Multi‑role", label: "workflow validated" },
        ],
      },
      beforeAfter: {
        title: "Before Kitch vs With Kitch",
        beforeTitle: "Before Kitch",
        withTitle: "With Kitch",
        before: [
          "Scattered orders",
          "Waiter pressure",
          "Kitchen confusion",
          "Blind management",
        ],
        with: [
          "Traceable flow",
          "Clear approvals",
          "Organized kitchen",
          "Real-time control",
        ],
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
      midCta: {
        title: "See how Kitch works in your restaurant.",
        button: "Schedule a demo",
        bullets: ["No setup risk", "No long-term contracts", "Guided onboarding"],
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
      urgency: {
        line: "Limited onboarding capacity per month.",
      },
      trustSales: {
        title: "Designed with real restaurant operations in mind",
        items: [
          "Horeca experience and real peak-service dynamics.",
          "Built around floor, kitchen and control — not disconnected screens.",
          "Not a generic tool: shaped for how restaurants actually run.",
        ],
      },
      closing: {
        title: "Ready to bring control to your restaurant?",
        body:
          "See how Kitch can organize your real service flow, from table to kitchen to management.",
        ctaDemo: "Schedule a demo",
        ctaAdvisor: "Talk to an advisor",
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
    seoHome: {
      title: "Restaurant operation software | Kitch",
      description:
        "Turn table, waiters, kitchen and management into one traceable flow. Book a demo or talk to an advisor.",
    },
    placeholder: {
      backHome: "Back to home",
      seeDemo: "Go to demo",
      learnMore: "More details coming soon",
    },
    marketing: marketingEn,
    demoPage: {
      title: "Request a demo",
      description:
        "Share a few details about your restaurant so we can prepare a focused walkthrough.",
      extra:
        "No commitment — we use this information only to coordinate the session and reply on your preferred channel.",
      trustLine: "We will contact you within 24 hours.",
      directToTeam: "Your request goes directly to our commercial team.",
      submit: "Submit request",
      submitting: "Sending…",
      successTitle: "Received",
      successBody:
        "We received your request and will follow up shortly with next steps.",
      noCommitment:
        "No commitment. Just a real look at how Kitch works.",
      errors: {
        required: "This field is required.",
        email: "Enter a valid email address.",
        whatsapp: "Enter a valid WhatsApp number.",
        tablesMin: "Enter at least 1 table or leave the field empty.",
        pos: "Please select a POS option.",
      },
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
      subtitle: "Access for ARMO teams and Kitch clients.",
      accessLabel: "Kitch access",
      clientsOnly: "Access for Kitch clients only",
      seoDescription:
        "Sign in to the Kitch portal — exclusive access for active clients and internal teams.",
      email: "Email",
      password: "Password",
      login: "Sign in",
      signingIn: "Signing in…",
      notice:
        "ARMO admins and active clients sign in here; you will be redirected based on your role.",
      showPassword: "Show password",
      hidePassword: "Hide password",
      forgotPassword: "Forgot your password?",
      forgotPasswordTitle: "Reset password",
      forgotPasswordHint:
        "We will email you a link to set a new password.",
      sendResetLink: "Send reset link",
      sending: "Sending…",
      resetEmailSent:
        "If the email is registered, you will receive a password reset link.",
      backToLogin: "Back to sign in",
      resetPasswordTitle: "New password",
      resetPasswordHint: "Choose a password with at least 8 characters.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      updatePassword: "Save password",
      updatingPassword: "Saving…",
      passwordMismatch: "Passwords do not match.",
      resetFailed: "Could not update password.",
      callbackFailed: "The link expired or is invalid. Request a new one.",
    },
    contact: {
      whatsappCta: "Talk to an advisor",
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
