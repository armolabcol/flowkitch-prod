import { NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/env";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  const { supabase, jsonResponse } = createRouteHandlerSupabase(request);

  const redirectTo = `${env.siteUrl.replace(/\/+$/, "")}/auth/callback?next=/es/portal/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return jsonResponse(
      { error: error.message, code: error.code ?? "reset_failed" },
      { status: 400 },
    );
  }

  // Always success — avoid email enumeration
  return jsonResponse({ ok: true });
}
