import { NextResponse } from "next/server";
import { z } from "zod";
import {
  sendTemplateEmail,
  type MailTemplateId,
} from "@/lib/email/transactional";

const TEMPLATES = [
  "welcome",
  "order_confirmation",
  "payment_confirmation",
  "production_started",
  "order_ready",
  "shipped",
  "delivered",
  "review_request",
  "refund",
  "cancellation",
  "return_update",
  "newsletter_welcome",
  "admin_new_order",
] as const satisfies readonly MailTemplateId[];

const schema = z.object({
  to: z.string().email(),
  template: z.enum(TEMPLATES),
  locale: z.enum(["de", "en"]).default("de"),
  name: z.string().optional(),
  orderId: z.string().optional(),
  orderTotalCents: z.number().int().nonnegative().optional(),
  itemsSummary: z.string().optional(),
  trackingUrl: z.string().url().optional(),
});

/**
 * Ops helper to send any transactional template.
 * Protected by CRON_SECRET (Authorization: Bearer … or ?secret=).
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 501 });
  }
  const auth = request.headers.get("authorization");
  const url = new URL(request.url);
  const ok =
    auth === `Bearer ${secret}` || url.searchParams.get("secret") === secret;
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await sendTemplateEmail(parsed.data);
  return NextResponse.json({ ok: result.ok, dryRun: "dryRun" in result ? result.dryRun : false });
}
