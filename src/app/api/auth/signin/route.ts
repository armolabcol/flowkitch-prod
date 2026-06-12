import { NextRequest } from "next/server";
import { isAdminRole, isClientRole, isKnownRole } from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/env";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";
import type { UserRole } from "@/types/saas";

function redirectForRole(role: UserRole): "admin" | "portal" {
  if (isAdminRole(role)) return "admin";
  if (isClientRole(role)) return "portal";
  return "portal";
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "Supabase not configured", code: "config" }, {
      status: 503,
    });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON", code: "invalid_json" }, {
      status: 400,
    });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return Response.json(
      { error: "Email and password required", code: "missing_fields" },
      { status: 400 },
    );
  }

  const { supabase, jsonResponse } = createRouteHandlerSupabase(request);

  const { data: authData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    return jsonResponse(
      {
        error: signInError.message,
        code: signInError.code ?? "sign_in_failed",
      },
      { status: 401 },
    );
  }

  if (!authData.user) {
    return jsonResponse(
      { error: "Sign in failed", code: "sign_in_failed" },
      { status: 401 },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle<{ role: string }>();

  if (profileError) {
    await supabase.auth.signOut();
    return jsonResponse(
      {
        error: profileError.message || "Profile lookup failed",
        code: "profile_error",
      },
      { status: 403 },
    );
  }

  const role = profile?.role;
  if (!role || !isKnownRole(role)) {
    await supabase.auth.signOut();
    return jsonResponse(
      {
        error:
          "No encontramos tu perfil. Contacta a soporte ARMO para activar tu acceso.",
        code: "profile_missing",
      },
      { status: 403 },
    );
  }

  const userRole = role as UserRole;

  return jsonResponse({
    ok: true,
    role: userRole,
    redirect: redirectForRole(userRole),
  });
}
