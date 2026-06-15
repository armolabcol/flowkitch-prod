import { NextResponse } from "next/server";
import { env } from "@/lib/env";

/** Canonical app origin — use env.siteUrl, not request.url (Hostinger/proxy safe). */
export function appOrigin(): string {
  return env.siteUrl.replace(/\/+$/, "");
}

export function absoluteAppPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${appOrigin()}${normalized}`;
}

export function redirectToLogin(error?: string) {
  const url = new URL("/es/portal/login", appOrigin());
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url.toString());
}

export function mapSupabaseAuthError(errorCode: string | null): string {
  if (errorCode === "otp_expired") return "reset_link_expired";
  return "callback_failed";
}
