import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { authCallbackUrl } from "@/lib/auth/providers";
import type { Provider } from "@supabase/supabase-js";

const ALLOWED: Provider[] = ["google", "facebook", "azure"];

/**
 * Starts native OAuth via a server preflight so disabled providers
 * redirect back to login with a clear error instead of raw Supabase JSON.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const provider = searchParams.get("provider") as Provider | null;
  const next = searchParams.get("next") ?? "/de/account";
  const locale = searchParams.get("locale") ?? "de";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : `/${locale}/account`;
  const login = `${origin}/${locale}/login?next=${encodeURIComponent(safeNext)}`;

  if (!provider || !ALLOWED.includes(provider)) {
    return NextResponse.redirect(
      `${login}&error=${encodeURIComponent("Unbekannter Login-Provider.")}`,
    );
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey.includes("[SENSITIVE]")) {
    return NextResponse.redirect(
      `${login}&error=${encodeURIComponent("Supabase ist noch nicht konfiguriert.")}`,
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const redirectTo = authCallbackUrl(origin, safeNext);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams:
        provider === "google" || provider === "azure"
          ? { prompt: "select_account" }
          : undefined,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      `${login}&error=${encodeURIComponent(error?.message || "OAuth start failed")}`,
    );
  }

  // Preflight: disabled providers return 400 JSON instead of a 302 to Google/etc.
  try {
    const probe = await fetch(data.url, { method: "GET", redirect: "manual" });
    const location = probe.headers.get("location");
    if (probe.status >= 400) {
      let msg = "Dieser Login-Provider ist in Supabase noch nicht aktiviert.";
      try {
        const body = (await probe.json()) as { msg?: string };
        if (body.msg) msg = body.msg;
      } catch {
        /* ignore */
      }
      if (/provider is not enabled/i.test(msg)) {
        msg =
          locale === "de"
            ? "Social Login noch nicht aktiv — bitte E-Mail/Passwort nutzen oder Provider in Supabase einschalten."
            : "Social login is not enabled yet — use email/password or enable the provider in Supabase.";
      }
      return NextResponse.redirect(`${login}&error=${encodeURIComponent(msg)}`);
    }
    if (location) {
      return NextResponse.redirect(location);
    }
  } catch {
    // Network probe failed — fall through to authorize URL
  }

  return NextResponse.redirect(data.url);
}
