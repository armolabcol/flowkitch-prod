export const mainNav = [
  { key: "product" as const, href: "/product" },
  { key: "restaurants" as const, href: "/restaurants" },
  { key: "waiters" as const, href: "/waiters" },
  { key: "kitchen" as const, href: "/kitchen" },
  { key: "manager" as const, href: "/manager" },
  { key: "demo" as const, href: "/demo" },
  { key: "portal" as const, href: "/portal/login" },
];

export type NavKey = (typeof mainNav)[number]["key"];
