export type AnalyticsEvent =
  | "view_item"
  | "select_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "purchase"
  | "search"
  | "wishlist"
  | "AI_assistant_open"
  | "AI_product_recommendation"
  | "AI_add_to_cart";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // Consent-gated in production via cookie banner — fire only if allowed.
  const consent =
    typeof document !== "undefined" &&
    document.cookie.includes("pl_consent=analytics");
  if (!consent && process.env.NODE_ENV === "production") {
    // Still keep local debug trail without third-party send
    console.debug("[analytics:held]", event, params);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}
