import { Resend } from "resend";
import { brand } from "../brand";

export type MailTemplate =
  | "order_confirmation"
  | "payment_confirmation"
  | "production_started"
  | "order_ready"
  | "shipped"
  | "delivered"
  | "review_request"
  | "refund"
  | "cancellation"
  | "return_update";

const subjects: Record<"de" | "en", Record<MailTemplate, string>> = {
  de: {
    order_confirmation: "Bestellung bestätigt",
    payment_confirmation: "Zahlung erhalten",
    production_started: "Wir fertigen dein Stück",
    order_ready: "Bereit zum Versand",
    shipped: "Unterwegs",
    delivered: "Zugestellt",
    review_request: "Wie war’s?",
    refund: "Erstattung",
    cancellation: "Stornierung",
    return_update: "Retouren-Update",
  },
  en: {
    order_confirmation: "Order confirmed",
    payment_confirmation: "Payment received",
    production_started: "We’re making your piece",
    order_ready: "Ready to ship",
    shipped: "On the way",
    delivered: "Delivered",
    review_request: "How was it?",
    refund: "Refund",
    cancellation: "Cancellation",
    return_update: "Return update",
  },
};

export async function sendTransactionalEmail(input: {
  to: string;
  template: MailTemplate;
  locale: "de" | "en";
  orderId: string;
  bodyExtra?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `${brand.name} <noreply@PLACEHOLDER.domain>`;
  const subject = `${brand.name}: ${subjects[input.locale][input.template]} (${input.orderId})`;
  const html = `
    <div style="font-family:Arial,sans-serif;background:#0B0B0F;color:#F4F1EA;padding:32px">
      <h1 style="font-size:28px;letter-spacing:-0.03em">${brand.name}</h1>
      <p style="font-size:18px">${subjects[input.locale][input.template]}</p>
      <p>Order: <strong>${input.orderId}</strong></p>
      ${input.bodyExtra ? `<p>${input.bodyExtra}</p>` : ""}
      <p style="color:#9a968c;font-size:12px">support: ${brand.supportEmail}</p>
    </div>
  `;

  if (!apiKey) {
    console.info("[email:dry-run]", { to: input.to, subject });
    return { ok: true, dryRun: true };
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: input.to,
    replyTo: brand.supportEmail,
    subject,
    html,
  });
  return { ok: true, dryRun: false };
}
