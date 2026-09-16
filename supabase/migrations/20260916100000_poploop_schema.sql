-- POPLOOP schema — run in Supabase SQL editor
-- Secrets never belong in this file.

create extension if not exists "pgcrypto";

create type product_status as enum (
  'DRAFT','COMPLIANCE_REVIEW','READY','ACTIVE','PAUSED','DISCONTINUED'
);
create type product_class as enum (
  'TOY','DECORATION','COLLECTIBLE','ACCESSORY','OTHER'
);
create type order_channel as enum ('SHOP','AMAZON','EBAY','RETAIL_24_7');
create type production_status as enum (
  'QUEUED','PRINTING','POST_PROCESSING','QC','PACKING','READY_TO_SHIP','SHIPPED'
);
create type admin_role as enum ('OWNER','ADMIN','PRODUCTION','SUPPORT','MARKETING');
create type listing_state as enum ('DRAFT','REVIEW','PUBLISH','LIVE','PAUSED');

create table licenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('OWN','COMMERCIAL','PUBLIC_DOMAIN')),
  proof_url text,
  notes text,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status product_status not null default 'DRAFT',
  product_group text not null check (product_group in ('HERO','EVERGREEN','DROP')),
  license_id uuid references licenses(id),
  personalizable boolean default false,
  drop_label text,
  limited_units int,
  created_at timestamptz default now()
);

create table product_translations (
  product_id uuid references products(id) on delete cascade,
  locale text not null,
  name text not null,
  description text not null,
  primary key (product_id, locale)
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  master_sku text unique not null,
  size text,
  color_name text not null,
  hex text not null,
  filament_sku text,
  printer_profile text,
  stock_material text,
  price_cents int not null,
  personalization_price_cents int default 0,
  mode text check (mode in ('IN_STOCK','PRINT_ON_DEMAND'))
);

create table inventory_items (
  master_sku text primary key references product_variants(master_sku),
  physical_stock int not null default 0,
  reserved_stock int not null default 0,
  available_stock int not null default 0,
  production_capacity int not null default 0,
  safety_stock int not null default 0,
  shopify_sku text,
  amazon_sku text,
  ebay_sku text,
  retail_sku text,
  updated_at timestamptz default now()
);

create table product_production_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  file_version text,
  printer_type text,
  material text,
  color text,
  grams_required numeric,
  estimated_print_minutes int,
  post_process_minutes int,
  quality_check_required boolean default true,
  packaging_sku text
);

create table product_compliance (
  product_id uuid primary key references products(id) on delete cascade,
  manufacturer_name text,
  manufacturer_address text,
  manufacturer_email text,
  product_identifier text,
  batch_or_version text,
  material text,
  warnings text[],
  age_recommendation text,
  safety_information text,
  compliance_status text,
  product_class product_class not null,
  documentation text[]
);

create table orders (
  id text primary key,
  channel order_channel not null,
  shopify_order_id text,
  amazon_order_id text,
  ebay_order_id text,
  customer_name text,
  customer_email text,
  locale text,
  country text,
  revenue_cents int not null,
  payment_status text,
  production_status text,
  fulfillment_status text,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text references orders(id) on delete cascade,
  master_sku text,
  qty int not null,
  personalization jsonb,
  mode text
);

create table production_jobs (
  id text primary key,
  order_id text references orders(id),
  status production_status not null default 'QUEUED',
  printer text,
  material text,
  color text,
  grams numeric,
  estimated_minutes int,
  late boolean default false,
  created_at timestamptz default now()
);

create table filament_lots (
  id uuid primary key default gen_random_uuid(),
  supplier text,
  brand text,
  material text,
  color text,
  lot text,
  purchase_date date,
  documentation text
);

create table batches (
  batch_id text primary key,
  printer text,
  filament_lot_id uuid references filament_lots(id),
  produced_on date,
  operator text,
  qc_result text
);

create table qc_results (
  id uuid primary key default gen_random_uuid(),
  job_id text references production_jobs(id),
  visual_defects boolean,
  sharp_edges boolean,
  moving_parts_ok boolean,
  correct_color boolean,
  correct_personalization boolean,
  dimensions_ok boolean,
  packaging_ok boolean,
  warnings_included boolean,
  notes text,
  created_at timestamptz default now()
);

create table marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  channel order_channel not null,
  master_sku text not null,
  state listing_state not null default 'DRAFT',
  title text,
  description text,
  updated_at timestamptz default now()
);

create table admin_users (
  user_id uuid primary key,
  email text unique not null,
  role admin_role not null
);

create table tickets (
  id uuid primary key default gen_random_uuid(),
  status text check (status in ('NEW','OPEN','WAITING_CUSTOMER','RESOLVED')),
  customer_email text,
  subject text,
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  order_id text references orders(id),
  stars int check (stars between 1 and 5),
  body text,
  photo_url text,
  verified_buyer boolean default true,
  moderated boolean default false,
  created_at timestamptz default now()
);

-- Only ACTIVE products should be exposed publicly via RLS policies (to add with auth).
