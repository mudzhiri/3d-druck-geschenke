import { getPublicProductsAsync, getCatalogAsync } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { pickLocalized, type Locale } from "@/lib/brand";
import type { Vibe } from "@/lib/types";
import { getCategory, getSubcategory, shopCategories } from "@/lib/categories";
import Link from "next/link";
import { t } from "@/lib/i18n";

/** Agent products land daily — never serve a stale static shell. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

const vibeMap: Record<string, Vibe | "ALL" | "DROPS"> = {
  all: "ALL",
  drops: "DROPS",
  play: "PLAY",
  desk: "DESK",
  room: "ROOM",
  gaming: "GAMING",
  gifts: "GIFTS",
  custom: "CUSTOM",
};

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string; collection?: string[] }>;
}) {
  const { locale: raw, collection } = await params;
  const locale = raw as Locale;
  const parts = collection ?? [];
  const key = (parts[0] ?? "all").toLowerCase();
  const subKey = parts[1]?.toLowerCase();

  const category = getCategory(key);
  const subcategory = category && subKey ? getSubcategory(key, subKey) : undefined;
  const vibe = vibeMap[key];

  let products = await getPublicProductsAsync();
  const catalogSize = (await getCatalogAsync()).length;
  let title = t(locale, "nav_shop");

  if (category) {
    title = pickLocalized(category.name, locale);
    products = products.filter((p) => p.category_id === category.id);
    if (subcategory) {
      title = `${pickLocalized(category.name, locale)} · ${pickLocalized(subcategory.name, locale)}`;
      products = products.filter((p) => p.subcategory_id === subcategory.id);
    }
  } else if (vibe === "DROPS") {
    title = t(locale, "nav_drops");
    products = products.filter((p) => p.group === "DROP" || p.drop_label);
  } else if (vibe && vibe !== "ALL") {
    title = key;
    products = products.filter((p) => p.vibes.includes(vibe));
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-extrabold uppercase md:text-6xl">{title}</h1>
      <p className="mt-3 text-muted">
        {t(locale, "products_count", { n: products.length })}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/${locale}/shop`}
          className="border-2 border-ink px-3 py-1 text-xs font-extrabold uppercase hover:bg-yellow"
        >
          {t(locale, "nav_all_products")}
        </Link>
        {shopCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${locale}/shop/${cat.slug}`}
            className="border-2 border-ink px-3 py-1 text-xs font-extrabold uppercase hover:bg-yellow"
          >
            {pickLocalized(cat.name, locale)}
          </Link>
        ))}
      </div>

      {category && (
        <div className="mt-3 flex flex-wrap gap-2">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/${locale}/shop/${category.slug}/${sub.slug}`}
              className="text-xs font-bold uppercase text-ink/70 underline hover:text-ink"
            >
              {pickLocalized(sub.name, locale)}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>

      {!products.length && (
        <p className="mt-10 text-muted">
          {catalogSize} total in catalog — no matches in this filter.
        </p>
      )}
    </main>
  );
}
