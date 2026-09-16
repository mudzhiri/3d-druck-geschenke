import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/brand";
import { listPublishedPosts } from "@/lib/blog/store";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: t(locale as Locale, "blog_title"),
    description: t(locale as Locale, "blog_intro"),
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const posts = await listPublishedPosts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted">Blog</p>
      <h1 className="display mt-2 text-5xl font-black md:text-7xl">{t(locale, "blog_title")}</h1>
      <p className="mt-4 max-w-2xl text-ink/75">{t(locale, "blog_intro")}</p>
      <p className="mt-2 text-xs font-extrabold uppercase text-muted">{t(locale, "blog_daily")}</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="group border-2 border-ink bg-paper transition hover:bg-fog"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink bg-fog">
              {post.cover_image_url ? (
                <Image
                  src={post.cover_image_url}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                  unoptimized
                />
              ) : null}
              <span className="absolute left-3 top-3 bg-yellow px-2 py-1 text-[10px] font-extrabold uppercase">
                {post.category}
              </span>
            </div>
            <div className="p-5">
              <h2 className="font-extrabold uppercase leading-snug tracking-wide">{post.title}</h2>
              <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>
              <p className="mt-3 text-xs font-extrabold uppercase text-muted">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString(locale === "de" ? "de-DE" : "en-GB")
                  : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
