import type { MetadataRoute } from "next";
import { brand, activeLocales, defaultLocale } from "@/lib/brand";
import { getPublicProductsAsync } from "@/lib/catalog";
import { legalSlugs } from "@/lib/legal/registry";
import { listPublishedPosts } from "@/lib/blog/store";

/**
 * Crawl-budget strategy for Search Console "Gefunden – nicht indexiert":
 * List ONLY the primary locale (de) as <loc>, with full hreflang clusters.
 * Other locales stay reachable via hreflang + internal links, but do not
 * flood the sitemap with 6× near-duplicate URLs.
 */
function siteBase(): string {
  const raw = (brand.domainPlaceholder || "https://www.3d-druck-geschenke.de").replace(/\/$/, "");
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
  const locale = defaultLocale; // de only in <loc>
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

  for (const path of staticPaths) {
    entries.push({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
      priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
      alternates: { languages: languageAlternates(base, path) },
    });
  }

  for (const p of products) {
    const path = `/product/${p.slug}`;
    entries.push({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languageAlternates(base, path) },
    });
  }

  try {
    // Cap blog volume so daily agent posts don't swamp crawl budget
    const posts = (await listPublishedPosts(60)).slice(0, 40);
    for (const post of posts) {
      const path = `/blog/${post.slug}`;
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: post.published_at ? new Date(post.published_at) : new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: { languages: languageAlternates(base, path) },
      });
    }
  } catch {
    // ignore
  }

  return entries;
}
