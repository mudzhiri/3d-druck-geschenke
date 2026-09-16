# OMNICHANNEL — Inventory & Marketplaces

## Principle

One MASTER SKU. Example: `PL-FLEX-DRAGON-BLK-M`

Channels map to master SKU; never invent parallel product identities.

## Channels

| Channel | Code | MVP |
|---|---|---|
| Own shop | `SHOP` | Live |
| Amazon | `AMAZON` | Adapter stub — NOT CONNECTED |
| eBay | `EBAY` | Adapter stub — NOT CONNECTED |
| Physical 24/7 | `RETAIL_24_7` | Manual stock correction |

## Inventory sync rules

1. Sale on any channel → reserve/decrement available_stock
2. Propagate to other connected channels
3. If `available_stock <= safety_stock` → reduce marketplace quantity
4. Print-on-demand: cap offers by `production_capacity`, never infinite
5. Daily reconciliation cron + mismatch alerts

## Adapter interfaces

```ts
interface MarketplaceAdapter {
  syncListings(): Promise<void>
  syncInventory(): Promise<void>
  syncOrders(): Promise<void>
  syncPrices(): Promise<void>
  pushTracking(): Promise<void>
  getReturns(): Promise<void>
}
```

- `AmazonMarketplaceAdapter` — Selling Partner API only (no scrape)
- `eBayMarketplaceAdapter` — Inventory API + seller-defined SKU = MASTER SKU
- `Retail24_7Adapter` — import/manual until TCN/VMMS API verified

## Publish safety

Marketplace content: DRAFT → REVIEW → PUBLISH  
No bulk live edits. Sandbox / single SKU dry-run first.

## Channel content

Per-channel title/description/image/keyword templates. Do not copy identical low-quality text blindly.
