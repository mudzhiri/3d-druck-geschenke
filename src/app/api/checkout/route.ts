import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { createOrderFromCart } from "@/lib/orders/store";
import { sendOrderEmails, sendTemplateEmail } from "@/lib/email/transactional";
import { brand } from "@/lib/brand";

const bodySchema = z.object({
  email: z.string().email(),
  customer: z.string().min(1),
  locale: z.enum(["de", "en", "fr", "es", "it", "zh"]).default("de"),
  country: z.string().default("DE"),
  revenueCents: z.number().int().nonnegative(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      title: z.string(),
      qty: z.number().int().positive(),
      personalization: z
        .object({
          name: z.string().optional(),
          initials: z.string().optional(),
          text: z.string().optional(),
        })
        .optional(),
      mode: z.enum(["IN_STOCK", "PRINT_ON_DEMAND"]),
      unitAmount: z.number().int().nonnegative(),
    }),
  ),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }
  const data = parsed.data;

  if (data.items.length === 0) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? brand.domainPlaceholder;
  const mailLocale = data.locale === "en" ? "en" : "de";

  if (stripeKey && process.env.ALLOW_DEMO_CHECKOUT === "true") {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      line_items: data.items.map((item) => ({
        quantity: item.qty,
        price_data: {
          currency: "eur",
          unit_amount: item.unitAmount,
          product_data: {
            name: item.title,
            metadata: {
              personalization: JSON.stringify(item.personalization ?? {}),
            },
          },
        },
      })),
      success_url: `${siteUrl}/${data.locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${data.locale}/cart`,
      locale: data.locale === "de" ? "de" : "en",
      metadata: {
        customer_name: data.customer,
        app_locale: data.locale,
      },
    });
    return NextResponse.json({ url: session.url, sessionId: session.id });
  }

  const order = createOrderFromCart({
    email: data.email,
    customer: data.customer,
    locale: mailLocale,
    country: data.country,
    items: data.items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      title: i.title,
      qty: i.qty,
      personalization: i.personalization as Record<string, string> | undefined,
      mode: i.mode,
    })),
    revenueCents: data.revenueCents,
  });

  await sendOrderEmails({
    to: data.email,
    name: data.customer,
    orderId: order.id,
    locale: mailLocale,
    orderTotalCents: data.revenueCents,
    items: data.items.map((i) => ({ title: i.title, qty: i.qty })),
  });

  // If POD items exist, also send production_started shortly (same request for demo)
  if (data.items.some((i) => i.mode === "PRINT_ON_DEMAND")) {
    await sendTemplateEmail({
      to: data.email,
      template: "production_started",
      locale: mailLocale,
      name: data.customer,
      orderId: order.id,
    });
  }

  return NextResponse.json({
    orderId: order.id,
    url: null,
    note: "Demo order created (Stripe live checkout requires ALLOW_DEMO_CHECKOUT=true + keys).",
  });
}
