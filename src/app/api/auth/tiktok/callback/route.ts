import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionForExternalIdentity } from "@/lib/auth/external-session";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const err = searchParams.get("error");
  const cookieStore = await cookies();
  const savedState = cookieStore.get("tt_oauth_state")?.value;
  const verifier = cookieStore.get("tt_oauth_verifier")?.value;
  const next = cookieStore.get("tt_oauth_next")?.value ?? "/de/account";

  const fail = (msg: string) =>
    NextResponse.redirect(`${origin}/de/login?error=${encodeURIComponent(msg)}`);

  if (err) return fail(err);
  if (!code || !state || !savedState || state !== savedState || !verifier) {
    return fail("TikTok OAuth state invalid.");
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY?.trim();
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET?.trim();
  if (!clientKey || !clientSecret) return fail("TikTok credentials missing.");

  try {
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${origin}/api/auth/tiktok/callback`,
        code_verifier: verifier,
      }),
    });
    const tokenJson = (await tokenRes.json()) as {
      access_token?: string;
      open_id?: string;
      error?: string;
      error_description?: string;
    };
    if (!tokenRes.ok || !tokenJson.access_token || !tokenJson.open_id) {
      throw new Error(tokenJson.error_description || tokenJson.error || "TikTok token failed");
    }

    const userRes = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url",
      { headers: { Authorization: `Bearer ${tokenJson.access_token}` } },
    );
    const userJson = (await userRes.json()) as {
      data?: { user?: { open_id?: string; display_name?: string; avatar_url?: string } };
    };
    const user = userJson.data?.user;
    const openId = user?.open_id || tokenJson.open_id;

    const actionLink = await createSessionForExternalIdentity({
      provider: "tiktok",
      providerUserId: openId,
      name: user?.display_name,
      avatarUrl: user?.avatar_url,
      origin,
      next,
    });

    const res = NextResponse.redirect(actionLink);
    res.cookies.delete("tt_oauth_state");
    res.cookies.delete("tt_oauth_verifier");
    res.cookies.delete("tt_oauth_next");
    return res;
  } catch (e) {
    console.error("[tiktok/callback]", e);
    return fail(e instanceof Error ? e.message : "TikTok login failed");
  }
}
