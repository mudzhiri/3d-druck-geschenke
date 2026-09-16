export type ProductStatus =
  | "DRAFT"
  | "COMPLIANCE_REVIEW"
  | "READY"
  | "ACTIVE"
  | "PAUSED"
  | "DISCONTINUED";

export type ProductClass =
  | "TOY"
  | "DECORATION"
  | "COLLECTIBLE"
  | "ACCESSORY"
  | "OTHER";

export type ProductGroup = "HERO" | "EVERGREEN" | "DROP";

export type Vibe = "PLAY" | "DESK" | "ROOM" | "GAMING" | "GIFTS" | "CUSTOM";

export type ColorSwatch = {
  id: string;
  color_name: string;
  hex: string;
  filament_sku: string;
  printer_profile: string;
  stock_material: string;
};

export type ProductVariant = {
  id: string;
  master_sku: string;
  size?: string;
  color: ColorSwatch;
  price_cents: number;
  personalization_price_cents: number;
  available_stock: number;
  production_capacity: number;
  safety_stock: number;
  mode: "IN_STOCK" | "PRINT_ON_DEMAND";
};

export type ProductionSpec = {
  file_version: string;
  printer_type: string;
  material: string;
  grams_required: number;
  estimated_print_minutes: number;
  post_process_minutes: number;
  quality_check_required: boolean;
  packaging_sku: string;
};

export type ProductCompliance = {
  manufacturer_name: string;
  manufacturer_address: string;
  manufacturer_email: string;
  product_identifier: string;
  batch_or_version: string;
  material: string;
  warnings: string[];
  age_recommendation: string;
  safety_information: string;
  compliance_status: "INCOMPLETE" | "IN_REVIEW" | "CLEARED";
  product_class: ProductClass;
  documentation: string[];
};

export type LicenseRecord = {
  id: string;
  title: string;
  type: "OWN" | "COMMERCIAL" | "PUBLIC_DOMAIN";
  proof_url?: string;
  notes: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  status: ProductStatus;
  group: ProductGroup;
  vibes: Vibe[];
  license_id: string;
  name: { de: string; en: string };
  description: { de: string; en: string };
  why: { de: string; en: string };
  drop_label?: "NEW DROP" | "LIMITED" | null;
  limited_units?: number | null;
  personalizable: boolean;
  personalization_fields: Array<"name" | "initials" | "text" | "color" | "size">;
  images: string[];
  dimensions: string;
  weight_g: number;
  care: { de: string; en: string };
  included: { de: string; en: string };
  finish: string;
  production: ProductionSpec;
  compliance: ProductCompliance;
  variants: ProductVariant[];
  for_sale: boolean;
};

export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: string;
  is_24_7: boolean;
  categories: Vibe[];
  lat: number;
  lng: number;
};
