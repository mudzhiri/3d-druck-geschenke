"use client";

import { useEffect } from "react";
import { localeHtmlLang, type Locale } from "@/lib/brand";

/** Syncs <html lang> with the active locale route. */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = localeHtmlLang[locale];
    document.documentElement.classList.toggle("lang-zh", locale === "zh");
  }, [locale]);
  return null;
}
