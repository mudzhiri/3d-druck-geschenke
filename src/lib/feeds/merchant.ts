import { catalog } from "@/lib/catalog";
import { brand } from "@/lib/brand";

/** Google Merchant Center–ready TSV stub. No invented GTINs. */
export function buildMerchantFeedTsv() {
  const header = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "availability",
    "price",
    "brand",
    "condition",
    "mpn",
  ].join("\t");

  const rows = catalog.flatMap((p) =>
    p.variants.map((v) =>
      [
        v.master_sku,
        p.name.en,
        p.description.en.replace(/\t/g, " "),
        `${brand.domainPlaceholder}/en/product/${p.slug}`,
        `${brand.domainPlaceholder}${p.images[0]}`,
        p.for_sale && p.status === "ACTIVE" ? "in_stock" : "out_of_stock",
        `${(v.price_cents / 100).toFixed(2)} EUR`,
        brand.name,
        "new",
        v.master_sku,
      ].join("\t"),
    ),
  );

  return [header, ...rows].join("\n");
}
