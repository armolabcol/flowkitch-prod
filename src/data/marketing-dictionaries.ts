/** Full marketing page copy — ES / EN must share the same shape */

export const marketingEs = {
  product: {
    seo: {
      title: "Kitch — Sistema de flujo operativo para restaurantes",
      description:
        "Kitch es la capa de flujo operativo que conecta mesa, mesero, cocina y manager en un solo sistema trazable. Estados de orden, mockups y demo.",
    },
    hero: {
      headline: "La capa de flujo operativo que tu restaurante necesitaba.",
      lead:
        "Un solo hilo para cada orden: desde el QR hasta el cierre, con roles alineados y señales claras en tiempo real.",
      cta: "Agendar demo",
    },
    whatIs: {
      label: "Qué es Kitch",
      title: "Qué es Kitch en realidad",
      body:
        "Kitch no es un catálogo de funciones sueltas. Es el sistema que mantiene la coherencia del servicio: una orden vive en un solo flujo, visible para quien la necesita en cada momento.",
      bullets: [
        "Capa de orquestación sobre tu operación diaria",
        "Estados compartidos entre cliente, sala y cocina",
        "Menos interpretación manual, más señales explícitas",
      ],
    },
    roles: {
      label: "Roles",
      title: "Cómo el sistema conecta los roles",
      subtitle:
        "Cada rol toca la misma verdad operativa: la orden avanza con contexto completo, sin silos.",
      nodes: [
        { key: "guest", name: "Cliente", note: "QR, ronda, mesa" },
        { key: "waiter", name: "Mesero", note: "Validación y piso" },
        { key: "kitchen", name: "Cocina", note: "Preparación y despacho" },
        { key: "manager", name: "Manager", note: "Control e insights" },
      ],
    },
    flowDeep: {
      label: "Flujo",
      title: "Profundidad en estados de orden",
      intro:
        "Una orden no es solo “pedido” o “listo”. Kitch modela el recorrido para que cada transición sea explícita y auditable.",
      states: [
        { name: "QR / menú", desc: "Mesa y turno ligados desde el inicio." },
        { name: "Ronda enviada", desc: "Claridad de ronda antes de cocina." },
        { name: "Aprobación mesero", desc: "Validación con contexto completo." },
        { name: "En cocina", desc: "Ticket propiedad de línea con prioridad." },
        { name: "Preparando / Listo", desc: "Señales visibles para toda la brigada." },
        { name: "Entregado / Cerrado", desc: "Cierre trazable para administración." },
      ],
    },
    capabilities: {
      label: "Capacidades",
      title: "Capacidades clave",
      subtitle: "Más profundas que un listado de home: cómo se siente en operación real.",
      cards: [
        {
          title: "Trazabilidad extremo a extremo",
          body: "Cada paso queda asociado a mesa, ronda y rol responsable.",
        },
        {
          title: "Colas y prioridades",
          body: "Cocina ve qué importa ahora, no solo una lista plana.",
        },
        {
          title: "Coordinación mesa–cocina",
          body: "Menos ida y vuelta verbal: el estado habla por el equipo.",
        },
        {
          title: "Panel manager en vivo",
          body: "Órdenes activas, tiempos y alertas alineados con el piso.",
        },
      ],
    },
    visual: {
      label: "Producto",
      title: "Sistema visual",
      subtitle:
        "Mockups densos del mismo lenguaje visual del home — sin capturas pesadas.",
    },
    cta: {
      title: "Ve el flujo completo con tu equipo.",
      button: "Agendar demo",
    },
  },
  restaurants: {
    seo: {
      title: "Kitch para restaurantes — Sin caos operativo",
      description:
        "Dueños y operadores: menos pérdida de tiempo, menos errores de pedido y cocina ordenada. Casos simulados y demo.",
    },
    hero: {
      headline: "Diseñado para restaurantes que no pueden operar en caos.",
      lead:
        "Cuando el servicio se acelera, los parches digitales se rompen. Kitch ordena el flujo real: mesa, mesero, cocina y control.",
      cta: "Agendar demo",
    },
    pains: {
      label: "Dolor real",
      title: "Pain points que ya conoces",
      items: [
        { title: "Pérdidas de tiempo", body: "Búsqueda de órdenes, confirmaciones repetidas y retrabajo en pico." },
        { title: "Errores en pedidos", body: "Interpretaciones distintas entre sala y línea caliente." },
        { title: "Presión en meseros", body: "Demasiadas fuentes de verdad mientras el comedor llena." },
        { title: "Cocina desordenada", body: "Tickets sin prioridad clara y picos imposibles de leer." },
      ],
    },
    better: {
      label: "Mejora",
      title: "Cómo Kitch mejora tu negocio",
      items: [
        { title: "Velocidad", body: "Menos fricción entre validación y despacho." },
        { title: "Control", body: "Visibilidad de lo activo, no solo del cierre del día." },
        { title: "Experiencia cliente", body: "Coherencia entre lo pedido y lo servido." },
      ],
    },
    cases: {
      label: "Casos",
      title: "Escenarios simulados",
      subtitle: "Ejemplos ilustrativos — listos para conversar en demo.",
      items: [
        {
          title: "Brunch de alto volumen",
          body: "Mesas con rondas rápidas; cocina prioriza tickets con tiempo visible.",
        },
        {
          title: "Restaurante multisede",
          body: "Manager compara turno en vivo sin depender de capturas atrasadas.",
        },
        {
          title: "Salón + barra",
          body: "Flujos distintos comparten estados para que nadie adivine el contexto.",
        },
      ],
    },
    cta: {
      title: "Hablemos de tu operación concreta.",
      body: "Preparamos una demo alineada a tus mesas, turnos y dolores reales.",
      button: "Agendar demo",
    },
  },
  waiters: {
    seo: {
      title: "Kitch para meseros — Menos estrés en sala",
      description:
        "Validación clara de órdenes, menos errores y mejor comunicación con cocina. Flujo de trabajo del mesero y mockup del panel.",
    },
    hero: {
      headline: "Menos estrés. Más control en la mesa.",
      lead:
        "Aprueba con contexto, sigue rondas y coordina con cocina sin perder el ritmo del comedor.",
      cta: "Agendar demo",
    },
    benefits: {
      label: "Beneficios",
      title: "Lo que cambia en tu turno",
      items: [
        { title: "Validación clara", body: "Apruebas con la información completa antes de cocina." },
        { title: "Menos errores", body: "Estados compartidos reducen malentendidos." },
        { title: "Mejor vínculo con cocina", body: "El ticket habla el mismo idioma que la línea." },
      ],
    },
    workflow: {
      label: "Flujo",
      title: "Flujo de trabajo del mesero",
      steps: [
        "Revisar mesas y rondas activas en un solo panel.",
        "Validar o ajustar antes de enviar a cocina.",
        "Seguir preparación y listo para despacho al cliente.",
        "Escalar al manager solo cuando el estado lo amerita.",
      ],
    },
    mockup: {
      label: "Mockup",
      title: "Panel mesero",
      subtitle: "Vista densa inspirada en operación real — sin peso de imágenes.",
    },
  },
  kitchen: {
    seo: {
      title: "Kitch para cocina — KDS y estados en vivo",
      description:
        "Tickets claros, prioridad visible y menos errores. Organización en tiempo real para la línea caliente.",
    },
    hero: {
      headline: "Tu cocina, por fin organizada en tiempo real.",
      lead: "Un display vivo con estados, tiempos y prioridad que toda la brigada entiende al instante.",
      cta: "Agendar demo",
    },
    problems: {
      label: "Problemas",
      title: "Lo que duele hoy",
      items: [
        { title: "Tickets confusos", body: "Información incompleta o llegando fuera de orden." },
        { title: "Falta de prioridad", body: "Todo parece urgente cuando nada está ordenado." },
        { title: "Errores en despacho", body: "Malentendidos entre lo pedido y lo preparado." },
      ],
    },
    solution: {
      label: "Solución",
      title: "Cómo Kitch ordena la línea",
      items: [
        { title: "Estados claros", body: "Preparando, listo y cierre visibles para todos." },
        { title: "Orden de preparación", body: "Señales de cola alineadas con el flujo real." },
        { title: "Visibilidad", body: "Cada ticket cuenta su historia en segundos." },
      ],
    },
    mockup: {
      label: "KDS",
      title: "Kitchen Display simulado",
      subtitle: "Tres tickets con progreso — componentes ligeros, sin assets pesados.",
    },
  },
  manager: {
    seo: {
      title: "Kitch para managers — Control operativo en vivo",
      description:
        "Órdenes activas, tiempos y cuellos de botella en un dashboard. Insights operativos para decisiones aún en servicio.",
    },
    hero: {
      headline: "Control en tiempo real sobre toda tu operación.",
      lead: "Ve lo que está pasando ahora: piso, cocina y cierres con el mismo modelo de estados.",
      cta: "Agendar demo",
    },
    sees: {
      label: "Vista",
      title: "Qué ve el manager",
      items: [
        { title: "Órdenes activas", body: "Pipeline vivo con alertas cuando algo se estanca." },
        { title: "Tiempos", body: "Señales de TAT y saturación sin esperar reportes del día siguiente." },
        { title: "Cuellos de botella", body: "Dónde se acumula trabajo entre roles." },
      ],
    },
    insights: {
      label: "Insights",
      title: "Insights operativos",
      body: "KPIs pensados para servicio en curso: lo suficientemente simples para actuar en el momento, lo suficientemente ricos para revisar después.",
    },
    mockup: {
      label: "Dashboard",
      title: "Panel de control simulado",
      subtitle: "Métricas compactas y alertas — mismo ADN visual de Kitch.",
    },
  },
} as const;

export const marketingEn = {
  product: {
    seo: {
      title: "Kitch — Operational flow system for restaurants",
      description:
        "Kitch is the operational flow layer connecting table, waiter, kitchen and manager in one traceable system. Order states, mockups and demo.",
    },
    hero: {
      headline: "The operational flow layer your restaurant was missing.",
      lead:
        "One thread per order: from QR to close, with roles aligned and clear signals in real time.",
      cta: "Schedule demo",
    },
    whatIs: {
      label: "What it is",
      title: "What Kitch actually is",
      body:
        "Kitch is not a catalog of disconnected features. It is the system that keeps service coherent: an order lives in one flow, visible to whoever needs it at each moment.",
      bullets: [
        "An orchestration layer across your daily operation",
        "Shared states across guest, floor and kitchen",
        "Fewer manual guesses, more explicit signals",
      ],
    },
    roles: {
      label: "Roles",
      title: "How the system connects roles",
      subtitle:
        "Every role touches the same operational truth: the order moves with full context, without silos.",
      nodes: [
        { key: "guest", name: "Guest", note: "QR, round, table" },
        { key: "waiter", name: "Waiter", note: "Validation & floor" },
        { key: "kitchen", name: "Kitchen", note: "Prep & dispatch" },
        { key: "manager", name: "Manager", note: "Control & insight" },
      ],
    },
    flowDeep: {
      label: "Flow",
      title: "Flow deep dive: order states",
      intro:
        "An order is not just “placed” or “ready”. Kitch models the journey so every transition is explicit and auditable.",
      states: [
        { name: "QR / menu", desc: "Table and shift bound from the start." },
        { name: "Round submitted", desc: "Round clarity before the kitchen owns it." },
        { name: "Waiter approval", desc: "Validation with complete context." },
        { name: "In kitchen", desc: "Ticket owned by the line with priority." },
        { name: "Preparing / Ready", desc: "Visible signals for the entire brigade." },
        { name: "Delivered / Closed", desc: "Traceable close for management." },
      ],
    },
    capabilities: {
      label: "Capabilities",
      title: "Key capabilities",
      subtitle: "Deeper than the home teaser: how it feels in real service.",
      cards: [
        {
          title: "End-to-end traceability",
          body: "Each step maps to table, round and owning role.",
        },
        {
          title: "Queues and priorities",
          body: "The kitchen sees what matters now, not a flat list.",
        },
        {
          title: "Table–kitchen coordination",
          body: "Less verbal ping-pong: state carries the team.",
        },
        {
          title: "Live manager surface",
          body: "Active orders, timing and alerts aligned with the floor.",
        },
      ],
    },
    visual: {
      label: "Product",
      title: "Visual system",
      subtitle:
        "Dense mockups in the same visual language as home — no heavy image assets.",
    },
    cta: {
      title: "Walk the full flow with your team.",
      button: "Schedule demo",
    },
  },
  restaurants: {
    seo: {
      title: "Kitch for restaurants — Built against operational chaos",
      description:
        "For owners and operators: less wasted time, fewer order mistakes and an organized kitchen. Simulated scenarios and demo.",
    },
    hero: {
      headline: "Built for restaurants that cannot afford operational chaos.",
      lead:
        "When service accelerates, digital patches break. Kitch organizes the real flow: table, waiter, kitchen and control.",
      cta: "Schedule demo",
    },
    pains: {
      label: "Pain",
      title: "Pain points you already know",
      items: [
        { title: "Wasted time", body: "Chasing orders, repeated confirmations and rework at peak." },
        { title: "Order mistakes", body: "Different interpretations between front and hot line." },
        { title: "Waiter pressure", body: "Too many sources of truth while the room fills." },
        { title: "Messy kitchen", body: "Tickets without clear priority and unreadable spikes." },
      ],
    },
    better: {
      label: "Better",
      title: "How Kitch improves your business",
      items: [
        { title: "Speed", body: "Less friction between validation and dispatch." },
        { title: "Control", body: "Visibility into what is active, not only end-of-day totals." },
        { title: "Guest experience", body: "Coherence between what was ordered and what is served." },
      ],
    },
    cases: {
      label: "Scenarios",
      title: "Simulated scenarios",
      subtitle: "Illustrative examples — great to unpack on a demo call.",
      items: [
        {
          title: "High-volume brunch",
          body: "Fast rounds at tables; kitchen prioritizes tickets with visible timing.",
        },
        {
          title: "Multi-location brand",
          body: "Managers compare live shifts without waiting for stale screenshots.",
        },
        {
          title: "Dining room + bar",
          body: "Different flows share states so nobody guesses context.",
        },
      ],
    },
    cta: {
      title: "Let’s talk about your specific operation.",
      body: "We tailor a demo to your tables, shifts and real pain points.",
      button: "Schedule demo",
    },
  },
  waiters: {
    seo: {
      title: "Kitch for waiters — Less stress on the floor",
      description:
        "Clear order validation, fewer mistakes and better kitchen communication. Waiter workflow and panel mockup.",
    },
    hero: {
      headline: "Less stress. More control at the table.",
      lead:
        "Approve with context, follow rounds and coordinate with the kitchen without losing dining-room pace.",
      cta: "Schedule demo",
    },
    benefits: {
      label: "Benefits",
      title: "What changes on your shift",
      items: [
        { title: "Clear validation", body: "You approve with full context before the kitchen owns it." },
        { title: "Fewer mistakes", body: "Shared states reduce misunderstandings." },
        { title: "Tighter kitchen link", body: "The ticket speaks the same language as the line." },
      ],
    },
    workflow: {
      label: "Workflow",
      title: "Waiter workflow",
      steps: [
        "Review active tables and rounds in one panel.",
        "Validate or adjust before sending to the kitchen.",
        "Track prep and ready for guest delivery.",
        "Escalate to the manager only when state warrants it.",
      ],
    },
    mockup: {
      label: "Mockup",
      title: "Waiter panel",
      subtitle: "Dense UI inspired by real operations — no heavy imagery.",
    },
  },
  kitchen: {
    seo: {
      title: "Kitch for kitchen — KDS and live states",
      description:
        "Clear tickets, visible priority and fewer errors. Real-time organization for the hot line.",
    },
    hero: {
      headline: "Your kitchen, finally organized in real time.",
      lead: "A live display with states, timing and priority the entire brigade reads in seconds.",
      cta: "Schedule demo",
    },
    problems: {
      label: "Problems",
      title: "What hurts today",
      items: [
        { title: "Confusing tickets", body: "Incomplete information or arriving out of order." },
        { title: "Missing priority", body: "Everything feels urgent when nothing is ordered." },
        { title: "Dispatch errors", body: "Mismatch between what was ordered and what was prepared." },
      ],
    },
    solution: {
      label: "Solution",
      title: "How Kitch orders the line",
      items: [
        { title: "Clear states", body: "Preparing, ready and close visible to everyone." },
        { title: "Prep order", body: "Queue signals aligned with the real flow." },
        { title: "Visibility", body: "Each ticket tells its story in seconds." },
      ],
    },
    mockup: {
      label: "KDS",
      title: "Simulated kitchen display",
      subtitle: "Three tickets with progress — lightweight components, no heavy assets.",
    },
  },
  manager: {
    seo: {
      title: "Kitch for managers — Live operational control",
      description:
        "Active orders, timing and bottlenecks in one dashboard. Operational insights for decisions while service is still running.",
    },
    hero: {
      headline: "Real-time control over your entire operation.",
      lead: "See what is happening now: floor, kitchen and closes with the same state model.",
      cta: "Schedule demo",
    },
    sees: {
      label: "View",
      title: "What the manager sees",
      items: [
        { title: "Active orders", body: "Live pipeline with alerts when something stalls." },
        { title: "Timing", body: "TAT and saturation signals without waiting for next-day reports." },
        { title: "Bottlenecks", body: "Where work piles up between roles." },
      ],
    },
    insights: {
      label: "Insights",
      title: "Operational insights",
      body: "KPIs designed for service in flight: simple enough to act in the moment, rich enough to review after.",
    },
    mockup: {
      label: "Dashboard",
      title: "Simulated control dashboard",
      subtitle: "Compact metrics and alerts — same Kitch visual DNA.",
    },
  },
} as const;
