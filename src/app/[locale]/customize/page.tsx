import Link from "next/link";
import { getPublicProductsAsync } from "@/lib/catalog";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { localizedProductName } from "@/lib/product-i18n";

export default async function CustomizePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const products = (await getPublicProductsAsync()).filter((p) => p.personalizable);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black md:text-7xl">
        {t(locale, "section_make_yours")}
      </h1>
      <p className="mt-4 max-w-2xl text-ink/75">{t(locale, "section_make_yours_body")}</p>

      <ol className="mt-10 grid gap-4 border-2 border-ink bg-fog p-6 text-sm md:grid-cols-3">
        <li>
          <p className="font-extrabold uppercase">{t(locale, "customize_step1_title")}</p>
          <p className="mt-2 text-ink/70">{t(locale, "customize_step1_body")}</p>
        </li>
        <li>
          <p className="font-extrabold uppercase">{t(locale, "customize_step2_title")}</p>
          <p className="mt-2 text-ink/70">{t(locale, "customize_step2_body")}</p>
        </li>
        <li>
          <p className="font-extrabold uppercase">{t(locale, "customize_step3_title")}</p>
          <p className="mt-2 text-ink/70">{t(locale, "customize_step3_body")}</p>
        </li>
      </ol>

      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={`/${locale}/product/${p.slug}`}
              className="block border-2 border-ink bg-paper p-5 transition hover:bg-yellow"
            >
              <p className="display text-2xl font-black">
                {localizedProductName(p.slug, p.name, locale)}
              </p>
              <p className="mt-2 text-xs font-bold uppercase text-muted">
                {p.production.stl_master_sku}
              </p>
              <p className="mt-2 text-sm text-muted">
                {p.personalization_fields
                  .map((f) =>
                    f === "name"
                      ? t(locale, "label_name")
                      : f === "initials"
                        ? t(locale, "label_initials")
                        : f === "text"
                          ? t(locale, "label_text")
                          : f === "color"
                            ? t(locale, "label_color")
                            : f === "size"
                              ? t(locale, "label_size")
                              : f,
                  )
                  .join(" · ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
