"use client";

import { useState } from "react";
import type { Locale } from "@/lib/brand";
import { brand } from "@/lib/brand";
import { t } from "@/lib/i18n";

export function ContactForm({ locale }: { locale: Locale }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          topic: String(fd.get("topic") ?? "Allgemein"),
          message: String(fd.get("message") ?? ""),
          website: String(fd.get("website") ?? ""),
          locale,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setDone(true);
      e.currentTarget.reset();
    } catch {
      setError(t(locale, "contact_form_error"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="border-2 border-ink bg-yellow p-6">
        <p className="font-extrabold uppercase">{t(locale, "contact_form_thanks")}</p>
        <p className="mt-2 text-sm">{t(locale, "contact_form_thanks_body")}</p>
        <p className="mt-3 text-sm">
          → <a className="font-extrabold underline" href={`mailto:${brand.infoEmail}`}>{brand.infoEmail}</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 border-2 border-ink bg-fog p-6">
      <p className="text-xs font-extrabold uppercase tracking-wide text-muted">
        {t(locale, "contact_form_title")} → {brand.infoEmail}
      </p>
      <input
        name="name"
        required
        placeholder={t(locale, "contact_form_name")}
        className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-3"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="you@email.com"
        className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-3"
      />
      <select
        name="topic"
        className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-3"
        defaultValue="Allgemein"
      >
        <option value="Allgemein">{t(locale, "contact_topic_general")}</option>
        <option value="Bestellung">{t(locale, "contact_topic_order")}</option>
        <option value="Retoure">{t(locale, "contact_topic_return")}</option>
        <option value="Presse">{t(locale, "contact_topic_press")}</option>
      </select>
      <textarea
        name="message"
        required
        rows={5}
        placeholder={t(locale, "contact_form_message")}
        className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-3"
      />
      {/* honeypot */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <button type="submit" disabled={loading} className="btn-feast w-full px-5 py-3 text-sm disabled:opacity-50">
        {loading ? "…" : t(locale, "contact_form_send")}
      </button>
      {error && <p className="text-sm text-coral">{error}</p>}
    </form>
  );
}
