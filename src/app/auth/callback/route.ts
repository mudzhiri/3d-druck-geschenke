import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * OAuth / magic-link callback — writes session cookies onto the redirect response.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const oauthDesc = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/de/account";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/de/account";

  if (oauthError) {
    const msg = encodeURIComponent(oauthDesc || oauthError);
    return NextResponse.redirect(`${origin}/de/login?error=${msg}`);
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      `${origin}/de/login?error=${encodeURIComponent("Supabase is not configured.")}`,
    );
  }

  if (code) {
    const cookieStore = await cookies();
    const redirectResponse = NextResponse.redirect(`${origin}${safeNext}`);

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback]", error.message);
      return NextResponse.redirect(
        `${origin}/de/login?error=${encodeURIComponent(error.message)}`,
      );
    }

    return redirectResponse;
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
