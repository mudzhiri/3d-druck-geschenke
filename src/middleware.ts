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
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
