import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { isCustomProviderConfigured } from "@/lib/auth/providers";

function pkce() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/de/account";
  const locale = searchParams.get("locale") ?? "de";

  if (!isCustomProviderConfigured("tiktok")) {
    return NextResponse.redirect(
      `${origin}/${locale}/login?error=${encodeURIComponent(
        "TikTok Login: TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET in Env setzen (TikTok Developer Portal).",
      )}`,
    );
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY!.trim();
  const { verifier, challenge } = pkce();
  const state = randomBytes(16).toString("hex");
  const redirectUri = `${origin}/api/auth/tiktok/callback`;

  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("scope", "user.info.basic");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  const res = NextResponse.redirect(url.toString());
  res.cookies.set("tt_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  res.cookies.set("tt_oauth_verifier", verifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  res.cookies.set("tt_oauth_next", next, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
