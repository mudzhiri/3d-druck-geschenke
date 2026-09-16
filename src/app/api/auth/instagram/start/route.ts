import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { isCustomProviderConfigured } from "@/lib/auth/providers";

/**
 * Instagram Login via Meta Instagram API with Instagram Login
 * (Business Login). Requires INSTAGRAM_CLIENT_ID / SECRET.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/de/account";
  const locale = searchParams.get("locale") ?? "de";

  if (!isCustomProviderConfigured("instagram")) {
    return NextResponse.redirect(
      `${origin}/${locale}/login?error=${encodeURIComponent(
        "Instagram Login: INSTAGRAM_CLIENT_ID / INSTAGRAM_CLIENT_SECRET setzen (Meta Developer → Instagram).",
      )}`,
    );
  }

  const clientId = process.env.INSTAGRAM_CLIENT_ID!.trim();
  const state = randomBytes(16).toString("hex");
  const redirectUri = `${origin}/api/auth/instagram/callback`;

  // Instagram API with Instagram Login (OAuth)
  const url = new URL("https://www.instagram.com/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "instagram_business_basic");
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url.toString());
  res.cookies.set("ig_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  res.cookies.set("ig_oauth_next", next, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
