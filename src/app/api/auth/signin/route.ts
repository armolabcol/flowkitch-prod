import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";
import { isAdminRole, isKnownRole } from "@/lib/auth/roles";
import type { UserRole } from "@/types/saas";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  let body: { email?: string; password?: string; audience?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    env.supabaseUrl!,
    env.supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { data: authData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    return NextResponse.json(
      {
        error: signInError.message,
        code: signInError.code ?? "sign_in_failed",
      },
      { status: 401 },
    );
  }

  if (!authData.user) {
    return NextResponse.json({ error: "Sign in failed" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle<{ role: string }>();

  if (profileError) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Profile lookup failed", code: "profile_error" },
      { status: 403 },
    );
  }

  const role = profile?.role;
  if (!role || !isKnownRole(role)) {
    await supabase.auth.signOut();
    return NextResponse.json(
      {
        error: "Profile not configured",
        code: "profile_missing",
        hint:
          "Ensure public.profiles.id matches auth.users.id for this email.",
      },
      { status: 403 },
    );
  }

  const userRole = role as UserRole;
  const audience = body.audience === "admin" ? "admin" : "portal";

  if (audience === "admin" && !isAdminRole(userRole)) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Not authorized for admin", code: "wrong_audience" },
      { status: 403 },
    );
  }

  if (audience === "portal" && isAdminRole(userRole)) {
    // Admins may use portal login — send them to admin
    return NextResponse.json({ role: userRole, redirect: "admin" });
  }

  if (audience === "portal" && !isAdminRole(userRole)) {
    return NextResponse.json({ role: userRole, redirect: "portal" });
  }

  return NextResponse.json({ role: userRole, redirect: "admin" });
}
