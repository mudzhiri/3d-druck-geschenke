# Domain-Setup — 3d-druck-geschenke.de

## Gekauft (united-domains)

| Domain | Rolle |
|---|---|
| `3d-druck-geschenke.de` | **Hauptseite** (Shop) |
| `personalisierte-3d-geschenke.de` | **301-Redirect** → Hauptseite |

B2B bleibt: `teilnachbau.de`

## NICHT kaufen bei united-domains

- WordPress Hosting / Homepage-Baukasten / Webspace  
  → Website läuft auf **Vercel** (Next.js)
- Extra-Domains (.com/.store/.info/.eu) für SEO unnötig

## E-Mail (später, nicht blockierend)

Option A (empfohlen zum Start): **Cloudflare Email Routing** (kostenlos)  
`support@3d-druck-geschenke.de` → weiterleiten an bestehende Inbox

Option B: united-domains E-Mail-Paket **nur für die Hauptdomain**  
(nicht für die Redirect-Domain mitbestellen)

## DNS (sobald Domain aktiv)

### A) Cloudflare (empfohlen)

1. Domain zu Cloudflare hinzufügen (Free)
2. Nameserver bei united-domains auf Cloudflare umstellen
3. Vercel-Domain verbinden → Cloudflare zeigt die Records

### B) Direkt Vercel

Bei Vercel Project → Domains:
- `3d-druck-geschenke.de`
- `www.3d-druck-geschenke.de`

Records bei united-domains (typisch):

| Typ | Name | Wert |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

(Exact values: Vercel Domain-UI folgen.)

### Redirect-Domain

`personalisierte-3d-geschenke.de` → 301 auf `https://3d-druck-geschenke.de`  
Entweder in Vercel als Redirect-Domain oder bei united-domains/Cloudflare Forward.

## Checkliste Owner

- [ ] Domain-Registrierung E-Mail von united-domains abwarten
- [ ] DNS auf Vercel/Cloudflare
- [ ] Redirect zweite Domain
- [ ] SSL aktiv (automatisch bei Vercel)
- [ ] E-Mail später: support@ einrichten
- [ ] Impressum-Daten liefern (Launch-Blocker)
