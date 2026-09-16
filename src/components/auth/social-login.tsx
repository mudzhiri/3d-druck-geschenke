"use client";

import { useMemo, useState } from "react";
import {
  socialProviders,
  type SocialProvider,
} from "@/lib/auth/providers";
import { isSupabaseConfigured } from "@/lib/supabase/env";
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
  const safeNext = next.startsWith("/") ? next : `/${locale}/account`;

  // Custom providers only if server env keys exist (exposed via optional public flags)
  const providers = useMemo(() => {
    return socialProviders.filter((p) => {
      if (p.kind === "custom") {
        // Client cannot read secrets — show only when public flag set
        if (p.id === "tiktok") return process.env.NEXT_PUBLIC_AUTH_TIKTOK === "true";
        if (p.id === "instagram") return process.env.NEXT_PUBLIC_AUTH_INSTAGRAM === "true";
        return false;
      }
      // Only show providers that are explicitly enabled (avoids broken OAuth buttons)
      if (p.id === "google") return process.env.NEXT_PUBLIC_AUTH_GOOGLE === "true";
      if (p.id === "facebook") return process.env.NEXT_PUBLIC_AUTH_FACEBOOK === "true";
      if (p.id === "azure") return process.env.NEXT_PUBLIC_AUTH_MICROSOFT === "true";
      return false;
    });
  }, []);

  function startNative(provider: SocialProvider) {
    if (!provider.supabase) return;
    setLoading(provider.id);
    setError(null);
    if (!configured) {
      setError(t(locale, "auth_supabase_missing"));
      setLoading(null);
      return;
    }
    // Server preflight → clean error redirect if provider disabled
    window.location.assign(
      `/api/auth/oauth/start?provider=${provider.supabase}&next=${encodeURIComponent(safeNext)}&locale=${locale}`,
    );
  }

  function startCustom(provider: SocialProvider) {
    setLoading(provider.id);
    setError(null);
    window.location.assign(
      `/api/auth/${provider.id}/start?next=${encodeURIComponent(safeNext)}&locale=${locale}`,
    );
  }

  if (!providers.length) {
    return (
      <p className="border-2 border-ink bg-fog p-3 text-sm text-ink/80">
        {t(locale, "auth_social_soon")}
      </p>
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
        {providers.map((p) => (
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
        <p className="border-2 border-ink bg-fog p-3 text-sm text-ink/80">
          {mapAuthError(error, locale)}
        </p>
      )}
    </div>
  );
}
