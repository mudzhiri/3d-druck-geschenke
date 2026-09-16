import Link from "next/link";
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { getSessionUser } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const user = await getSessionUser();

  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/account`);
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email ||
    user.id;

  return (
    <main className="mx-auto max-w-lg px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black">{t(locale, "nav_account")}</h1>
      <p className="mt-4 text-ink/75">{t(locale, "auth_signed_in_as")}</p>
      <p className="mt-2 text-xl font-extrabold">{name}</p>
      {user.email && <p className="mt-1 text-sm text-muted">{user.email}</p>}

      <ul className="mt-8 space-y-2 border-2 border-ink bg-fog p-5 text-sm font-medium">
        <li>{t(locale, "auth_feature_orders")}</li>
        <li>{t(locale, "auth_feature_addresses")}</li>
        <li>{t(locale, "auth_feature_invoices")}</li>
        <li>{t(locale, "auth_feature_reorder")}</li>
        <li>{t(locale, "auth_feature_wishlist")}</li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/${locale}/shop`} className="btn-feast inline-flex px-5 py-3 text-sm">
          {t(locale, "cta_explore")}
        </Link>
        <SignOutButton locale={locale} />
      </div>
    </main>
  );
}
