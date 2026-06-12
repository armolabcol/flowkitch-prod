import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/es/portal/login", request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/es/portal";

  if (code) {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/es/portal/login`);
}
