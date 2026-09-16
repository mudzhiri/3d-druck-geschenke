# ARCHITECTURE — POPLOOP Consumer Brand Shop

## Stack (MVP)

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 16 App Router + TypeScript + Tailwind 4 + Framer Motion | SEO, speed, Vercel, premium motion |
| Commerce | Stripe Checkout + Cart in app | Existing credentials; no new subscription |
| Data | Supabase PostgreSQL + Auth + Storage | Orders, inventory, production, compliance |
| Email | Resend transactional | Existing provider |
| AI | OpenAI (catalog-grounded tools) | Shopping assistant + internal agents |
| i18n | `/[locale]/` (`de`, `en`) — ready for `fr`, `es`, `it`, `nl`, `pl` | hreflang + Markets-ready |
| Hosting | Vercel | Matches existing ops |

## Explicit non-choices (MVP)

- **Shopify:** deferred — COST PROPOSAL required (~€25–39/mo Basic + transaction fees). Adapter stubs ready for Storefront API migration.
- **Amazon / eBay live publish:** adapters exist, status `NOT_CONNECTED`, publish workflow DRAFT → REVIEW → PUBLISH only.
- **Printer remote control:** architecture hooks only; no unsafe remote print without official secure integration.

## System map

```
Product Idea → Product Record → License Check → Compliance Gate
  → Production Spec → Website (ACTIVE only)
  → [Amazon / eBay / 24/7] after review
  → Order Hub → Inventory lock → Production Queue
  → QC → Pack → Ship → Support → Analytics
```

## App routes

### Storefront
- `/[locale]` — Homepage
- `/[locale]/shop` — All products
- `/[locale]/shop/[collection]` — Vibe collections
- `/[locale]/product/[slug]` — PDP + customize
- `/[locale]/cart`
- `/[locale]/checkout` → Stripe
- `/[locale]/account/*`
- `/[locale]/stores` — Store locator
- `/[locale]/gift-finder`
- Legal pages under `/[locale]/legal/*`

### Admin (role-gated)
- `/admin` — Business dashboard
- `/admin/orders` — Omnichannel order hub
- `/admin/production` — Queue
- `/admin/inventory`
- `/admin/products` — PIM + compliance + licenses
- `/admin/support`
- `/admin/channels` — Amazon/eBay/24-7 status

### APIs
- `/api/checkout` — Stripe session
- `/api/webhooks/stripe`
- `/api/ai/shop` — Shopping assistant (tool-calling, real catalog)
- `/api/cron/*` — inventory reconcile, sync stubs, audits

## Brand config

Single source: `src/lib/brand.ts`  
Env override: `NEXT_PUBLIC_BRAND_NAME`, `NEXT_PUBLIC_SITE_URL`

## Security

- Secrets only in env / Vercel / Supabase
- Never commit `.env.local`
- Admin: email allowlist + Supabase Auth
- AI: no invented stock/prices/discounts; order lookup only after auth
