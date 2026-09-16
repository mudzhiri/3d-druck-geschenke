import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionForExternalIdentity } from "@/lib/auth/external-session";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const err = searchParams.get("error");
  const cookieStore = await cookies();
  const savedState = cookieStore.get("ig_oauth_state")?.value;
  const next = cookieStore.get("ig_oauth_next")?.value ?? "/de/account";

  const fail = (msg: string) =>
    NextResponse.redirect(`${origin}/de/login?error=${encodeURIComponent(msg)}`);

  if (err) return fail(err);
  if (!code || !state || !savedState || state !== savedState) {
    return fail("Instagram OAuth state invalid.");
  }

  const clientId = process.env.INSTAGRAM_CLIENT_ID?.trim();
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return fail("Instagram credentials missing.");

  try {
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: `${origin}/api/auth/instagram/callback`,
        code,
      }),
    });
    const tokenJson = (await tokenRes.json()) as {
      access_token?: string;
      user_id?: number | string;
      error_message?: string;
    };
    if (!tokenRes.ok || !tokenJson.access_token || !tokenJson.user_id) {
      throw new Error(tokenJson.error_message || "Instagram token failed");
    }

    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${tokenJson.access_token}`,
    );
    const me = (await meRes.json()) as { id?: string; username?: string };

    const actionLink = await createSessionForExternalIdentity({
      provider: "instagram",
      providerUserId: String(me.id || tokenJson.user_id),
      name: me.username ? `@${me.username}` : null,
      origin,
      next,
    });

    const res = NextResponse.redirect(actionLink);
    res.cookies.delete("ig_oauth_state");
    res.cookies.delete("ig_oauth_next");
    return res;
  } catch (e) {
    console.error("[instagram/callback]", e);
    return fail(e instanceof Error ? e.message : "Instagram login failed");
  }
}
