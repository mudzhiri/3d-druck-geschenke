import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createOrderFromCart } from "@/lib/orders/store";
import { sendTransactionalEmail } from "@/lib/email/transactional";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ ok: false, message: "Webhook not configured" }, { status: 501 });
  }

  const StripeSdk = (await import("stripe")).default;
  const stripe = new StripeSdk(key);
  const sig = request.headers.get("stripe-signature");
  const raw = await request.text();
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const order = createOrderFromCart({
      email: session.customer_details?.email ?? session.customer_email ?? "unknown@example.com",
      customer: session.customer_details?.name ?? "Customer",
      locale: session.locale === "de" ? "de" : "en",
      country: session.customer_details?.address?.country ?? "DE",
      items: [
        {
          productId: "webhook-item",
          variantId: "webhook-variant",
          title: "Stripe line items (expand in production)",
          qty: 1,
          mode: "PRINT_ON_DEMAND",
        },
      ],
      revenueCents: session.amount_total ?? 0,
      externalId: session.id,
    });
    await sendTransactionalEmail({
      to: order.email,
      template: "payment_confirmation",
      locale: order.locale,
      orderId: order.id,
    });
  }

  return NextResponse.json({ received: true });
}
