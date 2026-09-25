import type { MetadataRoute } from "next";
import { brand, activeLocales, defaultLocale } from "@/lib/brand";
import { getPublicProductsAsync } from "@/lib/catalog";
import { legalSlugs } from "@/lib/legal/registry";
import { listPublishedPosts } from "@/lib/blog/store";

function siteBase(): string {
  const raw = (brand.domainPlaceholder || "https://www.3d-druck-geschenke.de").replace(/\/$/, "");
  // Force www canonical host in sitemap (matches live + robots Host)
  return raw
    .replace("https://3d-druck-geschenke.de", "https://www.3d-druck-geschenke.de")
    .replace("http://3d-druck-geschenke.de", "https://www.3d-druck-geschenke.de");
}

function languageAlternates(base: string, path: string): Record<string, string> {
  const langs: Record<string, string> = {
    "x-default": `${base}/${defaultLocale}${path}`,
  };
  for (const l of activeLocales) {
    langs[l] = `${base}/${l}${path}`;
  }
  return langs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteBase();
  // Auth / account pages stay out of the sitemap (noindex + robots disallow).
  const staticPaths = [
    "",
    "/shop",
    "/stores",
    "/customize",
    "/gift-finder",
    "/contact",
    "/faq",
    "/blog",
    ...legalSlugs.map((s) => `/legal/${s}`),
  ];
  const entries: MetadataRoute.Sitemap = [];
  const products = await getPublicProductsAsync();

  // One entry per locale URL, each with full hreflang cluster (fixes "duplicate without canonical")
  for (const locale of activeLocales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        alternates: { languages: languageAlternates(base, path) },
      });
    }
    for (const p of products) {
      const path = `/product/${p.slug}`;
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        alternates: { languages: languageAlternates(base, path) },
      });
    }
  }

  try {
    const posts = await listPublishedPosts();
    for (const locale of activeLocales) {
      for (const post of posts) {
        const path = `/blog/${post.slug}`;
        entries.push({
          url: `${base}/${locale}${path}`,
          lastModified: post.published_at ? new Date(post.published_at) : new Date(),
          alternates: { languages: languageAlternates(base, path) },
        });
      }
    }
  } catch {
    // ignore
  }

  return entries;
}
