import type { MetadataRoute } from "next";
import { brand, activeLocales } from "@/lib/brand";
import { getPublicProducts } from "@/lib/catalog";
import { legalSlugs } from "@/lib/legal/registry";
import { listPublishedPosts } from "@/lib/blog/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = brand.domainPlaceholder;
  const staticPaths = [
    "",
    "/shop",
    "/stores",
    "/customize",
    "/gift-finder",
    "/contact",
    "/faq",
    "/blog",
    "/login",
    "/register",
    "/account",
    ...legalSlugs.map((s) => `/legal/${s}`),
  ];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of activeLocales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            activeLocales.map((l) => [l, `${base}/${l}${path}`]),
          ),
        },
      });
    }
    for (const p of getPublicProducts()) {
      entries.push({
        url: `${base}/${locale}/product/${p.slug}`,
        lastModified: new Date(),
      });
    }
  }

  try {
    const posts = await listPublishedPosts();
    for (const locale of activeLocales) {
      for (const post of posts) {
        entries.push({
          url: `${base}/${locale}/blog/${post.slug}`,
          lastModified: post.published_at ? new Date(post.published_at) : new Date(),
        });
      }
    }
  } catch {
    // ignore
  }

  return entries;
}
