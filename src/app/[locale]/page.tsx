import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { brand, type Locale, activeLocales } from "@/lib/brand";
import { getPublicProductsAsync } from "@/lib/catalog";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "de";
  return {
    title: `${brand.name} — ${brand.headline[lang]}`,
    description: brand.tagline[lang],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(activeLocales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!activeLocales.includes(raw as Locale)) notFound();
  const products = await getPublicProductsAsync();
  return <HomePage locale={raw as Locale} products={products} />;
}
