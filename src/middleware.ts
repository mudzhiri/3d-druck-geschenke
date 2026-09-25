import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { activeLocales, defaultLocale, type Locale } from "@/lib/brand";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

function preferLocale(header: string): Locale {
  const tags = header
    .toLowerCase()
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter(Boolean);

  for (const tag of tags) {
    const primary = tag.slice(0, 2) as Locale;
    if (activeLocales.includes(primary)) return primary;
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  // Canonical host www + permanent redirects (avoids GSC "Seite mit Weiterleitung" soft 307 noise)
  if (
    host === "3d-druck-geschenke.de" ||
    host === "personalisierte-3d-geschenke.de" ||
    host === "www.personalisierte-3d-geschenke.de"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "www.3d-druck-geschenke.de";
    return NextResponse.redirect(url, 308);
  }

  // Auth + API + static — no locale redirect
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  // Refresh Supabase session cookies when configured
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    await supabase.auth.getUser();
  }

  const hasLocale = activeLocales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return response;

  const locale = preferLocale(request.headers.get("accept-language") ?? "");
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // 308 permanent — root and bare paths always resolve to a locale URL
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
