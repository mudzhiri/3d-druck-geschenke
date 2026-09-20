import { notFound } from "next/navigation";
import { getProductAsync } from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";
import type { Locale } from "@/lib/brand";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";

/** Daily agent SKUs must resolve without waiting for a rebuild. */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductAsync(slug);
  if (!product) return {};
  const lang = locale === "en" ? "en" : "de";
  return {
    title: product.name[lang],
    description: product.description[lang],
    alternates: {
      canonical: `/${locale}/product/${slug}`,
      languages: {
        de: `/de/product/${slug}`,
        en: `/en/product/${slug}`,
      },
    },
    openGraph: {
      title: `${product.name[lang]} · ${brand.name}`,
      images: product.images.filter((src) => !src.startsWith("data:")),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProductAsync(slug);
  if (!product) notFound();
  const variant = product.variants[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name.en,
    image: product.images.filter((src) => !src.startsWith("data:")),
    description: product.description.en,
    sku: variant?.master_sku,
    brand: { "@type": "Brand", name: brand.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: ((variant?.price_cents ?? 0) / 100).toFixed(2),
      availability: product.for_sale
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} locale={locale as Locale} />
    </main>
  );
}
