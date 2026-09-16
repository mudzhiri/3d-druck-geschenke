"use client";

import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

export function SignOutButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      className="btn-ghost px-5 py-3 text-sm"
      onClick={async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch {
          // ignore
        }
        window.location.href = `/${locale}/login`;
      }}
    >
      {t(locale, "auth_sign_out")}
    </button>
  );
}
