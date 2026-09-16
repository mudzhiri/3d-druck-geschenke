"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { catalog } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";
import type { Locale } from "@/lib/brand";
import { pickLocalized } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { t } from "@/lib/i18n";

export default function CheckoutPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params.locale as Locale) || "de";
  const router = useRouter();
  const { items, subtotalCents, clear } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          customer: name,
          locale,
          country: "DE",
          items: items.map((item) => {
            const product = catalog.find((p) => p.id === item.productId)!;
            const variant = product.variants.find((v) => v.id === item.variantId)!;
            return {
              productId: item.productId,
              variantId: item.variantId,
              title: pickLocalized(product.name, locale),
              qty: item.quantity,
              personalization: item.personalization,
              mode: variant.mode,
              unitAmount:
                variant.price_cents +
                (item.personalization?.name ||
                item.personalization?.initials ||
                item.personalization?.text
                  ? variant.personalization_price_cents
                  : 0),
            };
          }),
          revenueCents: subtotalCents,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t(locale, "checkout_failed"));
      track("purchase", { orderId: data.orderId, value: subtotalCents });
      clear();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push(`/${locale}/checkout/success?order=${data.orderId}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t(locale, "checkout_failed"));
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <p className="text-muted">{t(locale, "empty_cart")}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-extrabold">{t(locale, "checkout_title")}</h1>
      <p className="mt-2 text-muted">{t(locale, "checkout_intro")}</p>
      <div className="mt-8 space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t(locale, "label_name")}
          className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-3"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t(locale, "label_email")}
          className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-3"
        />
      </div>
      <p className="mt-6 text-xl font-extrabold">{formatMoney(subtotalCents)}</p>
      {error && <p className="mt-3 text-sm font-semibold text-coral">{error}</p>}
      <button
        type="button"
        disabled={loading || !email || !name}
        onClick={() => void pay()}
        className="btn-feast focus-ring mt-6 w-full px-6 py-4 text-sm disabled:opacity-40"
      >
        {loading ? "…" : t(locale, "checkout_pay")}
      </button>
      <p className="mt-3 text-xs text-muted">{t(locale, "checkout_guest_hint")}</p>
    </main>
  );
}
