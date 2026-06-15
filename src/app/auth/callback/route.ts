import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";
import {
  absoluteAppPath,
  appOrigin,
  mapSupabaseAuthError,
  redirectToLogin,
} from "@/lib/auth/callback-redirect";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return redirectToLogin();
  }

  const { searchParams } = new URL(request.url);
  const authError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  if (authError || errorCode) {
    return redirectToLogin(mapSupabaseAuthError(errorCode));
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/es/portal";

  const { supabase, applyCookiesTo } = createRouteHandlerSupabase(request);

  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (error) {
      return redirectToLogin("reset_link_expired");
    }

    const dest = next.startsWith("/") ? next : `/${next}`;
    return applyCookiesTo(NextResponse.redirect(absoluteAppPath(dest)));
  }

  if (!code) {
    return redirectToLogin("callback_failed");
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectToLogin("reset_link_expired");
  }

  const dest = next.startsWith("/") ? next : `/${next}`;
  return applyCookiesTo(NextResponse.redirect(absoluteAppPath(dest)));
}
