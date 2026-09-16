"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CatalogProduct } from "@/lib/types";
import { pickLocalized, type Locale } from "@/lib/brand";
import { formatMoney } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function ProductCard({
  product,
  locale,
}: {
  product: CatalogProduct;
  locale: Locale;
}) {
  const price = product.variants[0]?.price_cents ?? 0;
  const name = pickLocalized(product.name, locale);
  const moneyLocale =
    locale === "de"
      ? "de-DE"
      : locale === "fr"
        ? "fr-FR"
        : locale === "es"
          ? "es-ES"
          : locale === "it"
            ? "it-IT"
            : locale === "zh"
              ? "zh-CN"
              : "en-GB";

  return (
    <Link href={`/${locale}/product/${product.slug}`} className="group block min-w-[240px] snap-start">
      <motion.div
        whileHover={{ y: -3 }}
        className="relative overflow-hidden border-2 border-ink bg-fog"
      >
        <div className="relative aspect-square">
          <Image
            src={product.images[0]}
            alt={name}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 70vw, 280px"
          />
        </div>
        {product.drop_label && (
          <span className="absolute left-3 top-3 bg-yellow px-2 py-1 text-[10px] font-extrabold tracking-wide text-ink">
            {product.drop_label}
          </span>
        )}
        {!product.for_sale && (
          <span className="absolute bottom-3 left-3 bg-ink px-2 py-1 text-[10px] font-extrabold text-yellow">
            {t(locale, "draft_badge")}
          </span>
        )}
      </motion.div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 font-extrabold uppercase leading-snug tracking-wide">
          {name}
        </h3>
        <p className="shrink-0 pt-0.5 text-sm font-bold text-muted">
          {formatMoney(price, "EUR", moneyLocale)}
        </p>
      </div>
    </Link>
  );
}
