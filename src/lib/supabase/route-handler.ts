import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export type RouteCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

/** Supabase client for Route Handlers — collects cookies for the final response */
export function createRouteHandlerSupabase(request: NextRequest) {
  const pendingCookies: RouteCookie[] = [];

  const supabase = createServerClient<Database>(
    env.supabaseUrl!,
    env.supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            pendingCookies.push({ name, value, options });
          });
        },
      },
    },
  );

  function applyCookiesTo(response: NextResponse) {
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  function jsonResponse<T>(body: T, init?: ResponseInit) {
    return applyCookiesTo(NextResponse.json(body, init));
  }

  return { supabase, jsonResponse, applyCookiesTo };
}
