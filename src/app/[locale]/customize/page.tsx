import Link from "next/link";
import { getPublicProducts } from "@/lib/catalog";
import { pickLocalized, type Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

export default async function CustomizePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const products = getPublicProducts().filter((p) => p.personalizable);
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black md:text-7xl">
        {t(locale, "section_make_yours")}
      </h1>
      <p className="mt-4 max-w-lg text-ink/75">{t(locale, "section_make_yours_body")}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={`/${locale}/product/${p.slug}`}
              className="block border-2 border-ink bg-fog p-6 transition hover:bg-yellow"
            >
              <p className="display text-2xl font-black">{pickLocalized(p.name, locale)}</p>
              <p className="mt-2 text-sm text-muted">{p.personalization_fields.join(" · ")}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
