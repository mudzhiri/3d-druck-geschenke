import type { Locale } from "@/lib/brand";

export const legalSlugs = [
  "impressum",
  "datenschutz",
  "agb",
  "widerruf",
  "versand",
  "zahlung",
  "retouren",
  "cookies",
  "produktsicherheit",
  "barrierefreiheit",
  "streitbeilegung",
] as const;

export type LegalSlug = (typeof legalSlugs)[number];

export const legalTitles: Record<LegalSlug, Record<Locale, string>> = {
  impressum: {
    de: "Impressum",
    en: "Legal notice",
    fr: "Mentions légales",
    es: "Aviso legal",
    it: "Note legali",
    zh: "法律声明",
  },
  datenschutz: {
    de: "Datenschutzerklärung",
    en: "Privacy policy",
    fr: "Politique de confidentialité",
    es: "Política de privacidad",
    it: "Informativa sulla privacy",
    zh: "隐私政策",
  },
  agb: {
    de: "Allgemeine Geschäftsbedingungen",
    en: "Terms & conditions",
    fr: "Conditions générales",
    es: "Condiciones generales",
    it: "Termini e condizioni",
    zh: "一般条款",
  },
  widerruf: {
    de: "Widerrufsbelehrung",
    en: "Right of withdrawal",
    fr: "Droit de rétractation",
    es: "Derecho de desistimiento",
    it: "Diritto di recesso",
    zh: "撤回权说明",
  },
  versand: {
    de: "Versand & Lieferung",
    en: "Shipping & delivery",
    fr: "Livraison",
    es: "Envío y entrega",
    it: "Spedizione e consegna",
    zh: "配送与交付",
  },
  zahlung: {
    de: "Zahlungsinformationen",
    en: "Payment information",
    fr: "Paiement",
    es: "Información de pago",
    it: "Informazioni di pagamento",
    zh: "支付信息",
  },
  retouren: {
    de: "Retouren & Umtausch",
    en: "Returns & exchange",
    fr: "Retours & échanges",
    es: "Devoluciones",
    it: "Resi e cambi",
    zh: "退货与换货",
  },
  cookies: {
    de: "Cookie-Richtlinie",
    en: "Cookie policy",
    fr: "Politique cookies",
    es: "Política de cookies",
    it: "Informativa cookie",
    zh: "Cookie 政策",
  },
  produktsicherheit: {
    de: "Produktsicherheit (GPSR)",
    en: "Product safety (GPSR)",
    fr: "Sécurité des produits (GPSR)",
    es: "Seguridad del producto (GPSR)",
    it: "Sicurezza prodotti (GPSR)",
    zh: "产品安全 (GPSR)",
  },
  barrierefreiheit: {
    de: "Erklärung zur Barrierefreiheit",
    en: "Accessibility statement",
    fr: "Accessibilité",
    es: "Accesibilidad",
    it: "Accessibilità",
    zh: "无障碍声明",
  },
  streitbeilegung: {
    de: "Streitbeilegung / ODR",
    en: "Dispute resolution / ODR",
    fr: "Règlement des litiges / ODR",
    es: "Resolución de litigios / ODR",
    it: "Risoluzione controversie / ODR",
    zh: "争议解决 / ODR",
  },
};

export function isLegalSlug(value: string): value is LegalSlug {
  return (legalSlugs as readonly string[]).includes(value);
}
