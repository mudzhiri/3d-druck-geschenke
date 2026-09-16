# E-Mail einrichten — 3d-druck-geschenke.de

## Adressen

| Adresse | Zweck |
|---|---|
| **info@3d-druck-geschenke.de** | Allgemein, Kontaktformular, Newsletter |
| **bestellungen@3d-druck-geschenke.de** | Bestellungen / Shop |
| **support@3d-druck-geschenke.de** | Kundensupport |

Website-Formulare senden an **info@** (über Resend API).

---

## Schritt 1 — Empfang (Cloudflare Email Routing, kostenlos)

DNS liegt schon bei Cloudflare. So legst du die Postfächer als **Weiterleitung** an:

1. Öffne [Cloudflare Dashboard](https://dash.cloudflare.com) → Zone **3d-druck-geschenke.de**
2. Links: **Email** → **Email Routing** → **Get started** / **Enable**
3. Cloudflare legt MX-Records automatisch an (nicht löschen)
4. Unter **Destination addresses**: deine private E-Mail (z. B. Gmail) verifizieren
5. Unter **Routing rules** drei Adressen anlegen:

| Custom address | Action | Send to |
|---|---|---|
| `info` | Send to | deine Gmail/Outlook |
| `bestellungen` | Send to | dieselbe oder getrennte Inbox |
| `support` | Send to | dieselbe oder getrennte Inbox |

6. Speichern. Test: von einem anderen Konto an `info@3d-druck-geschenke.de` schreiben → muss in deiner Inbox ankommen.

> **Hinweis:** Email Routing = Empfangen + Weiterleiten. Zum **Antworten als info@** siehe Schritt 3 (Gmail „Senden als“) oder bezahltes Postfach (Schritt UD / Google Workspace).

---

## Schritt 2 — In deinem Mail-Programm nutzen

### A) Nur Weiterleitung (einfachste Variante)

Du brauchst **kein** neues IMAP-Konto. Mails an info@ landen in deiner bestehenden Inbox.

In Gmail/Apple Mail/Outlook filterst du optional nach:

- An: `info@3d-druck-geschenke.de`
- An: `bestellungen@…`
- An: `support@…`

### B) Gmail — „Senden als info@“ (antworten mit Domain-Adresse)

1. Gmail → **Einstellungen** → **Konten und Import**
2. **„Nachricht senden als“** → **Weitere E-Mail-Adresse hinzufügen**
3. Name: `3D-Druck-Geschenke` · E-Mail: `info@3d-druck-geschenke.de`
4. SMTP (wenn Cloudflare nur Routing hat, brauchst du einen SMTP-Dienst):

**Empfohlen für SMTP (Senden):** [Resend](https://resend.com) Domain verifizieren **oder** united-domains Mailbox / Google Workspace.

Ohne eigenes SMTP kannst du vorübergehend weiter von deiner privaten Adresse antworten (Empfang funktioniert trotzdem).

### C) Apple Mail / Outlook — echtes Postfach (IMAP)

Nur wenn du bei **united-domains** oder Google Workspace ein echtes Postfach gekauft hast:

**Typische UD-Werte (im Kundencenter prüfen):**

| | |
|---|---|
| IMAP-Server | `imap.udag.de` (Port 993, SSL) |
| SMTP-Server | `smtp.udag.de` (Port 587, STARTTLS) |
| Benutzername | volle Adresse `info@3d-druck-geschenke.de` |
| Passwort | das im UD-Kundencenter vergebene |

**Apple Mail:** Ablage → Account hinzufügen → Anderer… → IMAP mit obigen Daten  
**Outlook:** Datei → Konto hinzufügen → erweiterte Einrichtung → IMAP  
**iPhone:** Einstellungen → Mail → Accounts → Account hinzufügen → Andere

Für `bestellungen@` und `support@` denselben Vorgang (oder Alias auf dasselbe Postfach).

---

## Schritt 3 — Senden von der Website (Resend)

Formulare nutzen `RESEND_API_KEY` und schicken an `CONTACT_INBOX=info@3d-druck-geschenke.de`.

1. [resend.com](https://resend.com) → Domains → **3d-druck-geschenke.de** hinzufügen
2. SPF / DKIM / (optional DMARC) Records in Cloudflare eintragen (Resend zeigt die Werte)
3. Env in Vercel:

```
RESEND_API_KEY=re_...
EMAIL_FROM=3D-Druck-Geschenke <noreply@3d-druck-geschenke.de>
CONTACT_INBOX=info@3d-druck-geschenke.de
NEXT_PUBLIC_INFO_EMAIL=info@3d-druck-geschenke.de
NEXT_PUBLIC_SUPPORT_EMAIL=support@3d-druck-geschenke.de
NEXT_PUBLIC_ORDERS_EMAIL=bestellungen@3d-druck-geschenke.de
```

4. Test: [/de/contact](https://www.3d-druck-geschenke.de/de/contact) Formular absenden

---

## Formulare → info@

| Formular | Ziel |
|---|---|
| Kontakt `/de/contact` | `POST /api/contact` → **info@** (+ Bestätigung an Absender) |
| Newsletter Startseite | `POST /api/newsletter` → **info@** + Willkommensmail an Abonnent |

---

## Automatische Mails (Vorlagen)

Vorlagen liegen in `src/lib/email/templates.ts`. Versand über Resend (`RESEND_API_KEY`).

| Anlass | Template-ID | Wann |
|---|---|---|
| Anmeldung / Social Login (neu) | `welcome` | Register + `/auth/callback` (neue Accounts) |
| Newsletter | `newsletter_welcome` | Nach Newsletter-Signup |
| Bestellung | `order_confirmation` | Demo-Checkout + Stripe Webhook |
| Admin-Hinweis | `admin_new_order` | Parallel an **bestellungen@** |
| Zahlung | `payment_confirmation` | Stripe `checkout.session.completed` |
| Produktion gestartet | `production_started` | POD-Bestellung / Webhook |
| Fertig zum Versand | `order_ready` | Ops: `POST /api/ops/send-email` |
| Versandt | `shipped` | Ops |
| Zugestellt | `delivered` | Ops |
| Bewertung | `review_request` | Ops |
| Erstattung | `refund` | Ops |
| Storno | `cancellation` | Ops |
| Retoure | `return_update` | Ops |

Ops-Endpoint (geschützt mit `CRON_SECRET`):

```bash
curl -X POST https://www.3d-druck-geschenke.de/api/ops/send-email \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"to":"kunde@example.com","template":"shipped","locale":"de","name":"Anna","orderId":"ORD-2026-000130","trackingUrl":"https://…"}'
```

Account-UI: `/de/register` (Passwort + Social) · `/de/login` (Passwort + Social + Magic Link)

---

## Checkliste

- [ ] Cloudflare Email Routing aktiv
- [ ] info@ / bestellungen@ / support@ → deine Inbox
- [ ] Testmail empfangen
- [ ] Resend Domain verifiziert
- [ ] Kontaktformular getestet
- [ ] Register + Willkommensmail getestet
- [ ] Demo-Checkout → Bestätigungsmail getestet
- [ ] (Optional) „Senden als“ in Gmail oder UD-IMAP eingerichtet
