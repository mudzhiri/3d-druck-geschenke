import Link from "next/link";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const { order } = await searchParams;
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="display text-5xl font-extrabold">{t(locale, "success_title")}</h1>
      <p className="mt-4 text-muted">
        {t(locale, "success_body", { order: order ?? "—" })}
      </p>
      <p className="mt-2 text-sm text-muted">{t(locale, "success_pod")}</p>
      <Link href={`/${locale}/shop`} className="btn-feast mt-8 inline-block px-5 py-3 text-sm">
        {t(locale, "success_continue")}
      </Link>
    </main>
  );
}
