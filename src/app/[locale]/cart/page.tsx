"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { catalog } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { pickLocalized, type Locale } from "@/lib/brand";
import { track } from "@/lib/analytics";

export default function CartPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params.locale as Locale) || "de";
  const { items, removeItem, updateQty, subtotalCents } = useCart();

  const upsell = catalog
    .filter((p) => !items.some((i) => i.productId === p.id))
    .slice(0, 2);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black">{t(locale, "nav_cart")}</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-muted">{t(locale, "empty_cart")}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((item) => {
            const product = catalog.find((p) => p.id === item.productId);
            const variant = product?.variants.find((v) => v.id === item.variantId);
            if (!product || !variant) return null;
            const personalized = Boolean(
              item.personalization?.name ||
                item.personalization?.initials ||
                item.personalization?.text,
            );
            const unit =
              variant.price_cents +
              (personalized ? variant.personalization_price_cents : 0);
            return (
              <li key={item.key} className="border-2 border-ink bg-fog p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-extrabold uppercase">{pickLocalized(product.name, locale)}</p>
                    <p className="text-sm text-muted">
                      {variant.color.color_name}
                      {personalized
                        ? ` · ${item.personalization?.name || item.personalization?.initials || item.personalization?.text}`
                        : ""}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQty(item.key, Number(e.target.value) || 1)}
                        className="w-16 rounded-md border-2 border-ink bg-paper px-2 py-1"
                      />
                      <button
                        type="button"
                        className="text-sm font-extrabold uppercase underline"
                        onClick={() => removeItem(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-extrabold">{formatMoney(unit * item.quantity)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {upsell.length > 0 && items.length > 0 && (
        <div className="mt-10">
          <h2 className="display text-2xl font-black">Complete your setup</h2>
          <div className="mt-3 space-y-2">
            {upsell.map((p) => (
              <Link
                key={p.id}
                href={`/${locale}/product/${p.slug}`}
                className="block font-extrabold uppercase underline"
              >
                {pickLocalized(p.name, locale)} — {formatMoney(p.variants[0].price_cents)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t-2 border-ink pt-6">
        <p className="text-lg font-extrabold">{formatMoney(subtotalCents)}</p>
        <Link
          href={`/${locale}/checkout`}
          onClick={() => track("begin_checkout", { value: subtotalCents })}
          className="btn-feast px-6 py-3 text-sm"
        >
          {t(locale, "checkout")}
        </Link>
      </div>
    </main>
  );
}
