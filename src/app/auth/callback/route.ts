import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { sendWelcomeEmail } from "@/lib/email/transactional";

/**
 * OAuth / magic-link callback — writes session cookies onto the redirect response.
 * Sends welcome email for brand-new accounts (created within the last few minutes).
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      const createdAt = new Date(user.created_at).getTime();
      const isNew = Date.now() - createdAt < 5 * 60 * 1000;
      if (isNew) {
        const locale = safeNext.match(/^\/(de|en|fr|es|it|zh)\b/)?.[1] ?? "de";
        const name =
          (user.user_metadata?.full_name as string | undefined) ||
          (user.user_metadata?.name as string | undefined) ||
          user.email.split("@")[0];
        void sendWelcomeEmail({ to: user.email, name, locale }).catch((err) => {
          console.error("[auth/callback] welcome email", err);
        });
      }
    }

    return redirectResponse;
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
