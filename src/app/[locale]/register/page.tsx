import Link from "next/link";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { SocialLoginButtons } from "@/components/auth/social-login";
import { RegisterForm } from "@/components/auth/password-forms";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const sp = await searchParams;
  const next = sp.next?.startsWith("/") ? sp.next : `/${locale}/account`;
  const error = sp.error ? decodeURIComponent(sp.error) : null;

  return (
    <main className="mx-auto max-w-md px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black">{t(locale, "auth_register_title")}</h1>
      <p className="mt-3 text-ink/75">{t(locale, "auth_register_intro")}</p>

      {error && (
        <p className="mt-6 border-2 border-ink bg-yellow p-3 text-sm font-medium">{error}</p>
      )}

      <p className="mt-8 text-xs font-extrabold uppercase tracking-wide text-muted">
        {t(locale, "auth_password_first")}
      </p>
      <div className="mt-3">
        <RegisterForm locale={locale} next={next} />
      </div>

      <div className="my-8 flex items-center gap-3 text-xs font-extrabold uppercase tracking-wide text-muted">
        <span className="h-px flex-1 bg-ink/20" />
        {t(locale, "auth_or")}
        <span className="h-px flex-1 bg-ink/20" />
      </div>

      <SocialLoginButtons locale={locale} next={next} />

      <p className="mt-8 text-center text-sm text-muted">
        <Link href={`/${locale}/login`} className="font-extrabold uppercase underline">
          {t(locale, "auth_sign_in")}
        </Link>
      </p>
    </main>
  );
}
