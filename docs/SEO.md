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

## „Gefunden – zurzeit nicht indexiert“ (GSC)

Das ist **kein Hard-Error**. Google kennt die URL (meist über die Sitemap), hat sie aber noch nicht gecrawlt/indexiert.

### Was wir technisch gemacht haben

- Permanente Redirects (308) Apex → www → `/de`
- Sitemap: nur noch **`de` als `<loc>`**, andere Sprachen nur als **hreflang** (weniger Crawl-Budget-Verschwendung)
- Blog in Sitemap auf max. 40 Posts begrenzt

### Was du in Search Console tun solltest

1. Validierung laufen lassen (bereits gestartet am 24.09.) — oft **Tage bis Wochen**
2. **Priorität manuell beantragen** (URL-Prüfung → Indexierung beantragen):
   - `/de`
   - `/de/shop`
   - 5–10 Top-Produkte
   - 2–3 starke Blogposts
3. Nicht alle 749 URLs einzeln anfragen — verschwendet Quota

### Warum Google zögert

- Neue/junge Domain + viele URLs auf einmal
- Dünne Blogseiten (~200–300 Wörter) haben niedrige Priorität
- 6 Locales verdoppeln/versechsfachen die URL-Menge ohne eigenen Content-Wert

Platz 1 kommt erst, wenn DE-Seiten regelmäßig gecrawlt und als nützlich eingestuft werden.