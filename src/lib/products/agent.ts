import { slugify } from "@/lib/utils";
import { researchTrendingProducts, selectDailyHints } from "@/lib/products/research";
import { buildProductSvg, svgDataUrl } from "@/lib/products/photo";
import {
  countAgentProductsForDay,
  upsertAgentProduct,
  uploadProductSvg,
  type AgentProductRow,
} from "@/lib/products/store";
import type { TrendHint } from "@/lib/products/trends";

export type ProductAgentStep =
  | "1_research_internet"
  | "2_makerworld_trends"
  | "3_presentable_photos"
  | "4_integrate_catalog";

function berlinDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function skuFromKind(kind: string, day: string) {
  const code = kind
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18);
  const stamp = day.replace(/-/g, "").slice(2);
  return `PL-${code}-${stamp}`;
}

function copyForHint(hint: TrendHint, day: string) {
  const nameDe = hint.labelDe;
  const nameEn = hint.labelEn;
  return {
    name_de: nameDe,
    name_en: nameEn,
    description_de: `${nameDe} — trendstarkes 3D-Druck-Geschenk (Batch ${day}). Robust in PLA, optional personalisierbar. Inspiration aus Markttrends (MakerWorld/Web), eigene Shop-Präsentation.`,
    description_en: `${nameEn} — trending 3D-print gift (batch ${day}). Sturdy PLA, optionally personalized. Inspired by market trends (MakerWorld/web), original shop presentation.`,
    why_de: "Angesagt, verschenkbar, klarer Use-Case.",
    why_en: "Trending, giftable, clear use-case.",
  };
}

async function presentableImage(hint: TrendHint, sku: string, dayIndex: number) {
  const svg = buildProductSvg({
    title: hint.labelDe,
    photoKind: hint.photoKind,
    dayIndex,
    accent: undefined,
  });
  const uploaded = await uploadProductSvg(sku, svg);
  if (uploaded) return uploaded;
  return svgDataUrl(svg);
}

export async function runDailyProductAgent(options?: {
  force?: boolean;
  limit?: number;
  date?: Date;
}) {
  const date = options?.date ?? new Date();
  const day = berlinDay(date);
  const limit = options?.limit ?? 20;
  const steps: Array<{ step: ProductAgentStep; ok: boolean; detail: string }> = [];

  // ——— 1) Internet research ———
  const { hits, notes } = await researchTrendingProducts();
  steps.push({
    step: "1_research_internet",
    ok: hits.length > 0,
    detail: `${hits.length} hits · ${notes.join(" · ")}`,
  });

  // ——— 2) MakerWorld trends (snapshot + ranking) ———
  const mwHits = hits.filter((h) => h.source === "makerworld-trending");
  const hints = selectDailyHints(hits, limit, date);
  steps.push({
    step: "2_makerworld_trends",
    ok: mwHits.length > 0,
    detail: `${mwHits.length} MakerWorld titles · selected ${hints.length} gift-safe concepts`,
  });

  if (!options?.force) {
    const existing = await countAgentProductsForDay(day);
    if (existing >= limit) {
      steps.push({
        step: "3_presentable_photos",
        ok: false,
        detail: `already_have_${existing}_for_${day}`,
      });
      steps.push({
        step: "4_integrate_catalog",
        ok: false,
        detail: "skipped",
      });
      return {
        status: "skipped" as const,
        reason: "already_published_today",
        day,
        count: existing,
        steps,
      };
    }
  }

  // ——— 3 + 4) Photos + integrate ———
  const published: Array<{ slug: string; sku: string; name_de: string }> = [];
  const errors: string[] = [];

  for (let i = 0; i < hints.length; i++) {
    const hint = hints[i]!;
    const sku = skuFromKind(hint.kind, day);
    const slug = slugify(`${hint.kind}-${day}`);
    try {
      const image = await presentableImage(hint, sku, i);
      const copy = copyForHint(hint, day);
      const row: Omit<AgentProductRow, "id"> = {
        slug,
        sku,
        batch_day: day,
        status: "ACTIVE",
        category_id: hint.category_id,
        subcategory_id: hint.subcategory_id,
        ...copy,
        personalizable: hint.personalizable,
        personalization_fields: hint.fields,
        images: [image],
        dimensions: hint.dims,
        weight_g: Math.round(hint.grams * 1.15),
        grams: hint.grams,
        minutes: hint.minutes,
        price_cents: hint.priceCents,
        perso_price_cents: hint.personalizable ? 300 : 0,
        product_class: "ACCESSORY",
        hex: ["#FFE600", "#FF5A3C", "#6B2D9B", "#C8FF3D", "#1F8A7A"][i % 5]!,
        color_name: ["Feast Yellow", "Coral", "Violet", "Acid Lime", "Teal"][i % 5]!,
        color_code: ["YEL", "COR", "VIO", "LIM", "TEA"][i % 5]!,
        vibes: hint.vibes,
        drop_label: "NEW DROP",
        research_source: "makerworld+web",
        research_refs: hits.slice(0, 8).map((h) => ({ title: h.title, source: h.source })),
        license_note:
          "OWN listing — trend-inspired original shop product. No MakerWorld STL/geometry/photo reused.",
        for_sale: true,
      };
      const saved = await upsertAgentProduct(row);
      published.push({
        slug: saved.slug,
        sku: saved.sku,
        name_de: saved.name_de,
      });
    } catch (err) {
      errors.push(`${hint.kind}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  steps.push({
    step: "3_presentable_photos",
    ok: published.length > 0,
    detail: `${published.length} studio SVGs generated (storage or data-URL)`,
  });
  steps.push({
    step: "4_integrate_catalog",
    ok: published.length > 0,
    detail:
      published.length > 0
        ? `published ${published.length} → gift_agent_products`
        : `failed: ${errors.slice(0, 3).join("; ")}`,
  });

  if (!published.length) {
    throw new Error(errors[0] || "No products published");
  }

  return {
    status: "published" as const,
    day,
    count: published.length,
    products: published,
    errors,
    steps,
  };
}
