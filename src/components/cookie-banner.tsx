"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

const CONSENT_COOKIE = "pl_consent";

function readConsent(): "essential" | "analytics" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  const value = match.split("=")[1];
  if (value === "analytics" || value === "essential") return value;
  return null;
}

function writeConsent(value: "essential" | "analytics") {
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function CookieBanner({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    setVisible(!readConsent());
    const open = () => {
      setOpenSettings(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", open);
    return () => window.removeEventListener("open-cookie-settings", open);
  }, []);

  function acceptAll() {
    writeConsent("analytics");
    setVisible(false);
    setOpenSettings(false);
  }

  function essentialOnly() {
    writeConsent("essential");
    setVisible(false);
    setOpenSettings(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t(locale, "cookie_title")}
      className="fixed inset-x-0 bottom-0 z-[60] border-t-2 border-ink bg-paper p-4 shadow-[0_-8px_0_rgba(10,10,10,0.06)] md:p-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="display text-2xl font-black">{t(locale, "cookie_title")}</p>
          <p className="mt-2 text-sm text-ink/75">
            {t(locale, "cookie_body")}{" "}
            <Link href={`/${locale}/legal/cookies`} className="font-extrabold underline">
              {t(locale, "legal_cookies")}
            </Link>
            {" · "}
            <Link href={`/${locale}/legal/datenschutz`} className="font-extrabold underline">
              {t(locale, "legal_privacy")}
            </Link>
          </p>
          {openSettings && (
            <ul className="mt-3 space-y-1 text-xs text-ink/70">
              <li>• {t(locale, "cookie_essential")}</li>
              <li>• {t(locale, "cookie_analytics")}</li>
            </ul>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={essentialOnly} className="btn-ghost px-4 py-2 text-xs">
            {t(locale, "cookie_essential_only")}
          </button>
          <button
            type="button"
            onClick={() => setOpenSettings(true)}
            className="btn-ghost px-4 py-2 text-xs"
          >
            {t(locale, "cookie_settings")}
          </button>
          <button type="button" onClick={acceptAll} className="btn-feast px-4 py-2 text-xs">
            {t(locale, "cookie_accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open-cookie-settings"));
  }
}
