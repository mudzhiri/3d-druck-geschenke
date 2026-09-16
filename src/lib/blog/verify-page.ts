import { brand } from "@/lib/brand";

export type PageCheckResult = {
  ok: boolean;
  checks: Array<{ name: string; ok: boolean; detail?: string }>;
};

function absolute(path: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || brand.domainPlaceholder).replace(
    /\/$/,
    "",
  );
  // Prefer www live domain for verification
  const site = base.includes("localhost")
    ? "https://www.3d-druck-geschenke.de"
    : base;
  return `${site}${path.startsWith("/") ? path : `/${path}`}`;
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "3DG-BlogAgent/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

/** Agent 4: verify index, article, images, SEO meta */
export async function verifyPublishedBlogPage(opts: {
  slug: string;
  title: string;
  coverImageUrl?: string | null;
  locale?: string;
}): Promise<PageCheckResult> {
  const locale = opts.locale ?? "de";
  const checks: PageCheckResult["checks"] = [];

  try {
    const index = await fetchText(absolute(`/${locale}/blog`));
    checks.push({
      name: "blog_index_status",
      ok: index.status === 200,
      detail: `HTTP ${index.status}`,
    });
    checks.push({
      name: "blog_index_has_slug_or_title",
      ok:
        index.text.includes(`/blog/${opts.slug}`) ||
        index.text.includes(opts.title.slice(0, 40)),
      detail: opts.slug,
    });
  } catch (error) {
    checks.push({
      name: "blog_index_fetch",
      ok: false,
      detail: error instanceof Error ? error.message : "fetch failed",
    });
  }

  try {
    const article = await fetchText(absolute(`/${locale}/blog/${opts.slug}`));
    checks.push({
      name: "article_status",
      ok: article.status === 200,
      detail: `HTTP ${article.status}`,
    });
    checks.push({
      name: "article_has_title",
      ok: article.text.includes(opts.title.slice(0, Math.min(40, opts.title.length))),
      detail: opts.title.slice(0, 60),
    });
    checks.push({
      name: "article_has_body",
      ok: article.text.length > 1200,
      detail: `html_bytes=${article.text.length}`,
    });
    checks.push({
      name: "article_seo_meta_description",
      ok: /name=["']description["']/i.test(article.text),
      detail: "meta description",
    });
    checks.push({
      name: "article_has_image_tag",
      ok: /<img[\s>]/i.test(article.text) || /og:image/i.test(article.text),
      detail: "img or og:image",
    });
    checks.push({
      name: "article_has_shop_cta",
      ok: article.text.includes("/shop") || article.text.includes("Shop"),
      detail: "shop cta",
    });
  } catch (error) {
    checks.push({
      name: "article_fetch",
      ok: false,
      detail: error instanceof Error ? error.message : "fetch failed",
    });
  }

  if (opts.coverImageUrl?.startsWith("http")) {
    try {
      const img = await fetch(opts.coverImageUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(15_000),
        redirect: "follow",
      });
      checks.push({
        name: "cover_image_reachable",
        ok: img.ok || img.status === 405,
        detail: `HTTP ${img.status}`,
      });
    } catch (error) {
      checks.push({
        name: "cover_image_reachable",
        ok: false,
        detail: error instanceof Error ? error.message : "img failed",
      });
    }
  } else {
    checks.push({
      name: "cover_image_present",
      ok: Boolean(opts.coverImageUrl),
      detail: opts.coverImageUrl ?? "missing",
    });
  }

  try {
    const sm = await fetchText(absolute("/sitemap.xml"));
    checks.push({
      name: "sitemap_reachable",
      ok: sm.status === 200,
      detail: `HTTP ${sm.status}`,
    });
  } catch {
    checks.push({ name: "sitemap_reachable", ok: false, detail: "unreachable" });
  }

  return {
    ok: checks.filter((c) => !c.name.startsWith("sitemap")).every((c) => c.ok),
    checks,
  };
}
