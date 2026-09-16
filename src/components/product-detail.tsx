"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { CatalogProduct } from "@/lib/types";
import { pickLocalized, type Locale } from "@/lib/brand";
import { formatMoney } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { stores } from "@/lib/catalog";

export function ProductDetail({
  product,
  locale,
}: {
  product: CatalogProduct;
  locale: Locale;
}) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [initials, setInitials] = useState("");
  const [text, setText] = useState("");

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId],
  );

  const personalized = Boolean(name || initials || text);
  const unit =
    (variant?.price_cents ?? 0) +
    (personalized ? variant?.personalization_price_cents ?? 0 : 0);

  const title = pickLocalized(product.name, locale);
  const description = pickLocalized(product.description, locale);
  const why = pickLocalized(product.why, locale);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 md:px-6 md:py-16">
      <div className="relative aspect-square overflow-hidden border-2 border-ink bg-fog">
        <Image
          src={product.images[0]}
          alt={title}
          fill
          unoptimized
          className="object-contain p-8"
          priority
        />
        {!product.for_sale && (
          <span className="absolute left-4 top-4 bg-ink px-3 py-1 text-xs font-extrabold text-yellow">
            {t(locale, "draft_badge")}
          </span>
        )}
      </div>

      <div>
        {product.drop_label && (
          <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-ink">
            {product.drop_label}
            {product.limited_units
              ? ` · ${t(locale, "only_made", { n: product.limited_units })}`
              : ""}
          </p>
        )}
        <h1 className="display text-5xl font-black md:text-6xl">{title}</h1>
        <p className="mt-3 text-2xl font-extrabold">{formatMoney(unit)}</p>
        <p className="mt-4 text-ink/75">{description}</p>
        {product.production.stl_master_sku && (
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">
            STL · {product.production.stl_master_sku}_MASTER_v1 ·{" "}
            <a
              className="underline"
              href={`/stl/${product.production.stl_master_sku}_MASTER_v1.stl`}
              download
            >
              Download
            </a>
          </p>
        )}

        <div className="mt-8">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-muted">Color</p>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-label={v.color.color_name}
                className="swatch focus-ring"
                data-active={v.id === variant?.id}
                style={{ background: v.color.hex }}
                onClick={() => setVariantId(v.id)}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">{variant?.color.color_name}</p>
        </div>

        {product.personalizable && (
          <div className="mt-8 space-y-3 border-2 border-ink bg-fog p-4">
            <p className="display text-2xl font-black">{t(locale, "cta_customize")}</p>
            {product.personalization_fields.includes("name") && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 12))}
                placeholder="Name"
                className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-2"
              />
            )}
            {product.personalization_fields.includes("initials") && (
              <input
                value={initials}
                onChange={(e) => setInitials(e.target.value.slice(0, 3).toUpperCase())}
                placeholder="Initials"
                className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-2"
              />
            )}
            {product.personalization_fields.includes("text") && (
              <input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 20))}
                placeholder="Text"
                className="focus-ring w-full rounded-md border-2 border-ink bg-paper px-3 py-2"
              />
            )}
            {(name || initials) && (
              <p className="display text-3xl text-ink">{name || initials}</p>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <label className="text-sm font-extrabold uppercase text-muted">Qty</label>
          <input
            type="number"
            min={1}
            max={10}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
            className="focus-ring w-20 rounded-md border-2 border-ink bg-paper px-3 py-2"
          />
        </div>

        <p className="mt-4 text-sm text-muted">
          {variant?.mode === "PRINT_ON_DEMAND"
            ? `Print on demand · ~${product.production.estimated_print_minutes} min`
            : `In stock · ${variant?.available_stock ?? 0}`}
        </p>

        <button
          type="button"
          disabled={!product.for_sale}
          onClick={() => {
            if (!variant || !product.for_sale) return;
            addItem({
              productId: product.id,
              variantId: variant.id,
              quantity: qty,
              personalization: { name, initials, text },
            });
            track("view_item", { slug: product.slug });
          }}
          className="btn-feast focus-ring mt-6 w-full px-6 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.for_sale ? t(locale, "cta_add") : t(locale, "draft_badge")}
        </button>

        <p className="mt-3 text-xs text-muted">
          Apple Pay · Google Pay · PayPal · Card — via Stripe Checkout when enabled.
        </p>

        <div className="mt-10 space-y-6 border-t-2 border-ink pt-8 text-sm">
          <div>
            <h2 className="font-extrabold uppercase">{description ? "Info" : "Info"}</h2>
            <p className="mt-1 text-ink/70">{description}</p>
          </div>
          <div>
            <h2 className="font-extrabold uppercase">Why</h2>
            <p className="mt-1 text-ink/70">{why}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <p><span className="text-muted">Size</span><br />{product.dimensions}</p>
            <p><span className="text-muted">Material</span><br />{product.production.material}</p>
            <p><span className="text-muted">Finish</span><br />{product.finish}</p>
            <p><span className="text-muted">Weight</span><br />{product.weight_g} g</p>
            <p><span className="text-muted">Care</span><br />{pickLocalized(product.care, locale)}</p>
            <p><span className="text-muted">Included</span><br />{pickLocalized(product.included, locale)}</p>
            <p><span className="text-muted">Production</span><br />{product.production.estimated_print_minutes} min</p>
            <p><span className="text-muted">Class</span><br />{product.compliance.product_class}</p>
          </div>
          <p className="text-ink/70">{t(locale, "production_note")}</p>
          <div>
            <h2 className="font-extrabold uppercase">{t(locale, "find_in_store")}</h2>
            <p className="mt-1 text-muted">
              {stores[0]?.name} · {stores[0]?.city} · Stock: Unknown (until retail sync)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
