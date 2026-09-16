import { brand } from "@/lib/brand";
import { sendEmail } from "@/lib/email/send";
import {
  buildMailTemplate,
  type MailLocale,
  type MailTemplateId,
} from "@/lib/email/templates";
import { formatMoney } from "@/lib/utils";

export type { MailTemplateId, MailLocale };

function normalizeLocale(locale?: string): MailLocale {
  return locale === "en" ? "en" : "de";
}

export async function sendTemplateEmail(input: {
  to: string;
  template: MailTemplateId;
  locale?: string;
  name?: string;
  email?: string;
  orderId?: string;
  orderTotalCents?: number;
  itemsSummary?: string;
  trackingUrl?: string;
  extraHtml?: string;
  replyTo?: string;
}) {
  const locale = normalizeLocale(input.locale);
  const built = buildMailTemplate(input.template, locale, {
    name: input.name,
    email: input.email || input.to,
    orderId: input.orderId,
    orderTotal:
      typeof input.orderTotalCents === "number"
        ? formatMoney(input.orderTotalCents)
        : undefined,
    itemsSummary: input.itemsSummary,
    trackingUrl: input.trackingUrl,
    extraHtml: input.extraHtml,
  });

  return sendEmail({
    to: input.to,
    subject: built.subject,
    html: built.html,
    replyTo: input.replyTo || brand.supportEmail,
  });
}

/** @deprecated use sendTemplateEmail — kept for existing imports */
export type MailTemplate = MailTemplateId;

export async function sendTransactionalEmail(input: {
  to: string;
  template: MailTemplateId;
  locale: "de" | "en";
  orderId: string;
  bodyExtra?: string;
  name?: string;
  orderTotalCents?: number;
  itemsSummary?: string;
}) {
  return sendTemplateEmail({
    to: input.to,
    template: input.template,
    locale: input.locale,
    orderId: input.orderId,
    name: input.name,
    orderTotalCents: input.orderTotalCents,
    itemsSummary: input.itemsSummary,
    extraHtml: input.bodyExtra,
  });
}

export async function sendWelcomeEmail(input: {
  to: string;
  name?: string;
  locale?: string;
}) {
  return sendTemplateEmail({
    to: input.to,
    template: "welcome",
    locale: input.locale,
    name: input.name || input.to.split("@")[0],
    email: input.to,
  });
}

export async function sendOrderEmails(input: {
  to: string;
  name: string;
  orderId: string;
  locale?: string;
  orderTotalCents: number;
  items: Array<{ title: string; qty: number }>;
}) {
  const itemsSummary = `<ul>${input.items
    .map((i) => `<li>${i.qty}× ${i.title}</li>`)
    .join("")}</ul>`;

  const customer = await sendTemplateEmail({
    to: input.to,
    template: "order_confirmation",
    locale: input.locale,
    name: input.name,
    email: input.to,
    orderId: input.orderId,
    orderTotalCents: input.orderTotalCents,
    itemsSummary,
    replyTo: brand.ordersEmail,
  });

  const admin = await sendTemplateEmail({
    to: brand.ordersEmail,
    template: "admin_new_order",
    locale: "de",
    name: input.name,
    email: input.to,
    orderId: input.orderId,
    orderTotalCents: input.orderTotalCents,
    itemsSummary,
    replyTo: input.to,
  });

  return { customer, admin };
}
