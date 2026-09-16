# Produkt-Pipeline — 20 / Tag

Ziel: jeden Tag **20 neue Produkte** veröffentlichen.

## Ablauf

1. **Research** — MakerWorld Hot / Etsy Bestsellers / eigene Ideen (Kategorie wählen)
2. **Rechte** — nur OWN Design oder gekaufte Commercial License
3. **Assets**
   - Master STL → `production/stl/masters/{SKU}_MASTER_v1.stl`
   - Produktbild → `public/products/{sku-lower}.svg` (oder Foto)
4. **Catalog** — Eintrag in neuer Batch-Datei `src/lib/catalog-batch-NN.ts`, in `catalog.ts` mergen
5. **Publish** — `status: "ACTIVE"`, `for_sale: true`
6. **QA** — Shop-Kategorie + Customize-Felder + STL-Name prüfen

## SKU-Schema

```
PL-{PRODUCT}-{COLOR}-{SIZE}
```

Base für Master: `PL-{PRODUCT}` (z. B. `PL-NAME-KEY`)

## Kategorien (Header Mega-Menü)

Siehe `src/lib/categories.ts`:

- Personalisiert (Keychains, Namensschilder, Tags, Ornaments)
- Desk & Setup (Organizer, Ständer, Kabel)
- Play & Fidget (Flexi, Clicker)
- Home & Deko (Lampen, Pflanzen, Haken)
- Kids & Schule (Schul-Tags, Lesezeichen)
- Anlässe (Geburtstag, Hochzeit, Haustiere)

## Batch-Zähler

| Batch | Datum | Count | Datei |
|---|---|---|---|
| 01 | 2026-09-16 | 20 | `catalog-batch-01.ts` |
| 02 | (next) | 20 | `catalog-batch-02.ts` |
