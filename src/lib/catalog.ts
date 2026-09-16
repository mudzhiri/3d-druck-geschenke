import type { CatalogProduct, LicenseRecord, StoreLocation } from "./types";
import { batch01Products } from "./catalog-batch-01";

/** License registry — no third-party IP without documented rights. */
export const licenses: LicenseRecord[] = [
  {
    id: "lic-own-001",
    title: "3D-Druck-Geschenke Original Designs 2026",
    type: "OWN",
    notes:
      "In-house original geometry (batch-01 masters). MakerWorld/Etsy used only as market research — commercial remixes require Standard Commercial License per model before import.",
  },
];

/**
 * Live catalog = batch 01 (20 bestsellers).
 * Publish cadence target: +20 products / day (see docs/PRODUCT-PIPELINE.md).
 */
export const catalog: CatalogProduct[] = [...batch01Products];

export const stores: StoreLocation[] = [
  {
    id: "store-coburg-247",
    name: "3D-Druck-Geschenke 24/7",
    address: "[STRASSE PLACEHOLDER]",
    city: "Coburg",
    hours: "24/7",
    is_24_7: true,
    categories: ["PLAY", "DESK", "GAMING", "GIFTS"],
    lat: 50.2612,
    lng: 10.9644,
  },
];

export function getProduct(slug: string) {
  return catalog.find((p) => p.slug === slug);
}

export function getPublicProducts() {
  return catalog.filter(
    (p) =>
      (p.status === "ACTIVE" || p.status === "DRAFT" || p.status === "READY") &&
      (p.for_sale || p.status === "DRAFT"),
  );
}

export function getProductsByCategory(categorySlug: string, subSlug?: string) {
  const products = getPublicProducts();
  return products.filter((p) => {
    if (!p.category_id && !p.subcategory_id) return categorySlug === "all";
    // resolve via slug match in page layer — here filter by ids if provided as ids
    if (subSlug) return p.subcategory_id === subSlug || p.category_id === categorySlug;
    return p.category_id === categorySlug;
  });
}

export function searchCatalog(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return catalog.filter((p) => {
    const hay = [
      p.name.de,
      p.name.en,
      p.description.de,
      p.description.en,
      ...p.vibes,
      ...p.variants.map((v) => v.color.color_name),
      p.slug,
      p.category_id ?? "",
      p.subcategory_id ?? "",
      p.production.stl_master_sku ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q) || fuzzyIncludes(hay, q);
  });
}

function fuzzyIncludes(hay: string, needle: string) {
  if (hay.includes(needle)) return true;
  if (needle.length < 4) return false;
  let i = 0;
  for (const ch of hay) {
    if (ch === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return false;
}

export function canActivateProduct(product: CatalogProduct) {
  if (product.compliance.product_class === "TOY") {
    return (
      product.compliance.compliance_status === "CLEARED" &&
      product.compliance.documentation.length > 0
    );
  }
  if (product.compliance.compliance_status === "INCOMPLETE") return false;
  const license = licenses.find((l) => l.id === product.license_id);
  return Boolean(license);
}

export function materialCostCents(grams: number, spoolCostCentsPerKg: number) {
  return Math.round((grams / 1000) * spoolCostCentsPerKg);
}

export function contributionMargin(input: {
  salePriceCents: number;
  materialCents: number;
  packagingCents: number;
  marketplaceFeeCents: number;
  paymentFeeCents: number;
  shippingSubsidyCents: number;
  electricityCents: number;
  laborCents: number;
}) {
  const cost =
    input.materialCents +
    input.packagingCents +
    input.marketplaceFeeCents +
    input.paymentFeeCents +
    input.shippingSubsidyCents +
    input.electricityCents +
    input.laborCents;
  const margin = input.salePriceCents - cost;
  return {
    marginCents: margin,
    marginPct: input.salePriceCents ? (margin / input.salePriceCents) * 100 : 0,
  };
}
