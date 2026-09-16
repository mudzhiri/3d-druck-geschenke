import { CartProvider } from "@/lib/cart";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ChatAssistant } from "@/components/chat-assistant";
import { CookieBanner } from "@/components/cookie-banner";
import { HtmlLang } from "@/components/html-lang";
import { activeLocales, type Locale } from "@/lib/brand";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return activeLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!activeLocales.includes(raw as Locale)) notFound();
  const locale = raw as Locale;

  return (
    <CartProvider>
      <HtmlLang locale={locale} />
      <div className="pt-[var(--header-h)]">
        <SiteHeader locale={locale} />
        {children}
        <SiteFooter locale={locale} />
        <ChatAssistant locale={locale} />
        <CookieBanner locale={locale} />
      </div>
    </CartProvider>
  );
}
