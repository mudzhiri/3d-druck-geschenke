# Environment Audit — 2026-09-16

## Existing assets

| Asset | Status | Notes |
|---|---|---|
| `3d-print/` (TeilNachbau) | Live service site | Quote/request B2B-ish replacement-part business — **separate** from this consumer brand |
| `3d-print_seite/` | Empty → new brand shop | Target for this build |
| Domain `teilnachbau.de` | Exists | Service brand only; do **not** auto-buy a new consumer domain |
| GitHub `mudzhiri/teilnachbau` | Connected | Consumer brand needs its own repo when ready |
| Vercel | Deployed for TeilNachbau | Reuse pattern; separate project for consumer brand |
| Supabase | Credentials present (TeilNachbau) | New schema/project recommended for consumer brand isolation |
| Stripe | Keys present (TeilNachbau) | Can reuse account with separate products; no Shopify |
| Resend | API key present | Domain verify still flagged for TeilNachbau |
| Email inboxes | `info@` + `bestellungen@teilnachbau.de` | United Domains Mail M |
| OpenAI | Present | Chat + blog agents exist on service site |
| Shopify | **Not connected** | No credentials found |
| Amazon SP-API | **Not connected** | No credentials found |
| eBay API | **Not connected** | No credentials found |
| Legal entity data | **PLACEHOLDER** | Impressum incomplete — launch block until filled |
| Product catalog (consumer) | **None** | Demo products only as DRAFT / NOT FOR SALE |
| 24/7 retail | Planned channel | Manual inventory correction until API verified |
| Mobbin MCP | Paid plan required | Design principles from brief + Feastables inspiration only |

## Architecture decision (pragmatic)

**MVP commerce:** Next.js (App Router) + Supabase + Stripe Checkout  
**Not Shopify (yet):** No Shopify credentials; Shopify Basic ≈ €25–39/mo requires owner COST PROPOSAL approval. Existing Stripe/Supabase/Vercel stack ships Phase 1 without new billing.

**Shopify path:** Adapter interface + Storefront API hooks prepared; migrate when owner approves subscription.

## Separation rule

TeilNachbau = manufacturing/service for replacement parts.  
This project = consumer product brand (3D print is the factory, not the message).
