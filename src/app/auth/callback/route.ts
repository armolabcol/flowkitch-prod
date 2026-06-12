import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/es/portal/login", request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/es/portal";

  if (!code) {
    return NextResponse.redirect(`${origin}/es/portal/login`);
  }

  const { supabase, applyCookiesTo } = createRouteHandlerSupabase(request);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const login = new URL("/es/portal/login", origin);
    login.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(login.toString());
  }

  return applyCookiesTo(
    NextResponse.redirect(`${origin}${next}`),
  );
}
