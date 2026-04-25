export type ModuleKey =
  | "digitalMenu"
  | "dineInQr"
  | "liveOrders"
  | "waiterPanel"
  | "kitchenDisplay"
  | "managerControl"
  | "loyalty"
  | "clientPortal";

export const moduleKeys: ModuleKey[] = [
  "digitalMenu",
  "dineInQr",
  "liveOrders",
  "waiterPanel",
  "kitchenDisplay",
  "managerControl",
  "loyalty",
  "clientPortal",
];

export const moduleCopy: Record<
  ModuleKey,
  {
    es: { title: string; description: string; tag: string };
    en: { title: string; description: string; tag: string };
  }
> = {
  digitalMenu: {
    es: {
      title: "Menú digital",
      description:
        "Carta viva con precios, alérgenos y disponibilidad alineada a cocina y caja.",
      tag: "Actualización instantánea",
    },
    en: {
      title: "Digital menu",
      description:
        "A live menu with pricing, allergens and availability aligned to kitchen and checkout.",
      tag: "Instant updates",
    },
  },
  dineInQr: {
    es: {
      title: "QR en sala",
      description:
        "Cada mesa origina tickets claros: rondas, modificadores y trazabilidad por comensal.",
      tag: "Mesa = contexto",
    },
    en: {
      title: "Dine-in QR",
      description:
        "Every table originates clear tickets: rounds, modifiers and traceability per guest.",
      tag: "Table = context",
    },
  },
  liveOrders: {
    es: {
      title: "Órdenes vivas",
      description:
        "Estados Preparing / Ready / Delivered / Closed visibles en sala, barra y cocina.",
      tag: "Un solo pulso operativo",
    },
    en: {
      title: "Live orders",
      description:
        "Preparing, Ready, Delivered and Closed states visible across floor, bar and kitchen.",
      tag: "One operational pulse",
    },
  },
  waiterPanel: {
    es: {
      title: "Panel mesero",
      description:
        "Aprobación, rondas y handoff a cocina sin chats paralelos ni versiones distintas.",
      tag: "Control en el piso",
    },
    en: {
      title: "Waiter panel",
      description:
        "Approval, rounds and kitchen handoff without parallel chats or conflicting versions.",
      tag: "Floor control",
    },
  },
  kitchenDisplay: {
    es: {
      title: "Cocina",
      description:
        "KDS con colas, tiempos y prioridades para que nada se pierda en el rush.",
      tag: "Cola priorizada",
    },
    en: {
      title: "Kitchen display",
      description:
        "A KDS with queues, timing and priorities so nothing gets lost in the rush.",
      tag: "Prioritized queue",
    },
  },
  managerControl: {
    es: {
      title: "Control manager",
      description:
        "KPIs en vivo, APS/TAT y cierre de turno con la misma verdad que vio el servicio.",
      tag: "Insight en vivo",
    },
    en: {
      title: "Manager control",
      description:
        "Live KPIs, APS/TAT and shift close with the same truth the floor already saw.",
      tag: "Live insight",
    },
  },
  loyalty: {
    es: {
      title: "Fidelización",
      description:
        "Historial y preferencias conectados al servicio, no a una app aislada.",
      tag: "Relación continua",
    },
    en: {
      title: "Loyalty",
      description:
        "History and preferences connected to service, not a disconnected app.",
      tag: "Ongoing relationship",
    },
  },
  clientPortal: {
    es: {
      title: "Portal cliente",
      description:
        "Cuentas, configuración y soporte en un solo lugar para equipos que operan Kitch.",
      tag: "Operación centralizada",
    },
    en: {
      title: "Client portal",
      description:
        "Accounts, configuration and support in one place for teams running Kitch.",
      tag: "Centralized ops",
    },
  },
};
