# DATABASE — POPLOOP

PostgreSQL via Supabase. All money in EUR cents. Timestamps timestamptz.

## Core commerce

- `products` — master product (status, type, license_id, compliance)
- `product_variants` — SKU, color, size, price, personalization flags
- `product_images` / `product_videos`
- `product_translations` — locale title/description
- `collections` + `collection_products`
- `bundles` + `bundle_items`
- `licenses` — design license management
- `color_swatches` — name, hex, filament_sku, printer_profile, stock_material

## Inventory (one source of truth)

- `inventory_items`
  - master_sku
  - physical_stock, reserved_stock, available_stock
  - production_capacity, safety_stock
  - channel mappings: shopify_sku, amazon_sku, ebay_sku, retail_sku

## Orders (omnichannel)

- `orders`
  - internal_id `ORD-YYYY-NNNNNN`
  - channel: `SHOP | AMAZON | EBAY | RETAIL_24_7`
  - external ids retained
  - locale, currency, totals
- `order_items` — personalization JSON, production_mode `IN_STOCK | PRINT_ON_DEMAND`
- `payments`, `shipments`, `return_requests`

## Production

- `product_production_specs`
- `production_jobs` — QUEUED → PRINTING → POST_PROCESSING → QC → PACKING → READY_TO_SHIP → SHIPPED
- `batches` — `B260916-001`
- `filament_lots` — supplier, brand, material, color, lot, docs
- `batch_filament_links`
- `qc_results`
- `printers` — economics fields

## Compliance / safety (GPSR)

- `product_compliance`
  - manufacturer_*, product_identifier, batch_or_version
  - material, warnings, age_recommendation, safety_information
  - compliance_status, documentation refs
  - product_class: `TOY | DECORATION | COLLECTIBLE | ACCESSORY | OTHER`
- Launch rule: TOY without docs → cannot set ACTIVE

## Support / CRM

- `tickets`, `ticket_messages`
- `reviews` — verified buyer only
- `wishlists`
- `newsletter_subscribers` — consent required

## Channel adapters state

- `marketplace_connections` — status, last_sync
- `marketplace_listings` — DRAFT | REVIEW | PUBLISH | LIVE | PAUSED

## Roles

OWNER, ADMIN, PRODUCTION, SUPPORT, MARKETING via `admin_users.role`
