import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  published_at: string;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  keywords: string[];
  author: string;
  source: string | null;
};

const TABLE = "gift_blog_posts";

function anonClient(): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

function adminClient(): SupabaseClient | null {
  const { supabaseUrl } = getSupabasePublicEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Seed posts shown when DB empty / offline */
export const SEED_POSTS: BlogPost[] = [
  {
    slug: "personalisiertes-3d-geschenk-ideen",
    title: "Personalisiertes 3D-Geschenk: 7 Ideen, die wirklich ankommen",
    excerpt:
      "Von Desk-Toys bis Namensschild – so findest du ein Unikat, das nicht nach Massenware aussieht.",
    content: `# Personalisiertes 3D-Geschenk: 7 Ideen, die wirklich ankommen

Ein gutes Geschenk muss nicht teuer sein – es muss **passen**. 3D-Druck macht genau das möglich: Name, Farbe, Größe, Vibes.

## 1. Desk-Toy zum Drehen
Endlos drehbar, leise, suchtig – ideal für Gaming- und Office-Setups.

## 2. Namens- oder Initialen-Schild
Tür, Regal, Schreibtisch: klar lesbar, in der Wunschfarbe.

## 3. Headset- / Controller-Stand
Ordnung im Setup, sofort sichtbar, personalisierbar.

## 4. Keyclip / Bag Charm
Klein, alltagstauglich, mit Initialen.

## 5. Gaming-Kabel-Clips
Unspektakulär? Vielleicht. Praktisch jeden Tag? Absolut.

## 6. Mini-Skulptur / Statement-Objekt
Für Menschen, die „etwas Eigenes“ wollen – ohne Kitscht.

## 7. Kombi-Set
Zwei kleine Teile in einer Farbe: wirkt wie ein kuratiertes Drop.

## Worauf achten
- Altershinweise & Kleinteile
- Material (PLA für Indoor-Dekor, PETG robuster)
- Personalisierung vor dem Druck checken

**Nächster Schritt:** Stöbere im [Shop](/de/shop) oder nutze den [Geschenkfinder](/de/gift-finder).
`,
    category: "Geschenke",
    published: true,
    published_at: "2026-09-15T10:00:00.000Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1600&q=80",
    seo_title: "Personalisiertes 3D-Geschenk: 7 Ideen | 3D-Druck-Geschenke",
    seo_description:
      "7 Ideen für personalisierte 3D-Druck-Geschenke – Desk, Gaming, Name. Tipps zu Material und Personalisierung.",
    keywords: ["personalisiertes 3D Geschenk", "3D Druck Geschenk", "Unikat"],
    author: "3D-Geschenke Redaktion",
    source: "seed",
  },
  {
    slug: "pla-oder-petg-fuer-geschenke",
    title: "PLA oder PETG für Geschenke? Kurzer Material-Guide",
    excerpt:
      "Welches Filament für Desk-Toys, Schilder und Outdoor-taugliche Giveaways?",
    content: `# PLA oder PETG für Geschenke?

## PLA
Schön, detailreich, ideal für Indoor-Dekor und Desk-Objekte. Weniger hitzebeständig.

## PETG
Zäh, robuster, besser bei Alltagskram und leichter Belastung.

## Faustregel
- **Dekor / Optik** → PLA  
- **Funktion / Halten** → PETG  

Schichtlinien sind Teil der Fertigung – kein Mangel, wenn die Funktion stimmt.

Mehr im [Shop](/de/shop).
`,
    category: "Materialien",
    published: true,
    published_at: "2026-09-14T10:00:00.000Z",
    cover_image_url:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1600&q=80",
    seo_title: "PLA oder PETG Geschenk? Material-Guide | 3D-Druck-Geschenke",
    seo_description:
      "PLA vs PETG für 3D-Geschenke: Wann welches Material, Haltbarkeit und Finish.",
    keywords: ["PLA PETG", "3D Druck Material", "Geschenk"],
    author: "3D-Geschenke Redaktion",
    source: "seed",
  },
];

export async function listPublishedPosts(limit = 60): Promise<BlogPost[]> {
  const sb = anonClient();
  if (sb) {
    const { data, error } = await sb
      .from(TABLE)
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (!error && data && data.length > 0) {
      return data as BlogPost[];
    }
  }
  return SEED_POSTS.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const sb = anonClient();
  if (sb) {
    const { data } = await sb
      .from(TABLE)
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) return data as BlogPost;
  }
  return SEED_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function upsertPost(post: Omit<BlogPost, "id">) {
  const admin = adminClient();
  if (!admin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY fehlt — nötig zum Publishen neuer Blog-Artikel.",
    );
  }
  const { data, error } = await admin
    .from(TABLE)
    .upsert(
      {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        published: post.published,
        published_at: post.published_at,
        cover_image_url: post.cover_image_url,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        keywords: post.keywords,
        author: post.author,
        source: post.source,
      },
      { onConflict: "slug" },
    )
    .select("slug, title, category, cover_image_url, published_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export type ExistingPostBrief = {
  slug: string;
  title: string;
  keywords: string[] | null;
  category: string | null;
  published_at: string | null;
};

export async function loadExistingBlogPosts(limit = 120): Promise<ExistingPostBrief[]> {
  const posts = await listPublishedPosts(limit);
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    keywords: p.keywords,
    category: p.category,
    published_at: p.published_at,
  }));
}
