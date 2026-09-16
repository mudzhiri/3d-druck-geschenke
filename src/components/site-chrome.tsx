"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  activeLocales,
  brand,
  localeLabels,
  type Locale,
} from "@/lib/brand";
import { t } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { BrandLogo } from "./brand-logo";
import { openCookieSettings } from "./cookie-banner";
import { cn } from "@/lib/utils";
import { legalTitles, type LegalSlug } from "@/lib/legal/registry";
import { ShopMegaMenu } from "./shop-mega-menu";

function switchLocalePath(pathname: string | null, from: Locale, to: Locale) {
  if (!pathname) return `/${to}`;
  if (pathname === `/${from}` || pathname.startsWith(`/${from}/`)) {
    return pathname.replace(`/${from}`, `/${to}`);
  }
  return `/${to}${pathname}`;
}

const footerLegal: LegalSlug[] = [
  "impressum",
  "datenschutz",
  "agb",
  "widerruf",
  "versand",
  "zahlung",
  "retouren",
  "cookies",
  "produktsicherheit",
  "barrierefreiheit",
  "streitbeilegung",
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const { count } = useCart();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);

  const links = [
    { href: `/${locale}/shop/drops`, label: t(locale, "nav_drops") },
    { href: `/${locale}/blog`, label: t(locale, "blog_title") },
    { href: `/${locale}/customize`, label: t(locale, "nav_custom") },
    { href: `/${locale}/stores`, label: t(locale, "nav_find_store") },
    { href: `/${locale}/login`, label: t(locale, "auth_login_title") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        <Link href={`/${locale}`} className="focus-ring shrink-0">
          <BrandLogo markOnly className="sm:hidden" />
          <BrandLogo className="hidden sm:inline-flex" />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-extrabold uppercase tracking-[0.06em] text-ink lg:gap-7 md:flex">
          <ShopMegaMenu locale={locale} />
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="focus-ring hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="focus-ring rounded-md border-2 border-ink px-2.5 py-1 text-xs font-extrabold uppercase"
              aria-expanded={langOpen}
              aria-label={t(locale, "language")}
            >
              {localeLabels[locale]}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[7.5rem] border-2 border-ink bg-paper shadow-[4px_4px_0_#0A0A0A]">
                {activeLocales.map((l) => (
                  <Link
                    key={l}
                    href={switchLocalePath(pathname, locale, l)}
                    onClick={() => setLangOpen(false)}
                    className={cn(
                      "block px-3 py-2 text-xs font-extrabold uppercase hover:bg-yellow",
                      l === locale && "bg-yellow",
                    )}
                  >
                    {localeLabels[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/shop`}
            className="focus-ring text-xs font-extrabold uppercase hover:underline md:hidden"
          >
            {t(locale, "nav_shop")}
          </Link>

          <Link
            href={`/${locale}/account`}
            className="focus-ring hidden text-xs font-extrabold uppercase hover:underline sm:inline"
          >
            {t(locale, "nav_account")}
          </Link>

          <Link href={`/${locale}/cart`} className="btn-feast focus-ring px-3 py-1.5 text-xs">
            {t(locale, "nav_cart")}
            {count > 0 ? ` (${count})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t-2 border-ink bg-ink px-4 py-16 text-paper md:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo invert />
          <p className="mt-4 max-w-sm text-sm text-paper/70">{brand.tagline[locale]}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-extrabold uppercase">{t(locale, "nav_shop")}</p>
          <Link className="block text-paper/70 hover:text-yellow" href={`/${locale}/shop`}>
            {t(locale, "cta_explore")}
          </Link>
          <Link className="block text-paper/70 hover:text-yellow" href={`/${locale}/blog`}>
            {t(locale, "blog_title")}
          </Link>
          <Link className="block text-paper/70 hover:text-yellow" href={`/${locale}/gift-finder`}>
            {t(locale, "gift_finder")}
          </Link>
          <Link className="block text-paper/70 hover:text-yellow" href={`/${locale}/stores`}>
            {t(locale, "nav_find_store")}
          </Link>
          <Link className="block text-paper/70 hover:text-yellow" href={`/${locale}/faq`}>
            {t(locale, "faq_title")}
          </Link>
          <Link className="block text-paper/70 hover:text-yellow" href={`/${locale}/contact`}>
            {t(locale, "nav_contact")}
          </Link>
          <Link className="block text-paper/70 hover:text-yellow" href={`/${locale}/login`}>
            {t(locale, "auth_login_title")}
          </Link>
          <Link className="block text-paper/70 hover:text-yellow" href={`/${locale}/register`}>
            {t(locale, "auth_create_account")}
          </Link>
        </div>
        <div className="space-y-2 text-sm lg:col-span-2">
          <p className="font-extrabold uppercase">{t(locale, "legal_nav")}</p>
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {footerLegal.map((slug) => (
              <Link
                key={slug}
                className="block text-paper/70 hover:text-yellow"
                href={`/${locale}/legal/${slug}`}
              >
                {legalTitles[slug][locale]}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => openCookieSettings()}
              className="block text-left text-paper/70 hover:text-yellow"
            >
              {t(locale, "cookie_settings")}
            </button>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl text-xs text-paper/50">
        © {new Date().getFullYear()} {brand.name}.{" "}
        <a className="underline hover:text-yellow" href={`mailto:${brand.infoEmail}`}>
          {brand.infoEmail}
        </a>
        {" · "}
        <a className="underline hover:text-yellow" href={`mailto:${brand.supportEmail}`}>
          {brand.supportEmail}
        </a>
        {" · "}
        <a className="underline hover:text-yellow" href={`mailto:${brand.ordersEmail}`}>
          {brand.ordersEmail}
        </a>
      </p>
    </footer>
  );
}
