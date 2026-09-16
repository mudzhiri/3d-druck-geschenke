import type { CatalogProduct, LicenseRecord, StoreLocation } from "./types";

/** License registry — no third-party IP without documented rights. */
export const licenses: LicenseRecord[] = [
  {
    id: "lic-own-001",
    title: "3D-Druck-Geschenke Original Designs 2026",
    type: "OWN",
    notes: "In-house original geometry. No third-party characters.",
  },
];

const baseCompliance = {
  manufacturer_name: "[LEGAL ENTITY PLACEHOLDER]",
  manufacturer_address: "[ADDRESS PLACEHOLDER], Deutschland",
  manufacturer_email: "compliance@PLACEHOLDER.domain",
  batch_or_version: "v1",
  material: "PLA / PETG (see variant)",
  warnings: ["Nicht für Kinder unter 3 Jahren geeignet, wenn Kleinteile vorhanden."],
  age_recommendation: "14+",
  safety_information: "Dekoration / Accessoire — kein Spielzeug ohne Freigabe.",
  compliance_status: "INCOMPLETE" as const,
  documentation: [],
};

/**
 * DEMO catalog only. status DRAFT, for_sale false.
 * Never launch placeholders as ACTIVE.
 */
export const catalog: CatalogProduct[] = [
  {
    id: "p-flex-coil",
    slug: "flex-coil",
    status: "DRAFT",
    group: "HERO",
    vibes: ["PLAY", "DESK", "GIFTS"],
    license_id: "lic-own-001",
    name: { de: "Flex Coil", en: "Flex Coil" },
    description: {
      de: "Endlos drehbares Desk-Objekt. Leise. Suchtig. Eigenes Design.",
      en: "An endless twist for your desk. Quiet. Addictive. Original design.",
    },
    why: {
      de: "Liegt gut in der Hand, sieht auf dem Setup aus wie ein kleines Statement.",
      en: "Feels right in-hand and looks like a tiny statement on any setup.",
    },
    drop_label: "NEW DROP",
    limited_units: null,
    personalizable: true,
    personalization_fields: ["color", "name"],
    images: ["/products/flex-coil.svg"],
    dimensions: "85 × 45 × 45 mm",
    weight_g: 42,
    care: {
      de: "Trocken halten. Keine heiße Spülmaschine.",
      en: "Keep dry. No hot dishwasher.",
    },
    included: {
      de: "1× Flex Coil, Care-Card mit QR",
      en: "1× Flex Coil, care card with QR",
    },
    finish: "Smooth matte",
    production: {
      file_version: "flex-coil-v3",
      printer_type: "Bambu P1S",
      material: "PLA",
      grams_required: 38,
      estimated_print_minutes: 95,
      post_process_minutes: 8,
      quality_check_required: true,
      packaging_sku: "PKG-SM-01",
    },
    compliance: {
      ...baseCompliance,
      product_identifier: "PL-FLEX-COIL",
      product_class: "ACCESSORY",
    },
    variants: [
      {
        id: "v-coil-lime",
        master_sku: "PL-FLEX-COIL-LIM-M",
        size: "M",
        color: {
          id: "c-lime",
          color_name: "Acid Lime",
          hex: "#C8FF3D",
          filament_sku: "FIL-PLA-LIM-01",
          printer_profile: "pla-standard-0.2",
          stock_material: "PLA",
        },
        price_cents: 1890,
        personalization_price_cents: 400,
        available_stock: 12,
        production_capacity: 40,
        safety_stock: 5,
        mode: "IN_STOCK",
      },
      {
        id: "v-coil-ink",
        master_sku: "PL-FLEX-COIL-INK-M",
        size: "M",
        color: {
          id: "c-ink",
          color_name: "Ink",
          hex: "#0B0B0F",
          filament_sku: "FIL-PLA-INK-01",
          printer_profile: "pla-standard-0.2",
          stock_material: "PLA",
        },
        price_cents: 1890,
        personalization_price_cents: 400,
        available_stock: 8,
        production_capacity: 40,
        safety_stock: 5,
        mode: "PRINT_ON_DEMAND",
      },
      {
        id: "v-coil-coral",
        master_sku: "PL-FLEX-COIL-COR-M",
        size: "M",
        color: {
          id: "c-coral",
          color_name: "Hot Coral",
          hex: "#FF5A3C",
          filament_sku: "FIL-PLA-COR-01",
          printer_profile: "pla-standard-0.2",
          stock_material: "PLA",
        },
        price_cents: 1890,
        personalization_price_cents: 400,
        available_stock: 0,
        production_capacity: 30,
        safety_stock: 5,
        mode: "PRINT_ON_DEMAND",
      },
    ],
    for_sale: false,
  },
  {
    id: "p-desk-arc",
    slug: "desk-arc-stand",
    status: "DRAFT",
    group: "EVERGREEN",
    vibes: ["DESK", "GAMING", "CUSTOM"],
    license_id: "lic-own-001",
    name: { de: "Desk Arc Stand", en: "Desk Arc Stand" },
    description: {
      de: "Kopfhörer + Controller. Ein Bogen. Null Kabelsalat-Drama.",
      en: "Headphones + controller. One arc. Zero cable chaos.",
    },
    why: {
      de: "Räumt dein Setup auf, ohne wie Büro-Zubehör auszusehen.",
      en: "Clears your setup without looking like office supply.",
    },
    drop_label: null,
    personalizable: true,
    personalization_fields: ["color", "size", "initials"],
    images: ["/products/desk-arc.svg"],
    dimensions: "220 × 140 × 180 mm",
    weight_g: 186,
    care: {
      de: "Staubtrocken abwischen.",
      en: "Wipe dust dry.",
    },
    included: {
      de: "1× Stand, Filzpads",
      en: "1× stand, felt pads",
    },
    finish: "Semi-matte",
    production: {
      file_version: "desk-arc-v2",
      printer_type: "Prusa MK4",
      material: "PETG",
      grams_required: 164,
      estimated_print_minutes: 310,
      post_process_minutes: 15,
      quality_check_required: true,
      packaging_sku: "PKG-MD-02",
    },
    compliance: {
      ...baseCompliance,
      product_identifier: "PL-DESK-ARC",
      product_class: "ACCESSORY",
      age_recommendation: "8+",
    },
    variants: [
      {
        id: "v-arc-mist",
        master_sku: "PL-DESK-ARC-MST-M",
        size: "M",
        color: {
          id: "c-mist",
          color_name: "Mist",
          hex: "#E8E4DA",
          filament_sku: "FIL-PETG-MST-01",
          printer_profile: "petg-0.2",
          stock_material: "PETG",
        },
        price_cents: 3490,
        personalization_price_cents: 600,
        available_stock: 4,
        production_capacity: 18,
        safety_stock: 3,
        mode: "IN_STOCK",
      },
      {
        id: "v-arc-violet",
        master_sku: "PL-DESK-ARC-VIO-L",
        size: "L",
        color: {
          id: "c-violet",
          color_name: "Signal Violet",
          hex: "#7B61FF",
          filament_sku: "FIL-PETG-VIO-01",
          printer_profile: "petg-0.2",
          stock_material: "PETG",
        },
        price_cents: 3790,
        personalization_price_cents: 600,
        available_stock: 2,
        production_capacity: 12,
        safety_stock: 2,
        mode: "PRINT_ON_DEMAND",
      },
    ],
    for_sale: false,
  },
  {
    id: "p-orbit-clip",
    slug: "orbit-cable-clip",
    status: "DRAFT",
    group: "DROP",
    vibes: ["DESK", "ROOM", "GIFTS"],
    license_id: "lic-own-001",
    name: { de: "Orbit Cable Clip", en: "Orbit Cable Clip" },
    description: {
      de: "Drei Kabel. Ein Orbit. Limitierte erste Charge.",
      en: "Three cables. One orbit. First batch limited.",
    },
    why: {
      de: "Klein, sichtbar, sofort nützlich — und tatsächlich limitiert.",
      en: "Small, visible, instantly useful — and actually limited.",
    },
    drop_label: "LIMITED",
    limited_units: 100,
    personalizable: false,
    personalization_fields: ["color"],
    images: ["/products/orbit-clip.svg"],
    dimensions: "60 × 40 × 25 mm",
    weight_g: 18,
    care: {
      de: "Nicht überdehnen.",
      en: "Do not overstretch.",
    },
    included: {
      de: "1× Orbit Clip",
      en: "1× Orbit Clip",
    },
    finish: "Satin",
    production: {
      file_version: "orbit-v1",
      printer_type: "Bambu A1",
      material: "PLA",
      grams_required: 16,
      estimated_print_minutes: 42,
      post_process_minutes: 4,
      quality_check_required: true,
      packaging_sku: "PKG-XS-01",
    },
    compliance: {
      ...baseCompliance,
      product_identifier: "PL-ORBIT-CLIP",
      product_class: "ACCESSORY",
      warnings: ["Enthält keine Magnete.", "Kein Spielzeug."],
    },
    variants: [
      {
        id: "v-orbit-lime",
        master_sku: "PL-ORBIT-CLIP-LIM-OS",
        color: {
          id: "c-lime",
          color_name: "Acid Lime",
          hex: "#C8FF3D",
          filament_sku: "FIL-PLA-LIM-01",
          printer_profile: "pla-standard-0.2",
          stock_material: "PLA",
        },
        price_cents: 1290,
        personalization_price_cents: 0,
        available_stock: 47,
        production_capacity: 0,
        safety_stock: 10,
        mode: "IN_STOCK",
      },
    ],
    for_sale: false,
  },
  {
    id: "p-name-ridge",
    slug: "name-ridge",
    status: "DRAFT",
    group: "EVERGREEN",
    vibes: ["CUSTOM", "GIFTS", "ROOM"],
    license_id: "lic-own-001",
    name: { de: "Name Ridge", en: "Name Ridge" },
    description: {
      de: "Dein Name als kleines Regalobjekt. Kein Billig-Schild.",
      en: "Your name as a little shelf object. Not a cheap sign.",
    },
    why: {
      de: "Personalisierung, die sich wie ein Produkt anfühlt — nicht wie ein Aufkleber.",
      en: "Personalization that feels like a product — not a sticker.",
    },
    drop_label: null,
    personalizable: true,
    personalization_fields: ["name", "color", "size"],
    images: ["/products/name-ridge.svg"],
    dimensions: "bis 180 mm Breite",
    weight_g: 55,
    care: {
      de: "Innenbereich.",
      en: "Indoor use.",
    },
    included: {
      de: "1× Name Ridge",
      en: "1× Name Ridge",
    },
    finish: "Matte",
    production: {
      file_version: "name-ridge-v4",
      printer_type: "Bambu P1S",
      material: "PLA",
      grams_required: 48,
      estimated_print_minutes: 120,
      post_process_minutes: 10,
      quality_check_required: true,
      packaging_sku: "PKG-SM-01",
    },
    compliance: {
      ...baseCompliance,
      product_identifier: "PL-NAME-RIDGE",
      product_class: "DECORATION",
    },
    variants: [
      {
        id: "v-ridge-ink",
        master_sku: "PL-NAME-RIDGE-INK-M",
        size: "M",
        color: {
          id: "c-ink",
          color_name: "Ink",
          hex: "#0B0B0F",
          filament_sku: "FIL-PLA-INK-01",
          printer_profile: "pla-standard-0.2",
          stock_material: "PLA",
        },
        price_cents: 2490,
        personalization_price_cents: 0,
        available_stock: 0,
        production_capacity: 25,
        safety_stock: 0,
        mode: "PRINT_ON_DEMAND",
      },
      {
        id: "v-ridge-coral",
        master_sku: "PL-NAME-RIDGE-COR-M",
        size: "M",
        color: {
          id: "c-coral",
          color_name: "Hot Coral",
          hex: "#FF5A3C",
          filament_sku: "FIL-PLA-COR-01",
          printer_profile: "pla-standard-0.2",
          stock_material: "PLA",
        },
        price_cents: 2490,
        personalization_price_cents: 0,
        available_stock: 0,
        production_capacity: 25,
        safety_stock: 0,
        mode: "PRINT_ON_DEMAND",
      },
    ],
    for_sale: false,
  },
];

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
  // Only ACTIVE + for_sale would be public in production.
  // Demo catalog is DRAFT — shown with NOT FOR SALE badge for design QA.
  return catalog.filter((p) => p.status === "DRAFT" || p.status === "ACTIVE");
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
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q) || fuzzyIncludes(hay, q);
  });
}

function fuzzyIncludes(hay: string, needle: string) {
  // lightweight typo tolerance
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
