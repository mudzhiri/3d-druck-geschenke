/**
 * Brand for 3d-druck-geschenke.de
 * Visual direction: Feastables-style energy — bold wordmark, yellow punch, light surfaces.
 * Domain = SEO primary. B2B stays on teilnachbau.de.
 */
export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? "3D-Druck-Geschenke",
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT ?? "3DG",
  wordmark: "3D GESCHENKE",
  legalNamePlaceholder: "[LEGAL ENTITY PLACEHOLDER]",
  primaryDomain: "3d-druck-geschenke.de",
  redirectDomain: "personalisierte-3d-geschenke.de",
  tagline: {
    de: "Persönliche 3D-Druck-Geschenke — von uns gefertigt.",
    en: "Personal 3D-printed gifts — made by us.",
    fr: "Cadeaux imprimés en 3D — fabriqués par nous.",
    es: "Regalos impresos en 3D — hechos por nosotros.",
    it: "Regali stampati in 3D — fatti da noi.",
    zh: "个性化 3D 打印礼物 — 我们亲手制作。",
  },
  headline: {
    de: "GESCHENKE, DIE SITZEN.",
    en: "GIFTS THAT HIT DIFFERENT.",
    fr: "DES CADEAUX QUI CLAQUENT.",
    es: "REGALOS QUE PEGAN FUERTE.",
    it: "REGALI CHE COLPISCONO.",
    zh: "不一样的礼物。",
  },
  subline: {
    de: "Designt für dich. Gedruckt bei uns in Deutschland.",
    en: "Designed for you. Printed by us in Germany.",
    fr: "Conçu pour toi. Imprimé par nous en Allemagne.",
    es: "Diseñado para ti. Impreso por nosotros en Alemania.",
    it: "Progettato per te. Stampato da noi in Germania.",
    zh: "为你设计。在德国由我们打印。",
  },
  assistantName: process.env.NEXT_PUBLIC_ASSISTANT_NAME ?? "Geschenk-Assistent",
  domainPlaceholder:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.3d-druck-geschenke.de",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@3d-druck-geschenke.de",
  ordersEmail:
    process.env.NEXT_PUBLIC_ORDERS_EMAIL ?? "bestellungen@3d-druck-geschenke.de",
  infoEmail:
    process.env.NEXT_PUBLIC_INFO_EMAIL ?? "info@3d-druck-geschenke.de",
  helloEmail:
    process.env.NEXT_PUBLIC_HELLO_EMAIL ??
    process.env.NEXT_PUBLIC_INFO_EMAIL ??
    "info@3d-druck-geschenke.de",
  emails: {
    info: "info@3d-druck-geschenke.de",
    support: "support@3d-druck-geschenke.de",
    orders: "bestellungen@3d-druck-geschenke.de",
    noreply: "noreply@3d-druck-geschenke.de",
  },
  colors: {
    ink: "#0A0A0A",
    paper: "#FFFFFF",
    fog: "#F3F3F1",
    yellow: "#FFE600",
    black: "#000000",
    muted: "#6B6B6B",
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_IG_URL ?? "",
    tiktok: process.env.NEXT_PUBLIC_TT_URL ?? "",
  },
  b2b: {
    name: "TeilNachbau",
    url: "https://teilnachbau.de",
  },
} as const;

export type Locale = "de" | "en" | "fr" | "es" | "it" | "zh";
export const defaultLocale: Locale = "de";
export const activeLocales: Locale[] = ["de", "en", "fr", "es", "it", "zh"];

export const localeLabels: Record<Locale, string> = {
  de: "DE",
  en: "EN",
  fr: "FR",
  es: "ES",
  it: "IT",
  zh: "中文",
};

export const localeHtmlLang: Record<Locale, string> = {
  de: "de",
  en: "en",
  fr: "fr",
  es: "es",
  it: "it",
  zh: "zh-CN",
};

export function pickLocalized(
  map: Partial<Record<Locale, string>> & { de?: string; en?: string },
  locale: Locale,
): string {
  return map[locale] ?? map.en ?? map.de ?? Object.values(map).find(Boolean) ?? "";
}
