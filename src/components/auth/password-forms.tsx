"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { authCallbackUrl } from "@/lib/auth/providers";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

export function PasswordLoginForm({
  locale,
  next,
}: {
  locale: Locale;
  next: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) throw new Error(t(locale, "auth_supabase_missing"));
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus-ring mt-2 w-full rounded-md border-2 border-ink bg-paper px-3 py-3 text-sm font-medium normal-case"
        />
      </label>
      <label className="block text-xs font-extrabold uppercase tracking-wide text-muted">
        {t(locale, "auth_password")}
        <input
          required
          type="password"
          minLength={8}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus-ring mt-2 w-full rounded-md border-2 border-ink bg-paper px-3 py-3 text-sm font-medium normal-case"
        />
      </label>
      <button type="submit" disabled={loading} className="btn-feast w-full px-4 py-3 text-sm disabled:opacity-50">
        {loading ? "…" : t(locale, "auth_sign_in")}
      </button>
      {error && <p className="text-sm text-coral">{error}</p>}
      <p className="text-center text-sm">
        <Link href={`/${locale}/register?next=${encodeURIComponent(next)}`} className="font-extrabold uppercase underline">
          {t(locale, "auth_create_account")}
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ locale, next }: { locale: Locale; next: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!isSupabaseConfigured()) throw new Error(t(locale, "auth_supabase_missing"));
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, name },
          emailRedirectTo: authCallbackUrl(window.location.origin, next),
        },
      });
      if (authError) throw authError;

      // Welcome mail (our template) — works even if Supabase confirm-email is on
      await fetch("/api/account/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, locale }),
      });

      if (data.session) {
        window.location.href = next;
        return;
      }

      setMessage(t(locale, "auth_register_check_email"));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-3">
      <label className="block text-xs font-extrabold uppercase tracking-wide text-muted">
        {t(locale, "auth_name")}
        <input
          required
          minLength={2}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus-ring mt-2 w-full rounded-md border-2 border-ink bg-paper px-3 py-3 text-sm font-medium normal-case"
        />
      </label>
      <label className="block text-xs font-extrabold uppercase tracking-wide text-muted">
        {t(locale, "auth_email")}
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus-ring mt-2 w-full rounded-md border-2 border-ink bg-paper px-3 py-3 text-sm font-medium normal-case"
        />
      </label>
      <label className="block text-xs font-extrabold uppercase tracking-wide text-muted">
        {t(locale, "auth_password")}
        <input
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus-ring mt-2 w-full rounded-md border-2 border-ink bg-paper px-3 py-3 text-sm font-medium normal-case"
        />
      </label>
      <button type="submit" disabled={loading} className="btn-feast w-full px-4 py-3 text-sm disabled:opacity-50">
        {loading ? "…" : t(locale, "auth_register_submit")}
      </button>
      {message && <p className="text-sm font-medium text-ink">{message}</p>}
      {error && <p className="text-sm text-coral">{error}</p>}
      <p className="text-center text-sm">
        <Link href={`/${locale}/login?next=${encodeURIComponent(next)}`} className="font-extrabold uppercase underline">
          {t(locale, "auth_sign_in")}
        </Link>
      </p>
    </form>
  );
}
