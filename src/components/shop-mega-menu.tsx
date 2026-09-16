"use client";

import Link from "next/link";
import { useState } from "react";
import { pickLocalized, type Locale } from "@/lib/brand";
import { shopCategories } from "@/lib/categories";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ShopMegaMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "focus-ring inline-flex items-center gap-1 hover:underline",
          open && "underline",
        )}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {t(locale, "nav_shop")}
        <span aria-hidden className="text-[10px]">
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 w-[min(92vw,720px)] border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_#0A0A0A]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-muted">
              {t(locale, "nav_categories")}
            </p>
            <Link
              href={`/${locale}/shop`}
              className="text-xs font-extrabold uppercase underline"
              onClick={() => setOpen(false)}
            >
              {t(locale, "nav_all_products")}
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shopCategories.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/${locale}/shop/${cat.slug}`}
                  className="display text-lg font-black uppercase hover:text-coral"
                  onClick={() => setOpen(false)}
                >
                  {pickLocalized(cat.name, locale)}
                </Link>
                <ul className="mt-2 space-y-1">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/${locale}/shop/${cat.slug}/${sub.slug}`}
                        className="text-sm text-ink/75 hover:text-ink hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        {pickLocalized(sub.name, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t-2 border-ink/10 pt-3">
            <Link
              href={`/${locale}/customize`}
              className="text-sm font-extrabold uppercase underline"
              onClick={() => setOpen(false)}
            >
              {t(locale, "nav_custom")} → STL Personalisierung
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
