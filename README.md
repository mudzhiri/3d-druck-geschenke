# 3D-Druck-Geschenke

Consumer Shop für selbst gefertigte 3D-Druck-Produkte & Geschenke.

**Hauptdomain:** https://3d-druck-geschenke.de  
**Redirect:** https://personalisierte-3d-geschenke.de → Hauptdomain  
**B2B / Nachbau:** https://teilnachbau.de (separat)

## Lokal starten

```bash
cd 3d-print_seite
cp .env.example .env.local
npm install
npm run dev -- -p 3001
```

→ http://localhost:3001/de

## united-domains: Was du NICHT brauchst

- WordPress / Baukasten / Webspace → **nein** (Hosting = Vercel)
- E-Mail-Paket → später optional, oder Cloudflare Forward

Siehe `docs/DOMAIN-SETUP.md`.

## Docs

- `docs/DOMAIN-SETUP.md`
- `docs/ARCHITECTURE.md`
- `docs/LAUNCH-CHECKLIST.md`
- `LAUNCH-REPORT.md`
