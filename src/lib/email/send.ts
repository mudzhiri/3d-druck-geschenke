import { Resend } from "resend";
import { brand } from "@/lib/brand";

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export function getMailFrom() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    `${brand.name} <${brand.emails.noreply}>`
  );
}

export function getInfoInbox() {
  return (
    process.env.CONTACT_INBOX?.trim() ||
    process.env.NEXT_PUBLIC_INFO_EMAIL?.trim() ||
    brand.infoEmail
  );
}

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.info("[email:dry-run]", options.subject, options.to);
    return { ok: true as const, dryRun: true as const };
  }

  const to = (Array.isArray(options.to) ? options.to : [options.to]).filter(Boolean);
  const { error } = await resend.emails.send({
    from: getMailFrom(),
    to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });

  if (error) {
    console.error("[email:error]", error);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, dryRun: false as const };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function contactAdminEmail(data: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  return {
    subject: `[Kontakt] ${data.topic} — ${data.name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;color:#0a0a0a">
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>E-Mail:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Thema:</strong> ${escapeHtml(data.topic)}</p>
        <p><strong>Nachricht:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
        <hr/>
        <p style="font-size:12px;color:#666">Inbox: ${getInfoInbox()}</p>
      </div>
    `,
    replyTo: data.email,
  };
}

export function contactConfirmEmail(data: { name: string; locale: string }) {
  const de = data.locale === "de";
  return {
    subject: de
      ? `Wir haben deine Nachricht erhalten — ${brand.name}`
      : `We got your message — ${brand.name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;color:#0a0a0a">
        <h2>${de ? "Danke" : "Thanks"}, ${escapeHtml(data.name)}</h2>
        <p>${
          de
            ? "Deine Nachricht ist bei uns angekommen. Wir melden uns in der Regel innerhalb von 1–2 Werktagen."
            : "Your message arrived. We usually reply within 1–2 business days."
        }</p>
        <p style="font-size:12px;color:#666">${brand.infoEmail}</p>
      </div>
    `,
  };
}

export function newsletterAdminEmail(data: { email: string; locale: string }) {
  return {
    subject: `[Newsletter] Neue Anmeldung — ${data.email}`,
    html: `
      <div style="font-family:system-ui,sans-serif">
        <p>Neue Newsletter-Anmeldung:</p>
        <p><strong>${escapeHtml(data.email)}</strong></p>
        <p>Locale: ${escapeHtml(data.locale)}</p>
        <p style="font-size:12px;color:#666">Consent via Website-Form (Opt-in).</p>
      </div>
    `,
  };
}
