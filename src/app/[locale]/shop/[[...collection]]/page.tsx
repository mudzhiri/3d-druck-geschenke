import { getPublicProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import type { Locale } from "@/lib/brand";
import type { Vibe } from "@/lib/types";

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
  const key = (collection?.[0] ?? "all").toLowerCase();
  const vibe = vibeMap[key] ?? "ALL";
  let products = getPublicProducts();
  if (vibe === "DROPS") {
    products = products.filter((p) => p.group === "DROP" || p.drop_label);
  } else if (vibe !== "ALL") {
    products = products.filter((p) => p.vibes.includes(vibe));
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-extrabold uppercase md:text-6xl">
        {collection?.[0] ?? "Shop"}
      </h1>
      <p className="mt-3 text-muted">{products.length} products</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
    </main>
  );
}
