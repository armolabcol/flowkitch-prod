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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: string }>();

  const role = profile?.role as UserRole | undefined;

  return {
    response: supabaseResponse,
    userId: user.id,
    role: role ?? null,
  };
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

  if (path.startsWith("/admin") && (!role || !isAdminRole(role))) {
    const portalUrl = request.nextUrl.clone();
    portalUrl.pathname = withLocale(locale, "/portal");
    return NextResponse.redirect(portalUrl);
  }

  if (
    (path === "/portal" || path.startsWith("/portal/")) &&
    (!role || !isClientRole(role))
  ) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = withLocale(locale, "/admin");
    return NextResponse.redirect(adminUrl);
  }

  return response;
}
