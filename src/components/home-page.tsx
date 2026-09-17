"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getPublicProducts } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/types";
import { brand, pickLocalized, type Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { vibeLabels } from "@/lib/product-i18n";
import { ProductCard } from "./product-card";

const vibes = ["PLAY", "DESK", "ROOM", "GAMING", "GIFTS", "CUSTOM"] as const;

export function HomePage({
  locale,
  products: productsProp,
}: {
  locale: Locale;
  products?: CatalogProduct[];
}) {
  const products = productsProp ?? getPublicProducts();
  const drops = products.filter((p) => p.group === "DROP" || p.drop_label);
  const heroes = products.filter((p) => p.group === "HERO" || p.group === "EVERGREEN");
  const marquee = t(locale, "marquee");

  return (
    <main className={locale === "zh" ? "lang-zh" : undefined}>
      {/* Marquee — Feastables energy */}
      <div className="overflow-hidden border-b-2 border-ink bg-ink py-2 text-yellow">
        <div className="marquee-track flex whitespace-nowrap text-sm font-extrabold tracking-[0.18em]">
          <span>{marquee}</span>
          <span aria-hidden>{marquee}</span>
        </div>
      </div>

      {/* HERO — full-bleed yellow plane, brand first */}
      <section className="hero-grid relative flex min-h-[calc(100svh-var(--header-h)-40px)] items-end overflow-hidden border-b-2 border-ink">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[-6%] top-[8%] h-[72%] w-[72%] md:right-[4%] md:w-[46%]"
          >
            <div className="floaty relative h-full w-full">
              <Image
                src="/products/pl-flex-coil.png"
                alt=""
                fill
                priority
                unoptimized
                className="object-contain drop-shadow-[12px_18px_0_rgba(10,10,10,0.2)]"
              />
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-10 md:px-6 md:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-ink/80"
          >
            {brand.name}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="display max-w-[14ch] text-5xl font-black text-ink md:text-7xl lg:text-[5.5rem]"
          >
            {pickLocalized(brand.headline, locale)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-6 max-w-md text-base font-medium leading-relaxed text-ink/80 md:text-lg"
          >
            {pickLocalized(brand.subline, locale)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href={`/${locale}/shop/drops`} className="btn-feast focus-ring px-6 py-3 text-sm">
              {t(locale, "cta_shop_drop")}
            </Link>
            <Link href={`/${locale}/shop`} className="btn-ghost focus-ring px-6 py-3 text-sm">
              {t(locale, "cta_explore")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NEW DROP */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="display text-4xl font-black md:text-5xl">{t(locale, "section_new_drop")}</h2>
          <Link href={`/${locale}/shop/drops`} className="text-sm font-extrabold uppercase underline">
            {t(locale, "view_all")}
          </Link>
        </div>
        <div className="flex snap-x gap-5 overflow-x-auto pb-2">
          {(drops.length ? drops : products).map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="border-y-2 border-ink bg-fog px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="display mb-8 text-4xl font-black md:text-5xl">
            {t(locale, "section_bestsellers")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {heroes.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY VIBE */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <h2 className="display mb-8 text-4xl font-black md:text-5xl">{t(locale, "section_vibe")}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {vibes.map((v) => (
            <Link
              key={v}
              href={`/${locale}/shop/${v.toLowerCase()}`}
              className="focus-ring group border-2 border-ink bg-paper px-5 py-10 transition hover:bg-yellow"
            >
              <span className="display text-3xl font-black md:text-4xl">
                {vibeLabels[v][locale]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PERSONALIZATION */}
      <section className="border-y-2 border-ink bg-yellow px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="display max-w-[12ch] text-5xl font-black text-ink md:text-7xl">
            {t(locale, "section_make_yours")}
          </h2>
          <p className="mt-5 max-w-lg text-lg font-medium text-ink/80">
            {t(locale, "section_make_yours_body")}
          </p>
          <Link href={`/${locale}/customize`} className="btn-ghost focus-ring mt-8 px-6 py-3 text-sm">
            {t(locale, "cta_customize")}
          </Link>
        </div>
      </section>

      {/* BTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="display text-4xl font-black md:text-5xl">{t(locale, "section_bts")}</h2>
            <p className="mt-4 text-ink/75">{t(locale, "section_bts_body")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                "bts_step_design",
                "bts_step_print",
                "bts_step_finish",
                "bts_step_pack",
              ] as const
            ).map((key) => (
              <div key={key} className="border-2 border-ink bg-fog p-6">
                <p className="display text-2xl font-black">{t(locale, key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="border-t-2 border-ink bg-ink px-4 py-16 text-paper md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="display mb-8 text-4xl font-black text-yellow md:text-5xl">
            {t(locale, "section_why")}
          </h2>
          <ul className="grid gap-4 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="border-t-2 border-yellow pt-4 text-lg font-extrabold">
                {t(locale, `why_${n}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="display mb-4 text-4xl font-black md:text-5xl">{t(locale, "section_social")}</h2>
          <p className="max-w-xl text-muted">{t(locale, "section_social_body")}</p>
        </div>
      </section>

      {/* IRL */}
      <section className="border-t-2 border-ink bg-fog px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="display text-4xl font-black md:text-5xl">{t(locale, "section_irl")}</h2>
          <p className="mt-4 max-w-lg text-ink/75">{t(locale, "section_irl_body")}</p>
          <Link href={`/${locale}/stores`} className="btn-feast focus-ring mt-6 px-6 py-3 text-sm">
            {t(locale, "nav_find_store")}
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t-2 border-ink px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="display text-4xl font-black md:text-5xl">{t(locale, "section_newsletter")}</h2>
          <p className="mt-3 max-w-md text-ink/70">{t(locale, "section_newsletter_body")}</p>
          <NewsletterForm locale={locale} />
        </div>
      </section>
    </main>
  );
}

function NewsletterForm({ locale }: { locale: Locale }) {
  return (
    <form
      className="mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") ?? "");
        void fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, locale, website: String(fd.get("website") ?? "") }),
        }).then(async (res) => {
          alert(res.ok ? t(locale, "newsletter_thanks") : t(locale, "contact_form_error"));
          if (res.ok) e.currentTarget.reset();
        });
      }}
    >
      <input
        required
        type="email"
        name="email"
        placeholder="you@email.com"
        className="focus-ring flex-1 rounded-md border-2 border-ink bg-paper px-4 py-3"
      />
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <button type="submit" className="btn-feast px-6 py-3 text-sm">
        {t(locale, "join")}
      </button>
      <p className="basis-full text-xs text-muted sm:col-span-2">{t(locale, "newsletter_consent")}</p>
    </form>
  );
}
