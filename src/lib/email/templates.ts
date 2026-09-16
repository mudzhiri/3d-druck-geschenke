import { brand } from "@/lib/brand";

export type MailLocale = "de" | "en";

export type MailTemplateId =
  | "welcome"
  | "order_confirmation"
  | "payment_confirmation"
  | "production_started"
  | "order_ready"
  | "shipped"
  | "delivered"
  | "review_request"
  | "refund"
  | "cancellation"
  | "return_update"
  | "newsletter_welcome"
  | "admin_new_order";

type TemplateVars = {
  name?: string;
  email?: string;
  orderId?: string;
  orderTotal?: string;
  trackingUrl?: string;
  itemsSummary?: string;
  extraHtml?: string;
};

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function layout(opts: {
  locale: MailLocale;
  preheader: string;
  title: string;
  bodyHtml: string;
}) {
  const support = brand.supportEmail;
  const site = brand.domainPlaceholder.replace(/\/$/, "");
  return `<!DOCTYPE html>
<html lang="${opts.locale}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width"/>
  <title>${esc(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#F3F3F1;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0A0A0A;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F3F3F1;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:2px solid #0A0A0A;">
        <tr>
          <td style="background:#FFE600;padding:20px 24px;border-bottom:2px solid #0A0A0A;">
            <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:-0.03em;text-transform:uppercase;">${esc(brand.wordmark)}</p>
            <p style="margin:6px 0 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;opacity:0.75;">${esc(brand.name)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px;">
            <h1 style="margin:0 0 14px;font-size:26px;line-height:1.15;letter-spacing:-0.03em;text-transform:uppercase;">${esc(opts.title)}</h1>
            <div style="font-size:15px;line-height:1.65;color:#222;">${opts.bodyHtml}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px;border-top:2px solid #0A0A0A;background:#0A0A0A;color:#fff;font-size:12px;">
            <p style="margin:0;">${esc(brand.name)} · <a href="${site}" style="color:#FFE600;text-decoration:none;">${site.replace(/^https?:\/\//, "")}</a></p>
            <p style="margin:8px 0 0;opacity:0.75;">
              ${opts.locale === "de" ? "Support" : "Support"}:
              <a href="mailto:${support}" style="color:#FFE600;text-decoration:none;">${support}</a>
              · <a href="mailto:${brand.ordersEmail}" style="color:#FFE600;text-decoration:none;">${brand.ordersEmail}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const copy: Record<
  MailTemplateId,
  Record<MailLocale, { subject: string; preheader: string; title: string; paragraphs: string[] }>
> = {
  welcome: {
    de: {
      subject: `Willkommen bei ${brand.name}`,
      preheader: "Dein Konto ist bereit — Shoppen, Merken, Nachbestellen.",
      title: "Willkommen an Bord",
      paragraphs: [
        "Hallo {name},",
        "dein Konto ist eingerichtet. Ab jetzt kannst du Bestellungen tracken, Adressen speichern und personalisierte Favoriten wiederfinden.",
        "Gastkauf bleibt möglich — Account ist optional, aber praktisch.",
      ],
    },
    en: {
      subject: `Welcome to ${brand.name}`,
      preheader: "Your account is ready — shop, save, reorder.",
      title: "Welcome aboard",
      paragraphs: [
        "Hi {name},",
        "your account is set up. Track orders, save addresses, and reorder personalized favorites.",
        "Guest checkout still works — account is optional, but handy.",
      ],
    },
  },
  order_confirmation: {
    de: {
      subject: `Bestellung bestätigt — {orderId}`,
      preheader: "Danke! Wir haben deine Bestellung erhalten.",
      title: "Bestellung bestätigt",
      paragraphs: [
        "Hallo {name},",
        "danke für deine Bestellung <strong>{orderId}</strong>.",
        "{itemsSummary}",
        "Gesamt: <strong>{orderTotal}</strong>",
        "Personalisierte / Print-on-Demand-Artikel gehen in die Fertigung. Du bekommst Updates per E-Mail.",
      ],
    },
    en: {
      subject: `Order confirmed — {orderId}`,
      preheader: "Thanks! We received your order.",
      title: "Order confirmed",
      paragraphs: [
        "Hi {name},",
        "thanks for your order <strong>{orderId}</strong>.",
        "{itemsSummary}",
        "Total: <strong>{orderTotal}</strong>",
        "Personalized / print-on-demand items go into production. We’ll email updates.",
      ],
    },
  },
  payment_confirmation: {
    de: {
      subject: `Zahlung erhalten — {orderId}`,
      preheader: "Deine Zahlung ist eingegangen.",
      title: "Zahlung erhalten",
      paragraphs: [
        "Hallo {name},",
        "wir haben die Zahlung für Bestellung <strong>{orderId}</strong> erhalten ({orderTotal}).",
        "Als Nächstes: Fertigung bzw. Versandvorbereitung.",
      ],
    },
    en: {
      subject: `Payment received — {orderId}`,
      preheader: "Your payment went through.",
      title: "Payment received",
      paragraphs: [
        "Hi {name},",
        "we received payment for order <strong>{orderId}</strong> ({orderTotal}).",
        "Next: production and/or packing.",
      ],
    },
  },
  production_started: {
    de: {
      subject: `Wir fertigen dein Stück — {orderId}`,
      preheader: "Der Druck läuft.",
      title: "Fertigung gestartet",
      paragraphs: [
        "Hallo {name},",
        "Bestellung <strong>{orderId}</strong> ist in der Produktion.",
        "Schichtlinien gehören zur 3D-Fertigung — sichtbarer Charakter inklusive.",
      ],
    },
    en: {
      subject: `We’re making your piece — {orderId}`,
      preheader: "Production has started.",
      title: "Production started",
      paragraphs: [
        "Hi {name},",
        "order <strong>{orderId}</strong> is in production.",
        "Layer lines are part of 3D printing — manufacturing character included.",
      ],
    },
  },
  order_ready: {
    de: {
      subject: `Bereit zum Versand — {orderId}`,
      preheader: "Dein Paket wird vorbereitet.",
      title: "Bereit zum Versand",
      paragraphs: [
        "Hallo {name},",
        "Bestellung <strong>{orderId}</strong> ist fertig und wird verpackt.",
      ],
    },
    en: {
      subject: `Ready to ship — {orderId}`,
      preheader: "Your order is packed next.",
      title: "Ready to ship",
      paragraphs: [
        "Hi {name},",
        "order <strong>{orderId}</strong> is ready and heading to packing.",
      ],
    },
  },
  shipped: {
    de: {
      subject: `Unterwegs — {orderId}`,
      preheader: "Dein Paket ist raus.",
      title: "Versendet",
      paragraphs: [
        "Hallo {name},",
        "Bestellung <strong>{orderId}</strong> ist unterwegs.",
        "{trackingUrl}",
      ],
    },
    en: {
      subject: `On the way — {orderId}`,
      preheader: "Your parcel has shipped.",
      title: "Shipped",
      paragraphs: [
        "Hi {name},",
        "order <strong>{orderId}</strong> is on the way.",
        "{trackingUrl}",
      ],
    },
  },
  delivered: {
    de: {
      subject: `Zugestellt — {orderId}`,
      preheader: "Viel Spaß mit deinem Stück.",
      title: "Zugestellt",
      paragraphs: [
        "Hallo {name},",
        "Bestellung <strong>{orderId}</strong> sollte bei dir sein. Viel Spaß!",
      ],
    },
    en: {
      subject: `Delivered — {orderId}`,
      preheader: "Enjoy your piece.",
      title: "Delivered",
      paragraphs: [
        "Hi {name},",
        "order <strong>{orderId}</strong> should be with you. Enjoy!",
      ],
    },
  },
  review_request: {
    de: {
      subject: `Wie war’s? — {orderId}`,
      preheader: "Kurzes Feedback hilft uns enorm.",
      title: "Wie war’s?",
      paragraphs: [
        "Hallo {name},",
        "hat Bestellung <strong>{orderId}</strong> gepasst? Wir freuen uns über ehrliches Feedback.",
      ],
    },
    en: {
      subject: `How was it? — {orderId}`,
      preheader: "A quick review helps a lot.",
      title: "How was it?",
      paragraphs: [
        "Hi {name},",
        "how was order <strong>{orderId}</strong>? Honest feedback means a lot.",
      ],
    },
  },
  refund: {
    de: {
      subject: `Erstattung — {orderId}`,
      preheader: "Deine Erstattung ist unterwegs.",
      title: "Erstattung",
      paragraphs: [
        "Hallo {name},",
        "für Bestellung <strong>{orderId}</strong> haben wir eine Erstattung ausgelöst ({orderTotal}).",
        "Je nach Zahlungsart dauert die Gutschrift einige Werktage.",
      ],
    },
    en: {
      subject: `Refund — {orderId}`,
      preheader: "Your refund is on the way.",
      title: "Refund",
      paragraphs: [
        "Hi {name},",
        "we issued a refund for order <strong>{orderId}</strong> ({orderTotal}).",
        "Depending on the payment method it can take a few business days.",
      ],
    },
  },
  cancellation: {
    de: {
      subject: `Stornierung — {orderId}`,
      preheader: "Deine Bestellung wurde storniert.",
      title: "Stornierung",
      paragraphs: [
        "Hallo {name},",
        "Bestellung <strong>{orderId}</strong> wurde storniert.",
        "Fragen? Schreib an {support}.",
      ],
    },
    en: {
      subject: `Cancellation — {orderId}`,
      preheader: "Your order was cancelled.",
      title: "Cancellation",
      paragraphs: [
        "Hi {name},",
        "order <strong>{orderId}</strong> was cancelled.",
        "Questions? Email {support}.",
      ],
    },
  },
  return_update: {
    de: {
      subject: `Retouren-Update — {orderId}`,
      preheader: "Update zu deiner Retoure.",
      title: "Retouren-Update",
      paragraphs: [
        "Hallo {name},",
        "Update zu Bestellung <strong>{orderId}</strong> / Retoure:",
        "{extra}",
      ],
    },
    en: {
      subject: `Return update — {orderId}`,
      preheader: "An update on your return.",
      title: "Return update",
      paragraphs: [
        "Hi {name},",
        "update on order <strong>{orderId}</strong> / return:",
        "{extra}",
      ],
    },
  },
  newsletter_welcome: {
    de: {
      subject: `First dibs — ${brand.name}`,
      preheader: "Drops & Surprises in dein Inbox.",
      title: "Du bist dabei",
      paragraphs: [
        "Danke fürs Anmelden. Du bekommst Drops und News — nur mit Opt-in, kein Spam.",
      ],
    },
    en: {
      subject: `First dibs — ${brand.name}`,
      preheader: "Drops & surprises in your inbox.",
      title: "You’re in",
      paragraphs: [
        "Thanks for joining. You’ll get drops and news — consent only, no spam.",
      ],
    },
  },
  admin_new_order: {
    de: {
      subject: `[Order] {orderId} — {orderTotal}`,
      preheader: "Neue Shop-Bestellung",
      title: "Neue Bestellung",
      paragraphs: [
        "Kunde: {name} ({email})",
        "Order: {orderId}",
        "Summe: {orderTotal}",
        "{itemsSummary}",
      ],
    },
    en: {
      subject: `[Order] {orderId} — {orderTotal}`,
      preheader: "New shop order",
      title: "New order",
      paragraphs: [
        "Customer: {name} ({email})",
        "Order: {orderId}",
        "Total: {orderTotal}",
        "{itemsSummary}",
      ],
    },
  },
};

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

export function buildMailTemplate(
  id: MailTemplateId,
  locale: MailLocale,
  vars: TemplateVars = {},
) {
  const t = copy[id][locale];
  const map: Record<string, string> = {
    name: esc(vars.name || (locale === "de" ? "du" : "there")),
    email: esc(vars.email || ""),
    orderId: esc(vars.orderId || "—"),
    orderTotal: esc(vars.orderTotal || "—"),
    itemsSummary: vars.itemsSummary || "",
    trackingUrl: vars.trackingUrl
      ? locale === "de"
        ? `Sendungsverfolgung: <a href="${esc(vars.trackingUrl)}">${esc(vars.trackingUrl)}</a>`
        : `Tracking: <a href="${esc(vars.trackingUrl)}">${esc(vars.trackingUrl)}</a>`
      : "",
    extra: vars.extraHtml || "",
    support: esc(brand.supportEmail),
  };

  const bodyHtml = [
    ...t.paragraphs.map((p) => `<p style="margin:0 0 12px;">${fill(p, map)}</p>`),
    id === "welcome"
      ? `<p style="margin:20px 0 0;"><a href="${brand.domainPlaceholder}/de/shop" style="display:inline-block;background:#FFE600;color:#0A0A0A;font-weight:800;text-decoration:none;padding:12px 18px;border:2px solid #0A0A0A;text-transform:uppercase;">Shop</a></p>`
      : "",
    id === "order_confirmation" || id === "payment_confirmation"
      ? `<p style="margin:20px 0 0;font-size:12px;color:#666;">${
          locale === "de"
            ? "Fragen zur Bestellung: " + brand.ordersEmail
            : "Order questions: " + brand.ordersEmail
        }</p>`
      : "",
  ].join("");

  return {
    subject: fill(t.subject, map).replace(/<[^>]+>/g, ""),
    html: layout({
      locale,
      preheader: fill(t.preheader, map).replace(/<[^>]+>/g, ""),
      title: t.title,
      bodyHtml,
    }),
  };
}

export const ALL_MAIL_TEMPLATES = Object.keys(copy) as MailTemplateId[];
