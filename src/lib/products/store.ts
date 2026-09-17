import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import type { CatalogProduct, Vibe } from "@/lib/types";

export type AgentProductRow = {
  id?: string;
  slug: string;
  sku: string;
  batch_day: string;
  status: string;
  category_id: string;
  subcategory_id: string | null;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  why_de: string;
  why_en: string;
  personalizable: boolean;
  personalization_fields: string[];
  images: string[];
  dimensions: string;
  weight_g: number;
  grams: number;
  minutes: number;
  price_cents: number;
  perso_price_cents: number;
  product_class: string;
  hex: string;
  color_name: string;
  color_code: string;
  vibes: string[];
  drop_label: string | null;
  research_source: string | null;
  research_refs: unknown;
  license_note: string;
  for_sale: boolean;
};

const TABLE = "gift_agent_products";

function anonClient(): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

function adminClient(): SupabaseClient | null {
  const { supabaseUrl } = getSupabasePublicEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function countAgentProductsForDay(day: string) {
  const sb = adminClient() ?? anonClient();
  if (!sb) return 0;
  const { count } = await sb
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("batch_day", day);
  return count ?? 0;
}

export async function listActiveAgentProducts(limit = 400): Promise<AgentProductRow[]> {
  const sb = anonClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("status", "ACTIVE")
    .eq("for_sale", true)
    .order("batch_day", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as AgentProductRow[];
}

export async function upsertAgentProduct(row: Omit<AgentProductRow, "id">) {
  const admin = adminClient();
  if (!admin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY fehlt — nötig zum Publishen neuer Produkte.",
    );
  }
  const { data, error } = await admin
    .from(TABLE)
    .upsert(row, { onConflict: "slug" })
    .select("slug, sku, name_de, batch_day")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function uploadProductSvg(sku: string, svg: string) {
  const admin = adminClient();
  if (!admin) return null;
  const path = `${sku.toLowerCase()}.svg`;
  const bytes = new TextEncoder().encode(svg);
  const { error } = await admin.storage.from("gift-product-images").upload(path, bytes, {
    contentType: "image/svg+xml",
    upsert: true,
  });
  if (error) return null;
  const { data } = admin.storage.from("gift-product-images").getPublicUrl(path);
  return data.publicUrl;
}

export function agentRowToCatalog(row: AgentProductRow): CatalogProduct {
  const fields = (row.personalization_fields ?? []).filter((f): f is CatalogProduct["personalization_fields"][number] =>
    ["name", "initials", "text", "color", "size"].includes(f),
  );
  const vibes = (row.vibes ?? ["GIFTS"]).filter((v): v is Vibe =>
    ["PLAY", "DESK", "ROOM", "GAMING", "GIFTS", "CUSTOM"].includes(v),
  );

  return {
    id: row.id ? `agent-${row.id}` : `agent-${row.slug}`,
    slug: row.slug,
    status: "ACTIVE",
    group: row.drop_label ? "DROP" : "EVERGREEN",
    vibes: vibes.length ? vibes : ["GIFTS"],
    category_id: row.category_id,
    subcategory_id: row.subcategory_id ?? undefined,
    license_id: "lic-own-001",
    name: { de: row.name_de, en: row.name_en },
    description: { de: row.description_de, en: row.description_en },
    why: { de: row.why_de, en: row.why_en },
    drop_label: (row.drop_label as "NEW DROP" | "LIMITED" | null) ?? "NEW DROP",
    limited_units: null,
    personalizable: row.personalizable,
    personalization_fields: fields.length ? fields : ["color"],
    images: row.images?.length ? row.images : ["/products/pl-name-key.svg"],
    dimensions: row.dimensions,
    weight_g: row.weight_g,
    care: {
      de: "Trocken halten. Innenbereich. Nicht spülen.",
      en: "Keep dry. Indoor use. Do not dishwasher.",
    },
    included: {
      de: `1× ${row.name_de}`,
      en: `1× ${row.name_en}`,
    },
    finish: "Matte / satin",
    production: {
      file_version: `${row.sku}_MASTER_v1`,
      printer_type: "Bambu P1S",
      material: "PLA",
      grams_required: row.grams,
      estimated_print_minutes: row.minutes,
      post_process_minutes: 8,
      quality_check_required: true,
      packaging_sku: row.grams > 80 ? "PKG-MD-02" : "PKG-SM-01",
      stl_master_sku: row.sku,
    },
    compliance: {
      manufacturer_name: "[LEGAL ENTITY PLACEHOLDER]",
      manufacturer_address: "[ADDRESS PLACEHOLDER], Deutschland",
      manufacturer_email: "compliance@PLACEHOLDER.domain",
      product_identifier: row.sku,
      batch_or_version: row.batch_day,
      material: "PLA",
      warnings: ["Nicht für Kinder unter 3 Jahren geeignet, wenn Kleinteile vorhanden."],
      age_recommendation: "14+",
      safety_information: "Dekoration / Accessoire — kein zertifiziertes Spielzeug.",
      compliance_status: "IN_REVIEW",
      product_class: (row.product_class as CatalogProduct["compliance"]["product_class"]) || "ACCESSORY",
      documentation: ["production/stl/masters", "agent-trend-inspired"],
    },
    variants: [
      {
        id: `v-${row.slug}-a`,
        master_sku: `${row.sku}-${row.color_code}-M`,
        size: "M",
        color: {
          id: `c-${row.color_code.toLowerCase()}`,
          color_name: row.color_name,
          hex: row.hex,
          filament_sku: `FIL-PLA-${row.color_code}-01`,
          printer_profile: "pla-standard-0.2",
          stock_material: "PLA",
        },
        price_cents: row.price_cents,
        personalization_price_cents: row.perso_price_cents,
        available_stock: 0,
        production_capacity: 40,
        safety_stock: 5,
        mode: "PRINT_ON_DEMAND",
      },
      {
        id: `v-${row.slug}-ink`,
        master_sku: `${row.sku}-INK-M`,
        size: "M",
        color: {
          id: "c-ink",
          color_name: "Ink",
          hex: "#0B0B0F",
          filament_sku: "FIL-PLA-INK-01",
          printer_profile: "pla-standard-0.2",
          stock_material: "PLA",
        },
        price_cents: row.price_cents,
        personalization_price_cents: row.perso_price_cents,
        available_stock: 0,
        production_capacity: 40,
        safety_stock: 5,
        mode: "PRINT_ON_DEMAND",
      },
    ],
    for_sale: row.for_sale,
  };
}
