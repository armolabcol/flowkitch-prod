import type { Locale } from "@/lib/i18n";
import type { LicenseStatus } from "@/types/saas";

export type SaasDictionary = (typeof saasDictionaries)[Locale];

export const saasDictionaries = {
  es: {
    admin: {
      title: "Admin Kitch",
      subtitle: "Control de licencias y operaciones",
      nav: {
        dashboard: "Dashboard",
        clients: "Clientes",
        restaurants: "Restaurantes",
        installations: "Instalaciones",
        licenses: "Licencias",
        maintenance: "Mantenimiento",
        settings: "Configuración",
      },
      stats: {
        totalClients: "Total clientes",
        activeInstallations: "Instalaciones activas",
        expiringSoon: "Por vencer (30 días)",
        suspended: "Suspendidas",
        ordersMonth: "Órdenes del mes",
        revenueMonth: "Volumen del mes",
      },
      table: {
        restaurant: "Restaurante",
        country: "País",
        licenseStatus: "Estado licencia",
        expiresAt: "Vencimiento",
        pluginVersion: "Plugin",
        lastSync: "Último sync",
        ordersMonth: "Órdenes mes",
        revenueMonth: "Volumen mes",
      },
      mockBadge: "Datos mock — Fase SaaS",
    },
    portal: {
      title: "Portal Kitch",
      subtitle: "Tu membresía y operación",
      nav: {
        overview: "Resumen",
        membership: "Membresía",
        installation: "Instalación",
        billing: "Facturación",
        support: "Soporte",
      },
      membership: {
        title: "Estado de membresía",
        plan: "Plan",
        expiresAt: "Vence el",
        renew: "Renovar membresía",
        contactSupport: "Contactar soporte",
      },
      installation: {
        title: "Tu instalación",
        siteUrl: "Sitio web",
        pluginVersion: "Versión del plugin",
        lastValidation: "Última validación",
        lastSync: "Último sync",
        apiKey: "API Key",
        apiKeyNote: "Solo se muestran los últimos 4 caracteres por seguridad.",
      },
      billing: {
        title: "Historial de pagos",
        date: "Fecha",
        description: "Concepto",
        amount: "Monto",
        status: "Estado",
      },
      support: {
        title: "Soporte",
        body: "¿Necesitas ayuda con tu instalación o membresía? Nuestro equipo está disponible.",
        cta: "Abrir ticket de soporte",
      },
      paymentStatus: {
        paid: "Pagado",
        pending: "Pendiente",
        failed: "Fallido",
        refunded: "Reembolsado",
      },
    },
    licenseStatus: {
      active: "Activa",
      past_due: "Pago vencido",
      grace_period: "Periodo de gracia",
      suspended: "Suspendida",
      cancelled: "Cancelada",
      maintenance_required: "Mantenimiento",
      license_unknown: "Desconocida",
    } satisfies Record<LicenseStatus, string>,
    countries: { CO: "Colombia", US: "Estados Unidos" } as Record<string, string>,
  },
  en: {
    admin: {
      title: "Kitch Admin",
      subtitle: "Licensing and operations control",
      nav: {
        dashboard: "Dashboard",
        clients: "Clients",
        restaurants: "Restaurants",
        installations: "Installations",
        licenses: "Licenses",
        maintenance: "Maintenance",
        settings: "Settings",
      },
      stats: {
        totalClients: "Total clients",
        activeInstallations: "Active installations",
        expiringSoon: "Expiring soon (30 days)",
        suspended: "Suspended",
        ordersMonth: "Monthly orders",
        revenueMonth: "Monthly volume",
      },
      table: {
        restaurant: "Restaurant",
        country: "Country",
        licenseStatus: "License status",
        expiresAt: "Expires",
        pluginVersion: "Plugin",
        lastSync: "Last sync",
        ordersMonth: "Orders / mo",
        revenueMonth: "Volume / mo",
      },
      mockBadge: "Mock data — SaaS phase",
    },
    portal: {
      title: "Kitch Portal",
      subtitle: "Your membership and operations",
      nav: {
        overview: "Overview",
        membership: "Membership",
        installation: "Installation",
        billing: "Billing",
        support: "Support",
      },
      membership: {
        title: "Membership status",
        plan: "Plan",
        expiresAt: "Expires on",
        renew: "Renew membership",
        contactSupport: "Contact support",
      },
      installation: {
        title: "Your installation",
        siteUrl: "Website",
        pluginVersion: "Plugin version",
        lastValidation: "Last validation",
        lastSync: "Last sync",
        apiKey: "API Key",
        apiKeyNote: "Only the last 4 characters are shown for security.",
      },
      billing: {
        title: "Payment history",
        date: "Date",
        description: "Description",
        amount: "Amount",
        status: "Status",
      },
      support: {
        title: "Support",
        body: "Need help with your installation or membership? Our team is here to help.",
        cta: "Open support ticket",
      },
      paymentStatus: {
        paid: "Paid",
        pending: "Pending",
        failed: "Failed",
        refunded: "Refunded",
      },
    },
    licenseStatus: {
      active: "Active",
      past_due: "Past due",
      grace_period: "Grace period",
      suspended: "Suspended",
      cancelled: "Cancelled",
      maintenance_required: "Maintenance",
      license_unknown: "Unknown",
    } satisfies Record<LicenseStatus, string>,
    countries: { CO: "Colombia", US: "United States" } as Record<string, string>,
  },
} as const;

export function getSaasDictionary(locale: Locale): SaasDictionary {
  return saasDictionaries[locale];
}

export function formatSaasDate(iso: string | null, locale: Locale): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatSaasCurrency(
  amount: number,
  currency: string,
  locale: Locale,
): string {
  const normalized =
    currency === "COP"
      ? amount
      : currency === "USD" && amount > 1000
        ? amount / 100
        : amount;

  return new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(normalized);
}
