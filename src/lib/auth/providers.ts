import type { Provider } from "@supabase/supabase-js";
import type { Locale } from "@/lib/brand";

/** Native Supabase OAuth providers we use directly. */
export type NativeSocialProvider = Extract<Provider, "google" | "facebook" | "azure">;

/** Custom OAuth (not native in Supabase). */
export type CustomSocialProvider = "tiktok" | "instagram";

export type SocialProviderId = NativeSocialProvider | CustomSocialProvider;

export type SocialProvider = {
  id: SocialProviderId;
  kind: "native" | "custom";
  /** Supabase provider name when kind=native */
  supabase?: NativeSocialProvider;
  label: Record<Locale, string>;
  /** Brand hex for button accent */
  accent: string;
};

export const socialProviders: SocialProvider[] = [
  {
    id: "google",
    kind: "native",
    supabase: "google",
    accent: "#4285F4",
    label: {
      de: "Google",
      en: "Google",
      fr: "Google",
      es: "Google",
      it: "Google",
      zh: "Google",
    },
  },
  {
    id: "facebook",
    kind: "native",
    supabase: "facebook",
    accent: "#1877F2",
    label: {
      de: "Facebook",
      en: "Facebook",
      fr: "Facebook",
      es: "Facebook",
      it: "Facebook",
      zh: "Facebook",
    },
  },
  {
    id: "azure",
    kind: "native",
    supabase: "azure",
    accent: "#00A4EF",
    label: {
      de: "Microsoft",
      en: "Microsoft",
      fr: "Microsoft",
      es: "Microsoft",
      it: "Microsoft",
      zh: "Microsoft",
    },
  },
  {
    id: "tiktok",
    kind: "custom",
    accent: "#010101",
    label: {
      de: "TikTok",
      en: "TikTok",
      fr: "TikTok",
      es: "TikTok",
      it: "TikTok",
      zh: "TikTok",
    },
  },
  {
    id: "instagram",
    kind: "custom",
    accent: "#E4405F",
    label: {
      de: "Instagram",
      en: "Instagram",
      fr: "Instagram",
      es: "Instagram",
      it: "Instagram",
      zh: "Instagram",
    },
  },
];

export function authCallbackUrl(origin: string, next: string) {
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return `${origin}/auth/callback?next=${encodeURIComponent(safe)}`;
}

export function isCustomProviderConfigured(id: CustomSocialProvider) {
  if (id === "tiktok") {
    return Boolean(
      process.env.TIKTOK_CLIENT_KEY?.trim() && process.env.TIKTOK_CLIENT_SECRET?.trim(),
    );
  }
  return Boolean(
    process.env.INSTAGRAM_CLIENT_ID?.trim() && process.env.INSTAGRAM_CLIENT_SECRET?.trim(),
  );
}
