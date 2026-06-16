import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return Response.json({ ok: true });
  }

  const { supabase, jsonResponse } = createRouteHandlerSupabase(request);
  const { error } = await supabase.auth.signOut();

  if (error) {
    return jsonResponse(
      { ok: false, error: error.message, code: error.code ?? "sign_out_failed" },
      { status: 400 },
    );
  }

  return jsonResponse({ ok: true });
}
