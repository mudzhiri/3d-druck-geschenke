import type { CatalogProduct, LicenseRecord, StoreLocation } from "./types";
import { batch01Products } from "./catalog-batch-01";
import {
  agentRowToCatalog,
  listActiveAgentProducts,
} from "./products/store";

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
 * Static catalog = batch 01.
 * Daily agent products (gift_agent_products) are merged at runtime — see docs/PRODUCT-AGENT.md.
 */
export const catalog: CatalogProduct[] = [...batch01Products];

let agentCache: { at: number; products: CatalogProduct[] } | null = null;
const AGENT_CACHE_MS = 60_000;

async function loadAgentCatalog(): Promise<CatalogProduct[]> {
  const now = Date.now();
  if (agentCache && now - agentCache.at < AGENT_CACHE_MS) {
    return agentCache.products;
  }
  try {
    const rows = await listActiveAgentProducts(500);
    const products = rows.map(agentRowToCatalog);
    agentCache = { at: now, products };
    return products;
  } catch {
    return agentCache?.products ?? [];
  }
}

export async function getCatalogAsync(): Promise<CatalogProduct[]> {
  const agent = await loadAgentCatalog();
  const bySlug = new Map<string, CatalogProduct>();
  for (const p of catalog) bySlug.set(p.slug, p);
  for (const p of agent) bySlug.set(p.slug, p);
  return [...bySlug.values()];
}

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

export async function getProductAsync(slug: string) {
  const all = await getCatalogAsync();
  return all.find((p) => p.slug === slug);
}

export function getPublicProducts() {
  return catalog.filter(
    (p) =>
      (p.status === "ACTIVE" || p.status === "DRAFT" || p.status === "READY") &&
      (p.for_sale || p.status === "DRAFT"),
  );
}

export async function getPublicProductsAsync() {
  const all = await getCatalogAsync();
  return all.filter(
    (p) =>
      (p.status === "ACTIVE" || p.status === "DRAFT" || p.status === "READY") &&
      (p.for_sale || p.status === "DRAFT"),
  );
}

export function getProductsByCategory(categorySlug: string, subSlug?: string) {
  const products = getPublicProducts();
  return products.filter((p) => {
    if (!p.category_id && !p.subcategory_id) return categorySlug === "all";
    if (subSlug) return p.subcategory_id === subSlug || p.category_id === categorySlug;
    return p.category_id === categorySlug;
  });
}

export async function getProductsByCategoryAsync(categoryId: string, subId?: string) {
  const products = await getPublicProductsAsync();
  return products.filter((p) => {
    if (subId) return p.subcategory_id === subId;
    return p.category_id === categoryId;
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

export async function searchCatalogAsync(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getPublicProductsAsync();
  return all.filter((p) => {
    const hay = [p.name.de, p.name.en, p.description.de, p.description.en, ...p.vibes, p.slug]
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
