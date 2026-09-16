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
  const isDe = locale === "de";

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black md:text-7xl">
        {t(locale, "section_make_yours")}
      </h1>
      <p className="mt-4 max-w-2xl text-ink/75">{t(locale, "section_make_yours_body")}</p>

      <ol className="mt-10 grid gap-4 border-2 border-ink bg-fog p-6 text-sm md:grid-cols-3">
        <li>
          <p className="font-extrabold uppercase">1. Produkt wählen</p>
          <p className="mt-2 text-ink/70">
            {isDe
              ? "Keychain, Tag, Name Ridge, Cake Topper…"
              : "Keychain, tag, name ridge, cake topper…"}
          </p>
        </li>
        <li>
          <p className="font-extrabold uppercase">2. Text / Farbe</p>
          <p className="mt-2 text-ink/70">
            {isDe
              ? "Name, Initialen oder Kurztext + Filamentfarbe am Produkt."
              : "Name, initials or short text + filament color on the product page."}
          </p>
        </li>
        <li>
          <p className="font-extrabold uppercase">3. STL für Druck</p>
          <p className="mt-2 text-ink/70">
            {isDe
              ? "Nach Bestellung: Datei ORD-…__SKU__FARBE__NAME.stl im Print-Ordner — sofort findbar."
              : "After order: file ORD-…__SKU__COLOR__NAME.stl in the print folder — instantly findable."}
          </p>
        </li>
      </ol>

      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={`/${locale}/product/${p.slug}`}
              className="block border-2 border-ink bg-paper p-5 transition hover:bg-yellow"
            >
              <p className="display text-2xl font-black">{pickLocalized(p.name, locale)}</p>
              <p className="mt-2 text-xs font-bold uppercase text-muted">
                {p.production.stl_master_sku}
              </p>
              <p className="mt-2 text-sm text-muted">{p.personalization_fields.join(" · ")}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
