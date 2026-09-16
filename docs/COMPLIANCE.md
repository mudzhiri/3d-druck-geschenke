# Compliance checklist — 3d-druck-geschenke.de

Stand: 2026-09-16

## Live pages

| Page | Path | Status |
|---|---|---|
| Impressum (§ 5 DDG) | `/legal/impressum` | Template — fill PLACEHOLDERs |
| Datenschutz (DSGVO) | `/legal/datenschutz` | Draft |
| AGB | `/legal/agb` | Draft |
| Widerruf + Musterformular | `/legal/widerruf` | Draft |
| Versand | `/legal/versand` | Draft |
| Zahlung | `/legal/zahlung` | Draft |
| Retouren | `/legal/retouren` | Draft |
| Cookies + Banner (TDDDG) | `/legal/cookies` + banner | Draft |
| Produktsicherheit GPSR | `/legal/produktsicherheit` | Draft |
| Barrierefreiheit (BFSG) | `/legal/barrierefreiheit` | Draft |
| Streitbeilegung / ODR | `/legal/streitbeilegung` | Draft |
| Kontakt | `/contact` | Live |
| FAQ | `/faq` | Live |

## Env placeholders to fill before public sale

```
NEXT_PUBLIC_LEGAL_NAME=
NEXT_PUBLIC_LEGAL_STREET=
NEXT_PUBLIC_LEGAL_ZIP=
NEXT_PUBLIC_LEGAL_CITY=
NEXT_PUBLIC_LEGAL_PHONE=
NEXT_PUBLIC_VAT_ID=
NEXT_PUBLIC_REGISTER_COURT=
NEXT_PUBLIC_REGISTER_NUMBER=
NEXT_PUBLIC_MANAGING_DIRECTOR=
NEXT_PUBLIC_RESPONSIBLE_CONTENT=
NEXT_PUBLIC_MANUFACTURER_NAME=
NEXT_PUBLIC_MANUFACTURER_ADDRESS=
NEXT_PUBLIC_MANUFACTURER_EMAIL=
```

## Still required (process, not only pages)

1. Anwaltliche Freigabe AGB / Widerruf / Datenschutz
2. AV-Verträge (Vercel, Stripe, Resend/Supabase)
3. Verarbeitungsverzeichnis
4. GPSR: Herstellerdaten final + Toy compliance nur bei CLEARED
5. Stripe Keys + echte Preise inkl. MwSt.
6. Admin Auth absichern
