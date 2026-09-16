# Täglicher Blog-Agent (12:00 Berlin)

Jeden Tag um **12:00 Europe/Berlin** läuft die 4-Agenten-Pipeline.

Vercel Cron (UTC): `0 10 * * *` → 12:00 CEST / 11:00 CET.

## Agenten

| # | Step | Aufgabe |
|---|---|---|
| 1 | `1_inspect_published` | Liest bereits veröffentlichte Artikel (Titel, Keywords) |
| 2 | `2_research_seo_topic` | Wählt/erfindet bestes neues SEO-Thema + Intent-Recherche |
| 3 | `3_write_images_metadata` | Schreibt SEO-Artikel inkl. Cover, seoTitle, Description, Keywords → Publish |
| 4 | `4_verify_seo_photos` | Testet Index, Artikel, Meta, Cover-Bild, Shop-CTA, Sitemap |

Max. **1** neuer Agent-Artikel pro Berlin-Tag (außer `?force=1`).

## URLs

- Blog: `/de/blog`
- Artikel: `/de/blog/{slug}`
- Cron: `GET/POST /api/cron/daily-blog`

## Env

```bash
OPENAI_API_KEY=...
OPENAI_BLOG_MODEL=gpt-4.1-mini
CRON_SECRET=...
SUPABASE_SERVICE_ROLE_KEY=...   # nötig zum Publishen
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://www.3d-druck-geschenke.de
CONTACT_INBOX=info@3d-druck-geschenke.de
```

Tabelle: `gift_blog_posts` (Supabase / TeilNachbau-Projekt).

## Manuell

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://www.3d-druck-geschenke.de/api/cron/daily-blog?force=1"
```
