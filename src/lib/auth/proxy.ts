import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";
import {
  defaultLocale,
  isLocale,
  stripLocaleFromPathname,
  withLocale,
  type Locale,
} from "@/lib/i18n";
import { isAdminRole, isClientRole } from "@/lib/auth/roles";
import { fetchProfileRole } from "@/lib/auth/profile-lookup";
import type { UserRole } from "@/types/saas";

const PORTAL_LOGIN = "/portal/login";
const PUBLIC_PORTAL_PATHS = new Set([
  PORTAL_LOGIN,
  "/portal/reset-password",
]);

function pickLocale(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : defaultLocale;
}

function isSaasProtectedPath(path: string): boolean {
  return (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path === "/portal" ||
    path.startsWith("/portal/")
  );
}

function isPublicSaasPath(path: string): boolean {
  return path === "/admin/login" || PUBLIC_PORTAL_PATHS.has(path);
}

/** Routes that need session refresh + role checks (skip marketing for Hostinger limits) */
export function needsSaasAuth(path: string): boolean {
  return isSaasProtectedPath(path) && !isPublicSaasPath(path);
}

export async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse,
): Promise<{ response: NextResponse; userId: string | null; role: UserRole | null }> {
  if (!isSupabaseConfigured()) {
    return { response, userId: null, role: null };
  }

  let supabaseResponse = response;

  const supabase = createServerClient<Database>(
    env.supabaseUrl!,
    env.supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          });
          response.headers.forEach((value, key) => {
            supabaseResponse.headers.set(key, value);
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { response: supabaseResponse, userId: null, role: null };
  }

  try {
    const { role: profileRole } = await fetchProfileRole(user.id, supabase);
    return {
      response: supabaseResponse,
      userId: user.id,
      role: (profileRole as UserRole | undefined) ?? null,
    };
  } catch {
    return { response: supabaseResponse, userId: user.id, role: null };
  }
}

export function enforceSaasRouteAccess(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  userId: string | null,
  role: UserRole | null,
): NextResponse {
  if (!isSupabaseConfigured()) return response;

  const path = stripLocaleFromPathname(pathname);
  if (!isSaasProtectedPath(path) || isPublicSaasPath(path)) {
    if (path === "/admin/login") {
      const locale = pickLocale(pathname);
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = withLocale(locale, PORTAL_LOGIN);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const locale = pickLocale(pathname);
  const loginUrl = request.nextUrl.clone();

  if (!userId) {
    loginUrl.pathname = withLocale(locale, PORTAL_LOGIN);
    return NextResponse.redirect(loginUrl);
  }

  if (!role) {
    loginUrl.pathname = withLocale(locale, PORTAL_LOGIN);
    loginUrl.searchParams.set("error", "profile_error");
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/admin") && !isAdminRole(role)) {
    const portalUrl = request.nextUrl.clone();
    portalUrl.pathname = withLocale(locale, "/portal");
    return NextResponse.redirect(portalUrl);
  }

  if (
    (path === "/portal" || path.startsWith("/portal/")) &&
    !isClientRole(role)
  ) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = withLocale(locale, "/admin");
    return NextResponse.redirect(adminUrl);
  }

  return response;
}
