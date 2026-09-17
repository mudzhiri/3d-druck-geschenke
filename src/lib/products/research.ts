import { TRENDING_HINTS, isIpSafe, type TrendHint } from "@/lib/products/trends";

export type ResearchHit = {
  title: string;
  source: "makerworld-trending" | "web" | "catalog-seed";
  url?: string;
};

/** Titles observed on MakerWorld Trending (gift-safe filter). Cloudflare blocks server scrapes. */
const MAKERWORLD_TRENDING_SNAPSHOT: ResearchHit[] = (
  [
  { title: "Ninja Pen Holder - Custom Desk Decoration", source: "makerworld-trending" as const, url: "https://makerworld.com/en" },
  { title: "CLIPPY - Filament clip", source: "makerworld-trending" as const },
  { title: "Twisty Mini Dragon Egg Fidget", source: "makerworld-trending" as const },
  { title: "Funny Banana Folding Fan", source: "makerworld-trending" as const },
  { title: "Ghost with Balloon", source: "makerworld-trending" as const },
  { title: "Joystick Keycap", source: "makerworld-trending" as const },
  { title: "Customizable Parametric Name+Letter Model", source: "makerworld-trending" as const },
  { title: "Seamless Photo Box Booth Studio", source: "makerworld-trending" as const },
  { title: "Sardines Jewellery Box Travel Case", source: "makerworld-trending" as const },
  { title: "Design Watch Stand II", source: "makerworld-trending" as const },
  { title: "Wall Mount Hat Holder", source: "makerworld-trending" as const },
  { title: "Cute Wobbly Penguin – NO AMS", source: "makerworld-trending" as const },
  { title: "Mini Microphone Holder", source: "makerworld-trending" as const },
  { title: "Flexi Fabric Fidget", source: "makerworld-trending" as const },
  { title: "Christmas Tree Minimalistic Japandi Decor", source: "makerworld-trending" as const },
  { title: "MoneyBox Vault – Print-in-Place Safe Box", source: "makerworld-trending" as const },
  { title: "Toothpaste Squeezer 2.0 (Print-in-Place)", source: "makerworld-trending" as const },
  { title: "Vernier Caliper Ruler", source: "makerworld-trending" as const },
  { title: "Desktop Trash Bin", source: "makerworld-trending" as const },
  { title: "Hearty Pot - Cute Heart-Hands Decor", source: "makerworld-trending" as const },
  { title: "Business Card Stand", source: "makerworld-trending" as const },
  { title: "Mini Gearbox Keychain Fidget", source: "makerworld-trending" as const },
  { title: "Gyroscopic Keychain Spinners", source: "makerworld-trending" as const },
  { title: "Customizable Name Desk Organizer", source: "makerworld-trending" as const },
] as ResearchHit[]
).filter((h) => isIpSafe(h.title));

async function webSearchLite(query: string): Promise<ResearchHit[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "user-agent": "3DG-ProductAgent/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const titles = [...html.matchAll(/class="result__a"[^>]*>([^<]{8,120})</gi)].map((m) =>
      m[1]!.replace(/&amp;/g, "&").trim(),
    );
    return titles
      .filter(isIpSafe)
      .slice(0, 12)
      .map((title) => ({ title, source: "web" as const }));
  } catch {
    return [];
  }
}

export async function researchTrendingProducts(): Promise<{
  hits: ResearchHit[];
  notes: string[];
}> {
  const notes: string[] = [];
  const web = await webSearchLite(
    "trending 3D printed gifts 2026 keychain fidget desk organizer MakerWorld",
  );
  notes.push(`web_hits=${web.length}`);
  notes.push(`makerworld_snapshot=${MAKERWORLD_TRENDING_SNAPSHOT.length}`);
  notes.push(
    "MakerWorld HTML is Cloudflare-protected for server fetch — using curated trending snapshot + web search. No STL/images downloaded.",
  );

  const hits = [
    ...MAKERWORLD_TRENDING_SNAPSHOT,
    ...web,
    ...TRENDING_HINTS.map((h) => ({
      title: h.labelEn,
      source: "catalog-seed" as const,
    })),
  ];

  return { hits, notes };
}

function scoreHint(hint: TrendHint, hits: ResearchHit[]) {
  const needle = `${hint.labelEn} ${hint.labelDe} ${hint.kind}`.toLowerCase();
  let score = 0;
  for (const hit of hits) {
    const t = hit.title.toLowerCase();
    for (const w of needle.split(/[^a-z0-9äöüß]+/i)) {
      if (w.length < 4) continue;
      if (t.includes(w)) score += hit.source === "makerworld-trending" ? 3 : 1;
    }
  }
  return score;
}

/** Pick up to `limit` gift-safe hints ranked by today's research. */
export function selectDailyHints(hits: ResearchHit[], limit = 20, date = new Date()) {
  const day = Math.floor(date.getTime() / 86_400_000);
  const ranked = TRENDING_HINTS.map((hint, index) => ({
    hint,
    index,
    score: scoreHint(hint, hits),
  })).sort((a, b) => b.score - a.score || a.index - b.index);

  // Rotate so consecutive days don't repeat the same top-20 order
  const rotated = [
    ...ranked.slice(day % ranked.length),
    ...ranked.slice(0, day % ranked.length),
  ];
  return rotated.slice(0, limit).map((r) => r.hint);
}
