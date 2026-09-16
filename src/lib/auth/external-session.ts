import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * After custom OAuth (TikTok / Instagram), create or reuse a Supabase user
 * and return a magic-link style verify URL for session establishment.
 */
export async function createSessionForExternalIdentity(input: {
  provider: "tiktok" | "instagram";
  providerUserId: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  origin: string;
  next: string;
}) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const { supabaseUrl } = getSupabasePublicEnv();
  if (!serviceKey || !supabaseUrl) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY fehlt — nötig für TikTok/Instagram Login.",
    );
  }

  const admin = createServiceClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const syntheticEmail =
    input.email?.trim().toLowerCase() ||
    `${input.provider}_${input.providerUserId}@oauth.3d-druck-geschenke.local`;

  const safeNext =
    input.next.startsWith("/") && !input.next.startsWith("//")
      ? input.next
      : "/de/account";

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: syntheticEmail,
    options: {
      data: {
        full_name: input.name ?? undefined,
        avatar_url: input.avatarUrl ?? undefined,
        oauth_provider: input.provider,
        oauth_provider_id: input.providerUserId,
      },
      redirectTo: `${input.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  });

  if (linkError) {
    // User may not exist — create then retry
    const { error: createError } = await admin.auth.admin.createUser({
      email: syntheticEmail,
      email_confirm: true,
      user_metadata: {
        full_name: input.name ?? undefined,
        avatar_url: input.avatarUrl ?? undefined,
        oauth_provider: input.provider,
        oauth_provider_id: input.providerUserId,
      },
    });
    if (createError && !/already|registered|exists/i.test(createError.message)) {
      throw createError;
    }

    const retry = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: syntheticEmail,
      options: {
        redirectTo: `${input.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      },
    });
    if (retry.error || !retry.data.properties?.action_link) {
      throw retry.error ?? new Error("Could not generate login link");
    }
    return retry.data.properties.action_link;
  }

  const action = linkData.properties?.action_link;
  if (!action) throw new Error("Could not generate login link");
  return action;
}
