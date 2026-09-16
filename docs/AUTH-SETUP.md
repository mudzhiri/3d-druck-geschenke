# Auth / Social Login Setup

## Providers on the shop

| Button | Mechanism | Env / Dashboard |
|---|---|---|
| Google | Supabase OAuth `google` | Enable in Supabase Auth → Providers |
| Facebook | Supabase OAuth `facebook` | Meta App + Supabase Facebook provider |
| Microsoft | Supabase OAuth `azure` | Azure AD app + Supabase Azure provider |
| TikTok | Custom OAuth → Supabase session | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` |
| Instagram | Custom OAuth → Supabase session | `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` |
| Magic Link | Supabase OTP email | Auth email templates / SMTP |
| E-Mail + Passwort | Supabase `signUp` / `signInWithPassword` | Auth → Providers → Email aktiv |

## Shop-Routen

| Route | Zweck |
|---|---|
| `/de/register` | Konto erstellen (Social + Passwort) → Willkommensmail |
| `/de/login` | Einloggen (Social + Passwort + Magic Link) |
| `/de/account` | Kontobereich (geschützt) |
| `/auth/callback` | OAuth / Magic-Link Callback (+ Welcome bei neuen Accounts) |

## Supabase project

Free-tier limit reached (2 projects). Shop currently uses **TeilNachbau** Supabase:

- URL: `https://buuxsezmgyoeojmihoso.supabase.co`
- Dedicated shop project: pause/upgrade another project first, then recreate.

## Redirect URLs (Supabase → Authentication → URL Configuration)

Add:

```
https://3d-druck-geschenke.de/auth/callback
https://www.3d-druck-geschenke.de/auth/callback
https://3d-printseite.vercel.app/auth/callback
http://localhost:3001/auth/callback
```

Site URL: `https://www.3d-druck-geschenke.de`

## Enable native providers

Social buttons appear **only** when the matching env flag is `true` on Vercel:

```
NEXT_PUBLIC_AUTH_GOOGLE=true
NEXT_PUBLIC_AUTH_FACEBOOK=true
NEXT_PUBLIC_AUTH_MICROSOFT=true
NEXT_PUBLIC_AUTH_TIKTOK=true
NEXT_PUBLIC_AUTH_INSTAGRAM=true
```

Until then, **E-Mail + Passwort** is the working path (shown first on login/register).

1. **Google** — Google Cloud Console OAuth client → Client ID/Secret into Supabase Google provider. Redirect: `https://buuxsezmgyoeojmihoso.supabase.co/auth/v1/callback` → set `NEXT_PUBLIC_AUTH_GOOGLE=true` + redeploy
2. **Facebook** — Meta Developer App → Facebook Login → same Supabase callback → `NEXT_PUBLIC_AUTH_FACEBOOK=true`
3. **Microsoft** — Azure Portal App registration → Supabase Azure provider → `NEXT_PUBLIC_AUTH_MICROSOFT=true`

OAuth start goes through `/api/auth/oauth/start` (preflight). Disabled providers redirect back to login with a clear error instead of raw JSON.

## TikTok

1. [TikTok Developers](https://developers.tiktok.com/) → Login Kit
2. Redirect: `https://www.3d-druck-geschenke.de/api/auth/tiktok/callback`
3. Set `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`

## Instagram

1. Meta Developer → Instagram API with Instagram Login
2. Redirect: `https://www.3d-druck-geschenke.de/api/auth/instagram/callback`
3. Set `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`

## Routes

- Login UI: `/[locale]/login`
- Account: `/[locale]/account` (requires session)
- Callback: `/auth/callback`
