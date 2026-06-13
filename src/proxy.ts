import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, stripLocaleFromPathname, withLocale, type Locale } from "@/lib/i18n";
import { LOCALE_HEADER } from "@/lib/locale-header";

function pickLocaleFromPath(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) return first;
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/videos/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/api/health" ||
    /\.(webp|png|jpg|jpeg|gif|svg|ico|mp4|webm|woff2?)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  const locale = pickLocaleFromPath(pathname);

  if (!locale) {
    const isAsset =
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/auth") ||
      /\.[a-zA-Z0-9]+$/.test(pathname);

    if (!isAsset) {
      const url = request.nextUrl.clone();
      url.pathname = `/${defaultLocale}${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale ?? defaultLocale);

  const path = stripLocaleFromPathname(pathname);

  if (path === "/admin/login") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = withLocale(locale ?? defaultLocale, "/portal/login");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
