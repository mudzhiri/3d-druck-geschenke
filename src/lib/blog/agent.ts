import { z } from "zod";
import { slugify } from "@/lib/utils";
import { brand } from "@/lib/brand";
import type { BlogTopic } from "@/lib/blog/topics";
import { selectDailyTopic } from "@/lib/blog/select-topic";
import {
  loadExistingBlogPosts,
  upsertPost,
  type BlogPost,
} from "@/lib/blog/store";
import { verifyPublishedBlogPage } from "@/lib/blog/verify-page";
import { getInfoInbox, sendEmail } from "@/lib/email/send";

const articleSchema = z.object({
  title: z.string().min(20).max(110),
  seoTitle: z.string().min(20).max(70),
  seoDescription: z.string().min(80).max(160),
  excerpt: z.string().min(40).max(220),
  keywords: z.array(z.string()).min(3).max(12),
  contentMarkdown: z.string().min(400),
});

export type GeneratedArticle = z.infer<typeof articleSchema> & {
  slug: string;
  category: string;
  coverImageUrl: string;
  source: "openai-agent" | "template-agent";
};

export type BlogAgentStep =
  | "1_inspect_published"
  | "2_research_seo_topic"
  | "3_write_images_metadata"
  | "4_verify_seo_photos";

function dayStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function berlinDayString(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function ensureShopCta(markdown: string) {
  let body = markdown.trim();
  if (!/\/de\/shop|\/shop/i.test(body)) {
    body += `\n\n**Nächster Schritt:** Entdecke den [Shop](/de/shop) oder den [Geschenkfinder](/de/gift-finder).\n`;
  }
  return body;
}

function buildTemplateArticle(topic: BlogTopic, date: Date): GeneratedArticle {
  const title = `${topic.primaryKeyword}: Praxisguide ${date.getFullYear()}`;
  const seoTitle = `${topic.primaryKeyword} | ${brand.shortName}`.slice(0, 70);
  const seoDescription =
    `${topic.angle} Tipps von ${brand.name} zu 3D-Geschenken, Material und Personalisierung.`.slice(
      0,
      160,
    );
  const contentMarkdown = ensureShopCta(`# ${title}

${topic.angle}

## Warum das relevant ist

Menschen suchen Geschenke, die **persönlich** wirken – ohne stundenlange Bastelerei. 3D-Druck liefert Unikate mit Name, Farbe und Form.

## Checkliste vor dem Kauf

1. Anlass und Empfänger (Alter, Interessen)
2. Budget
3. Personalisierung (Name / Initialen / Text)
4. Material & Einsatz (Indoor Desk vs. robuster Alltag)
5. Lieferzeit / Print-on-Demand einplanen

## Keyword-Cluster

${topic.secondaryKeywords.map((k) => `- ${k}`).join("\n")}

## Fazit

${topic.primaryKeyword} – mit klarem Use-Case und sauberer Personalisierung wird daraus ein Geschenk, das bleibt.

**Nächster Schritt:** [Shop](/de/shop) · [Geschenkfinder](/de/gift-finder)
`);

  return {
    title,
    seoTitle,
    seoDescription,
    excerpt: topic.angle,
    keywords: [topic.primaryKeyword, ...topic.secondaryKeywords],
    contentMarkdown,
    slug: slugify(`${topic.seed}-${dayStamp(date)}`),
    category: topic.category,
    coverImageUrl: topic.coverRemote,
    source: "template-agent",
  };
}

async function generateWithOpenAI(
  topic: BlogTopic,
  date: Date,
  existingTitles: string[],
  researchNote: string,
): Promise<GeneratedArticle> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENAI_API_KEY fehlt");

  const system = `Du bist SEO-Redakteur für ${brand.name} (${brand.primaryDomain}) – B2C Shop für 3D-Druck-Geschenke.
Schreibe auf Deutsch, klar, hilfreich, Feastables-Energie ohne Hype-Spam.
Markdown mit ## / ### / Listen. 800–1200 Wörter.
Nutze Primär-Keyword natürlich in Titel, Intro, einer H2 und Fazit.
Erwähne Fertigungscharakter (Schichtlinien) fair.
CTA zu /de/shop und /de/gift-finder. Keine erfundenen Preise/Rabatte.
Keine Rechtsberatung. Wiederhole keine bestehenden Titel.
Antworte NUR als JSON: title, seoTitle, seoDescription, excerpt, keywords (array), contentMarkdown.`;

  const user = `Datum: ${dayStamp(date)}
Primär-Keyword: ${topic.primaryKeyword}
Sekundär: ${topic.secondaryKeywords.join(", ")}
Kategorie: ${topic.category}
Winkel: ${topic.angle}

Bereits veröffentlicht (nicht kopieren):
${existingTitles.slice(0, 30).map((t) => `- ${t}`).join("\n") || "- (keine)"}

SEO-Recherche-Impulse:
${researchNote || "Keine Extra-Quellen."}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_BLOG_MODEL?.trim() || "gpt-4.1-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = json.choices?.[0]?.message?.content;
  if (!raw) throw new Error("OpenAI lieferte keinen Content");

  const parsed = articleSchema.parse(JSON.parse(raw));
  return {
    ...parsed,
    contentMarkdown: ensureShopCta(parsed.contentMarkdown),
    slug: slugify(`${topic.seed}-${dayStamp(date)}`),
    category: topic.category,
    coverImageUrl: topic.coverRemote,
    source: "openai-agent",
  };
}

async function researchSeoNotes(topic: BlogTopic) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return "";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_BLOG_MODEL?.trim() || "gpt-4.1-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "Du recherchierst SEO-Suchintentionen für DE. Kurz Stichpunkte: Intent, verwandte Queries, PAA-Fragen. Keine URLs erfinden.",
          },
          {
            role: "user",
            content: `Keyword: ${topic.primaryKeyword}. Kontext: 3D-Druck Geschenke Shop.`,
          },
        ],
      }),
    });
    if (!res.ok) return "";
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return json.choices?.[0]?.message?.content?.trim() ?? "";
  } catch {
    return "";
  }
}

/**
 * Daily noon pipeline (Europe/Berlin):
 * 1) inspect published
 * 2) research best SEO topic
 * 3) write article + cover + metadata, publish
 * 4) verify pages / photos / SEO
 */
export async function runDailyBlogAgent(options?: {
  date?: Date;
  force?: boolean;
}) {
  const date = options?.date ?? new Date();
  const steps: Array<{ step: BlogAgentStep; ok: boolean; detail?: string }> = [];

  // ——— Agent 1 ———
  const existing = await loadExistingBlogPosts();
  const existingTitles = existing.map((p) => p.title);
  steps.push({
    step: "1_inspect_published",
    ok: true,
    detail: `${existing.length} published posts loaded`,
  });

  // ——— Agent 2 ———
  const { topic, strategy, existingCount } = await selectDailyTopic(date);
  const researchNote = await researchSeoNotes(topic);
  steps.push({
    step: "2_research_seo_topic",
    ok: true,
    detail: `${strategy}: ${topic.primaryKeyword} (research ${researchNote.length} chars)`,
  });

  // ——— Agent 3 ———
  let article: GeneratedArticle;
  try {
    article = await generateWithOpenAI(topic, date, existingTitles, researchNote);
  } catch {
    article = buildTemplateArticle(topic, date);
  }

  if (!options?.force) {
    if (existing.some((p) => p.slug === article.slug)) {
      steps.push({
        step: "3_write_images_metadata",
        ok: false,
        detail: "already_exists",
      });
      return {
        status: "skipped" as const,
        reason: "already_exists",
        slug: article.slug,
        strategy,
        existingCount,
        steps,
      };
    }

    const berlinDay = berlinDayString(date);
    const publishedToday = existing.filter((p) => {
      if (!p.published_at) return false;
      if (berlinDayString(new Date(p.published_at)) !== berlinDay) return false;
      // Ignore old seed posts that happen to share the calendar day in other years — seeds use fixed 2026-09 dates
      return date.getTime() - new Date(p.published_at).getTime() < 36 * 3600 * 1000;
    });
    if (publishedToday.length > 0) {
      steps.push({
        step: "3_write_images_metadata",
        ok: false,
        detail: "already_published_today",
      });
      return {
        status: "skipped" as const,
        reason: "already_published_today",
        slug: publishedToday[0]!.slug,
        strategy,
        existingCount,
        steps,
      };
    }
  }

  const postPayload: Omit<BlogPost, "id"> = {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.contentMarkdown,
    category: article.category,
    published: true,
    published_at: date.toISOString(),
    cover_image_url: article.coverImageUrl,
    seo_title: article.seoTitle,
    seo_description: article.seoDescription,
    keywords: article.keywords,
    author: "3D-Geschenke Agent",
    source: article.source,
  };

  let published: { slug: string; title: string; cover_image_url?: string | null };
  try {
    published = await upsertPost(postPayload);
    steps.push({
      step: "3_write_images_metadata",
      ok: true,
      detail: `published /de/blog/${published.slug} (${article.source})`,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    steps.push({ step: "3_write_images_metadata", ok: false, detail: msg });
    // Notify inbox so content isn't lost
    await sendEmail({
      to: getInfoInbox(),
      subject: `[Blog-Agent] Publish fehlgeschlagen — ${article.title}`,
      html: `<p>${msg}</p><pre>${article.contentMarkdown.slice(0, 4000)}</pre>`,
    });
    throw error;
  }

  // Notify info@ about new post
  await sendEmail({
    to: getInfoInbox(),
    subject: `[Blog] Neu: ${article.title}`,
    html: `<p>Neuer Artikel: <a href="https://www.3d-druck-geschenke.de/de/blog/${published.slug}">${published.slug}</a></p>
           <p>${article.excerpt}</p>`,
  });

  // ——— Agent 4 ———
  await new Promise((r) => setTimeout(r, 2000));
  const verification = await verifyPublishedBlogPage({
    slug: published.slug,
    title: published.title,
    coverImageUrl: published.cover_image_url ?? article.coverImageUrl,
    locale: "de",
  });
  steps.push({
    step: "4_verify_seo_photos",
    ok: verification.ok,
    detail: verification.checks
      .map((c) => `${c.ok ? "✓" : "✗"} ${c.name}${c.detail ? ` (${c.detail})` : ""}`)
      .join("; "),
  });

  return {
    status: "published" as const,
    post: published,
    source: article.source,
    topic: topic.primaryKeyword,
    strategy,
    existingCount,
    steps,
    verification,
  };
}
