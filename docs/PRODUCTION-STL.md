# Produktions-STL — Naming & Ablauf

## Ordner

```
production/stl/
  masters/     ← Master-Dateien (einmal pro SKU)
  orders/      ← Kopie je Bestellung (automatisch bei Checkout)
  MANIFEST-batch-01.tsv
```

## Master-Dateiname

```
{SKU}_MASTER_v1.stl
```

Beispiel: `PL-NAME-KEY_MASTER_v1.stl`

## Bestell-Dateiname (Print-Floor)

```
{ORDER_ID}__{SKU}__{COLOR}__{CUSTOM}.stl
```

Beispiel nach Bestellung „Anna“, gelb:

```
ORD-2026-000131__PL-NAME-KEY-YEL-M__YEL__ANNA.stl
```

Zusätzlich: `ORD-2026-000131__INDEX.txt` mit allen Dateien der Order.

**Suche nach Bestellung:** Finder/Explorer nach `ORD-2026-000131` sortieren — alle STLs der Order stehen zusammen.

## Batch 01 (20 Produkte)

| SKU | Produkt |
|---|---|
| PL-NAME-KEY | Name Schlüsselanhänger |
| PL-BAG-TAG | Rucksack-Tag |
| PL-FLEXI-DINO | Flexi Dino |
| PL-CLICKER | Fidget Clicker |
| PL-PEN-CUP | Desk Pen Cup |
| PL-ORBIT-CLIP | Orbit Cable Clip |
| PL-PHONE-STAND | Phone Stand |
| PL-DESK-ARC | Desk Arc Stand |
| PL-NAME-RIDGE | Name Ridge |
| PL-LITH-FRAME | Lithophane Rahmen |
| PL-MINI-POT | Mini Planter |
| PL-HEART-BOX | Herz Geschenkbox |
| PL-CAKE-TOP | Cake Topper Name |
| PL-ORNAMENT | Deko Ornament |
| PL-PET-TAG | Haustier-Marke |
| PL-BOOKMARK | Lesezeichen Name |
| PL-HEX-HOOK | Hex Wandhaken |
| PL-SOAP-DISH | Seifenschale |
| PL-CTRL-STAND | Controller Stand |
| PL-FLEX-COIL | Flex Coil |

Master neu generieren:

```bash
python3 scripts/generate-batch-01-assets.py
```

## MakerWorld / Rechte

Marktanalyse: Schlüsselanhänger, Flexi, Clicker, Organizer, Ständer, Ornaments, Cake Topper, Pet Tags.

**Keine fremden MakerWorld-STLs/Fotos ohne Standard Commercial License** in den Shop legen. Batch-01 = eigene Master-Geometrie + Brand-Produktbilder. Wenn du ein MakerWorld-Modell kommerziell nutzen willst: Lizenz kaufen → Datei als `{SKU}_MASTER_v1.stl` ablegen → Produkt in `catalog-batch-01.ts` verknüpfen.

## Personalisierung (Customer → STL)

1. Kunde wählt Produkt auf `/de/customize` oder Produktseite  
2. Name / Initialen / Text + Farbe  
3. Checkout erzeugt Order + kopiert Master → `orders/` mit Custom-Token im Dateinamen  
4. Du öffnest `production/stl/orders/`, suchst `ORD-…`, lädst STL in Bambu Studio, druckst  

Für echte Text-Geometrie (Name als 3D-Buchstaben): später OpenSCAD/MakerLab Customizer anbinden; Dateiname bleibt gleich.
