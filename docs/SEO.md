# SEO & Indexierung – 3D-Druck-Geschenke

## Live Assets

| Asset | URL |
| --- | --- |
| Sitemap | https://www.3d-druck-geschenke.de/sitemap.xml |
| Robots | https://www.3d-druck-geschenke.de/robots.txt |
| IndexNow Key | https://www.3d-druck-geschenke.de/indexnow-key.txt |

## Google Search Console

Properties sollten Domain- oder URL-Präfix-Properties sein für:

- `3d-druck-geschenke.de` / `https://www.3d-druck-geschenke.de`
- optional Redirect-Domain `personalisierte-3d-geschenke.de`

1. Sitemap einreichen: `https://www.3d-druck-geschenke.de/sitemap.xml`
2. Wichtige URLs unter URL-Prüfung → Indexierung beantragen:
   - `/de`, `/de/shop`, `/de/blog`, Top-Produkte
3. Optional Meta-Verifizierung: Env `GOOGLE_SITE_VERIFICATION` in Vercel

## IndexNow (Bing / Yandex / andere)

Täglicher Cron: `/api/cron/indexnow` (11:00 UTC).  
Manuell:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://www.3d-druck-geschenke.de/api/cron/indexnow
```

Google nutzt IndexNow nicht direkt — Sitemap + GSC bleiben Pflicht.

## Env

```bash
GOOGLE_SITE_VERIFICATION=...
INDEXNOW_KEY=0d04e07ec50b46feb89c7356224a7f95
NEXT_PUBLIC_SITE_URL=https://www.3d-druck-geschenke.de
```
