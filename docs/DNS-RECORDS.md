# DNS Records — LIVE

## Online

| URL | Status |
|---|---|
| https://www.3d-druck-geschenke.de | **LIVE** (Vercel Valid + SSL) |
| https://3d-druck-geschenke.de | **LIVE** (308 → www) |
| https://3d-printseite.vercel.app | LIVE (Zwischen-URL) |

## Cloudflare Nameserver

- `mcgrory.ns.cloudflare.com`
- `stephane.ns.cloudflare.com`

| Domain | NS öffentlich | Cloudflare Zone |
|---|---|---|
| `3d-druck-geschenke.de` | Cloudflare ✅ | Free, DNS → Vercel |
| `personalisierte-3d-geschenke.de` | noch UD (Switch gestartet) | Free Zone bereit |

## DNS in Cloudflare (Hauptdomain)

| Typ | Name | Wert | Proxy |
|---|---|---|---|
| A | `@` | `216.198.79.1` | DNS only |
| CNAME | `www` | `76a05a778a44aa59.vercel-dns-017.com` | DNS only |

## Redirect-Domain

`personalisierte-3d-geschenke.de` → nach NS-Propagation in Vercel als 301 auf `www.3d-druck-geschenke.de` eintragen.
