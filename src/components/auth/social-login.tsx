"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  authCallbackUrl,
  socialProviders,
  type SocialProvider,
} from "@/lib/auth/providers";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

function mapAuthError(raw: string, locale: Locale) {
  if (/provider is not enabled/i.test(raw)) {
    return t(locale, "auth_provider_disabled");
  }
  if (/redirect/i.test(raw)) {
    return t(locale, "auth_redirect_missing");
  }
  if (/not configured|supabase/i.test(raw)) {
    return t(locale, "auth_supabase_missing");
  }
  return raw;
}

export function SocialLoginButtons({
  locale,
  next,
}: {
  locale: Locale;
  next: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const configured = useMemo(() => isSupabaseConfigured(), []);

  async function startNative(provider: SocialProvider) {
    if (!provider.supabase) return;
    setLoading(provider.id);
    setError(null);
    try {
      if (!configured) throw new Error("Supabase is not configured");
      const supabase = createClient();
      const redirectTo = authCallbackUrl(window.location.origin, next);
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: provider.supabase,
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams:
            provider.supabase === "google"
              ? { access_type: "offline", prompt: "select_account" }
              : provider.supabase === "azure"
                ? { prompt: "select_account" }
                : undefined,
        },
      });
      if (authError) throw authError;
      if (!data.url) throw new Error("No OAuth URL returned");
      window.location.assign(data.url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(mapAuthError(msg, locale));
      setLoading(null);
    }
  }

  function startCustom(provider: SocialProvider) {
    setLoading(provider.id);
    setError(null);
    const safeNext = next.startsWith("/") ? next : `/${locale}/account`;
    window.location.assign(
      `/api/auth/${provider.id}/start?next=${encodeURIComponent(safeNext)}&locale=${locale}`,
    );
  }

  return (
    <div className="space-y-3">
      {!configured && (
        <p className="border-2 border-ink bg-yellow p-3 text-sm font-medium">
          {t(locale, "auth_supabase_missing")}
        </p>
      )}
      <div className="grid gap-2">
        {socialProviders.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={Boolean(loading) || !configured}
            onClick={() =>
              void (p.kind === "native" ? startNative(p) : startCustom(p))
            }
            className="focus-ring flex w-full items-center justify-center gap-3 border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold uppercase transition hover:bg-fog disabled:opacity-50"
          >
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: p.accent }}
              aria-hidden
            />
            {loading === p.id
              ? t(locale, "auth_redirecting")
              : `${t(locale, "auth_continue_with")} ${p.label[locale]}`}
          </button>
        ))}
      </div>
      {error && (
        <p className="border-2 border-ink bg-fog p-3 text-sm text-ink/80">{error}</p>
      )}
    </div>
  );
}
