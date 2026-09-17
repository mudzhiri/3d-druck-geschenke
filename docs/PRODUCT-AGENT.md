# Täglicher Produkt-Agent (12:00 Berlin)

Jeden Tag um **12:00 Europe/Berlin** recherchiert der Agent Trends und published bis zu **20 neue Shop-Artikel**.

Vercel Cron (UTC): `0 10 * * *` → `/api/cron/daily-products`

## Pipeline

| # | Step | Aufgabe |
|---|---|---|
| 1 | `1_research_internet` | Web-Suche (DuckDuckGo) nach angesagten 3D-Geschenken |
| 2 | `2_makerworld_trends` | MakerWorld-Trending als Inspiration (Titel/Kategorien) — **kein STL/Foto-Scraping** |
| 3 | `3_presentable_photos` | Eigene Studio-SVGs (Feastables-Look) → Storage oder Data-URL |
| 4 | `4_integrate_catalog` | Upsert in `gift_agent_products` → Shop/Drops live |

## Lizenz / Rechte

- MakerWorld nur als **Marktforschung** (was angesagt ist)
- Keine fremden STLs, Geometrien oder Produktfotos übernehmen
- Listings sind **OWN** / trend-inspirierte Original-Präsentationen
- IP-Blockliste filtert Franchise-/Marken-Titel (Pokemon, Disney, …)

## Env

```bash
CRON_SECRET=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Manuell

```bash
npm run products:daily -- --force

curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://www.3d-druck-geschenke.de/api/cron/daily-products?force=1&limit=20"
```

## Angesagte Arten (aktuell)

Personalisiert (Name-Keychains), Fidget/Gyro, Desk-Organizer, Filament-Clips, Phone/Watch-Stands, Flexi, Spardosen, Planter, Seasonal Ornaments, Pet Tags, Cake Topper, Household Gadgets.
