"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { authCallbackUrl } from "@/lib/auth/providers";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

export function MagicLinkForm({ locale, next }: { locale: Locale; next: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error(t(locale, "auth_supabase_missing"));
      }
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: authCallbackUrl(window.location.origin, next),
        },
      });
      if (authError) throw authError;
      setMessage(t(locale, "auth_magic_sent"));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-3">
      <label className="block text-xs font-extrabold uppercase tracking-wide text-muted">
        {t(locale, "auth_email")}
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus-ring mt-2 w-full rounded-md border-2 border-ink bg-paper px-3 py-3 text-sm font-medium normal-case"
          placeholder="you@email.com"
          autoComplete="email"
        />
      </label>
      <button type="submit" disabled={loading} className="btn-ghost w-full px-4 py-3 text-sm disabled:opacity-50">
        {loading ? "…" : t(locale, "auth_magic_send")}
      </button>
      {message && <p className="text-sm font-medium text-ink">{message}</p>}
      {error && <p className="text-sm text-coral">{error}</p>}
    </form>
  );
}
