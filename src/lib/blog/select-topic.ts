import { BLOG_TOPICS, type BlogTopic } from "@/lib/blog/topics";
import {
  loadExistingBlogPosts,
  type ExistingPostBrief,
} from "@/lib/blog/store";
import { brand } from "@/lib/brand";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9äöüß\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function overlapScore(topic: BlogTopic, posts: ExistingPostBrief[]) {
  const needle = normalize(
    [topic.primaryKeyword, topic.seed, ...topic.secondaryKeywords].join(" "),
  );
  const words = needle.split(" ").filter((w) => w.length > 3);
  let score = 0;
  for (const post of posts) {
    const hay = normalize(
      [post.title, post.slug, ...(post.keywords ?? [])].join(" "),
    );
    if (hay.includes(normalize(topic.primaryKeyword))) score += 8;
    if (hay.includes(normalize(topic.seed.replace(/-/g, " ")))) score += 5;
    for (const w of words) {
      if (hay.includes(w)) score += 1;
    }
  }
  return score;
}

export function pickLeastUsedCatalogTopic(
  posts: ExistingPostBrief[],
  date = new Date(),
): BlogTopic {
  const ranked = BLOG_TOPICS.map((topic, index) => ({
    topic,
    index,
    overlap: overlapScore(topic, posts),
  })).sort((a, b) => a.overlap - b.overlap || a.index - b.index);

  const minOverlap = ranked[0]?.overlap ?? 0;
  const candidates = ranked.filter((r) => r.overlap <= minOverlap + 2);
  const day = Math.floor(date.getTime() / 86_400_000);
  return candidates[day % candidates.length]!.topic;
}

/** Agent 2: invent or pick the best unused SEO topic */
export async function inventFreshTopic(
  posts: ExistingPostBrief[],
  date = new Date(),
): Promise<BlogTopic> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const fallback = pickLeastUsedCatalogTopic(posts, date);
  if (!apiKey) return fallback;

  const existing = posts
    .slice(0, 40)
    .map((p) => `- ${p.title}`)
    .join("\n");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_BLOG_MODEL?.trim() || "gpt-4.1-mini",
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Du bist SEO-Strateg:in für ${brand.name} (B2C 3D-Druck-Geschenke, DE).
Schlage EIN neues Blog-Thema vor, das NICHT schon abgedeckt ist.
Fokus: Geschenke, Personalisierung, Desk/Gaming/Kids, Materialien, Anlässe.
JSON keys: seed, category, primaryKeyword, secondaryKeywords (array 3-5), angle, coverRemote (unsplash URL oder leer).`,
          },
          {
            role: "user",
            content: `Datum: ${date.toISOString().slice(0, 10)}
Bereits online:
${existing || "- (keine)"}

Katalog-Keywords (nicht 1:1 kopieren, Inspiration): ${BLOG_TOPICS.map((t) => t.primaryKeyword).join("; ")}`,
          },
        ],
      }),
    });
    if (!res.ok) return fallback;
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<BlogTopic>;
    if (!parsed.primaryKeyword || !parsed.seed || !parsed.angle) return fallback;
    return {
      seed: String(parsed.seed).slice(0, 80),
      category: String(parsed.category || "Geschenke"),
      primaryKeyword: String(parsed.primaryKeyword),
      secondaryKeywords: Array.isArray(parsed.secondaryKeywords)
        ? parsed.secondaryKeywords.map(String).slice(0, 6)
        : fallback.secondaryKeywords,
      angle: String(parsed.angle),
      coverRemote: sanitizeCoverRemote(parsed.coverRemote) || fallback.coverRemote,
    };
  } catch {
    return fallback;
  }
}

function sanitizeCoverRemote(url: unknown): string | null {
  if (typeof url !== "string" || !url.startsWith("http")) return null;
  // Prefer stable Unsplash CDN URLs; reject /photos/.../download links (often 401)
  if (/images\.unsplash\.com\//i.test(url)) return url;
  const photo = url.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/);
  if (photo) {
    return `https://images.unsplash.com/photo-${photo[1]}?auto=format&fit=crop&w=1600&q=80`;
  }
  return null;
}

export async function selectDailyTopic(date = new Date()) {
  const posts = await loadExistingBlogPosts();
  // Prefer inventing fresh SEO topic; fallback catalog
  try {
    const topic = await inventFreshTopic(posts, date);
    return { topic, strategy: "fresh-openai" as const, existingCount: posts.length, posts };
  } catch {
    const topic = pickLeastUsedCatalogTopic(posts, date);
    return {
      topic,
      strategy: "catalog-least-used" as const,
      existingCount: posts.length,
      posts,
    };
  }
}
