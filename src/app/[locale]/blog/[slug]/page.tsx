import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/brand";
import { getPostBySlug, listPublishedPosts } from "@/lib/blog/store";
import { markdownToHtml } from "@/lib/blog/markdown";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  const locales = ["de", "en", "fr", "es", "it", "zh"];
  return locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const html = markdownToHtml(post.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Link href={`/${locale}/blog`} className="text-xs font-extrabold uppercase underline">
        ← {t(locale, "blog_title")}
      </Link>
      <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
        {post.category}
        {post.source?.includes("agent") ? " · Daily Agent" : ""}
      </p>
      <h1 className="display mt-2 text-4xl font-black md:text-6xl">{post.title}</h1>
      <p className="mt-4 text-lg text-ink/75">{post.excerpt}</p>
      <p className="mt-2 text-xs text-muted">
        {post.author}
        {post.published_at
          ? ` · ${new Date(post.published_at).toLocaleDateString("de-DE")}`
          : ""}
      </p>

      {post.cover_image_url && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden border-2 border-ink bg-fog">
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width:768px) 100vw, 768px"
            unoptimized
          />
        </div>
      )}

      <div
        className="prose-blog mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-12 border-2 border-ink bg-yellow p-6">
        <p className="font-extrabold uppercase">{t(locale, "blog_cta")}</p>
        <Link href={`/${locale}/shop`} className="btn-ghost mt-4 inline-flex px-5 py-3 text-sm">
          {t(locale, "cta_explore")}
        </Link>
      </div>
    </article>
  );
}
