import { catalog, searchCatalog } from "../catalog";
import { brand, pickLocalized, type Locale } from "../brand";
import { listOrders } from "../orders/store";
import { formatMoney } from "../utils";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ProductCardPayload = {
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  forSale: boolean;
};

export type AssistantReply = {
  text: string;
  products?: ProductCardPayload[];
  followUp?: string;
  source?: "openai" | "rules";
};

type OpenAiChatResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
};

function catalogSnapshot(locale: Locale) {
  return catalog.map((p) => {
    const variant = p.variants[0];
    return {
      slug: p.slug,
      name: pickLocalized(p.name, locale) || p.name.de || p.name.en,
      priceEuro: (variant?.price_cents ?? 0) / 100,
      priceLabel: formatMoney(variant?.price_cents ?? 0),
      vibes: p.vibes,
      personalizable: p.personalizable,
      colors: p.variants.map((v) => v.color.color_name),
      forSale: p.for_sale && p.status === "ACTIVE",
      status: p.status,
      drop: p.drop_label ?? null,
      blurb: pickLocalized(p.description, locale) || p.description.de,
    };
  });
}

function productsFromSlugs(slugs: unknown, locale: Locale): ProductCardPayload[] {
  if (!Array.isArray(slugs)) return [];
  const out: ProductCardPayload[] = [];
  for (const raw of slugs) {
    if (typeof raw !== "string") continue;
    const p = catalog.find((c) => c.slug === raw);
    if (!p) continue;
    out.push({
      slug: p.slug,
      name: pickLocalized(p.name, locale) || p.name.de || p.name.en,
      priceCents: p.variants[0]?.price_cents ?? 0,
      image: p.images[0],
      forSale: p.for_sale && p.status === "ACTIVE",
    });
  }
  return out.slice(0, 4);
}

function buildSystemPrompt(locale: Locale) {
  const catalogJson = JSON.stringify(catalogSnapshot(locale), null, 0);
  return `Du bist ${brand.assistantName}, der Shopping-Assistent für ${brand.name} (${brand.primaryDomain}).

SPRACHE: Antworte in der Sprache des Users. UI-Locale-Hinweis: ${locale}.

REGELN (strikt):
1. Nur Produkte aus dem KATALOG unten empfehlen. Keine erfundenen Produkte, Preise, Rabatte, Lagerbestände oder Lieferversprechen.
2. Wenn Demo/DRAFT (forSale=false): klar sagen, dass es Demo / noch nicht käuflich ist.
3. Keine Rechtsberatung. Bei Widerruf/AGB auf /legal/* verweisen.
4. Bestellstatus nur wenn authenticatedEmail vorliegt — sonst Verifikation verlangen, keine fremden Daten.
5. Kurz, hilfreich, markenpassend (freundlich, direkt). Max. ~120 Wörter Text.
6. Antworte NUR als JSON-Objekt:
{"text":"...","productSlugs":["slug-optional"],"followUp":"optionale Anschlussfrage"}

KATALOG:
${catalogJson}

Shop-Infos: Versand DE, Personalisierung möglich, 3D-Druck mit sichtbarer Fertigungscharakteristik, B2B separat auf teilnachbau.de.`;
}

function parseModelJson(content: string): {
  text: string;
  productSlugs?: string[];
  followUp?: string;
} | null {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1]?.trim() ?? trimmed;
  try {
    const parsed = JSON.parse(raw) as {
      text?: unknown;
      productSlugs?: unknown;
      followUp?: unknown;
    };
    if (typeof parsed.text !== "string" || !parsed.text.trim()) return null;
    return {
      text: parsed.text.trim(),
      productSlugs: Array.isArray(parsed.productSlugs)
        ? parsed.productSlugs.filter((s): s is string => typeof s === "string")
        : undefined,
      followUp: typeof parsed.followUp === "string" ? parsed.followUp : undefined,
    };
  } catch {
    if (trimmed.length > 0) return { text: trimmed };
    return null;
  }
}

async function runOpenAiAssistant(input: {
  message: string;
  locale: Locale;
  history?: ChatMessage[];
}): Promise<AssistantReply | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || apiKey === "[SENSITIVE]" || apiKey.length < 20) return null;

  const model = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4.1-mini";
  const history = (input.history ?? []).slice(-8);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(input.locale) },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: input.message },
      ],
    }),
  });

  const json = (await res.json()) as OpenAiChatResponse;
  if (!res.ok) {
    throw new Error(json.error?.message ?? `OpenAI ${res.status}`);
  }

  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) return null;

  const parsed = parseModelJson(content);
  if (!parsed) return null;

  const products = productsFromSlugs(parsed.productSlugs, input.locale);
  return {
    text: parsed.text,
    products: products.length ? products : undefined,
    followUp: parsed.followUp,
    source: "openai",
  };
}

/** Rule-based fallback when OpenAI is unavailable. */
export function runRulesAssistant(input: {
  message: string;
  locale: Locale;
  authenticatedEmail?: string | null;
}): AssistantReply {
  const msg = input.message.trim();
  const lower = msg.toLowerCase();
  const locale: "de" | "en" = input.locale === "de" ? "de" : "en";
  const replyLocale = input.locale;

  if (
    /bestellung|order|tracking|wo ist|where is|lieferung|shipping/i.test(lower)
  ) {
    if (!input.authenticatedEmail) {
      return {
        text:
          locale === "de"
            ? "Für Bestellstatus brauche ich deine Anmeldung oder eine Verifikation mit der Bestell-E-Mail. Ich gebe keine fremden Auftragsdaten preis."
            : "For order status I need you signed in or verified with the order email. I never share other people’s order data.",
        followUp:
          locale === "de"
            ? "Möchtest du stattdessen ein Produkt finden?"
            : "Want help finding a product instead?",
        source: "rules",
      };
    }
    const mine = listOrders().filter(
      (o) => o.email.toLowerCase() === input.authenticatedEmail!.toLowerCase(),
    );
    if (!mine.length) {
      return {
        text:
          locale === "de"
            ? "Ich finde keine Bestellung zu deinem Konto."
            : "I can’t find an order on your account.",
        source: "rules",
      };
    }
    const latest = mine[0];
    return {
      text:
        locale === "de"
          ? `Deine letzte Bestellung ${latest.id}: Zahlung ${latest.payment}, Produktion ${latest.production}, Versand ${latest.fulfillment}.`
          : `Your latest order ${latest.id}: payment ${latest.payment}, production ${latest.production}, fulfillment ${latest.fulfillment}.`,
      source: "rules",
    };
  }

  const budgetMatch = lower.match(/(\d+)\s*€|under\s*(\d+)|unter\s*(\d+)/);
  const budget = budgetMatch
    ? Number(budgetMatch[1] || budgetMatch[2] || budgetMatch[3]) * 100
    : null;
  const ageMatch = lower.match(/(\d+)\s*(jährig|year|yo|jahre)/);
  const likesGaming = /gaming|gamer|controller|setup|desk/i.test(lower);
  const likesPlay = /fidget|spiel|play|kind|kid|teen/i.test(lower);

  if (budget || likesGaming || likesPlay || /geschenk|gift|empfehl/i.test(lower)) {
    let picks = [...catalog];
    if (budget) {
      picks = picks.filter((p) => p.variants.some((v) => v.price_cents <= budget!));
    }
    if (likesGaming) {
      picks = picks.filter((p) => p.vibes.includes("GAMING") || p.vibes.includes("DESK"));
    } else if (likesPlay) {
      picks = picks.filter((p) => p.vibes.includes("PLAY") || p.vibes.includes("GIFTS"));
    }
    picks = picks.slice(0, 3);
    if (!picks.length) {
      return {
        text:
          locale === "de"
            ? "Dazu habe ich gerade nichts Passendes im Katalog. Budget oder Interesse etwas weiter fassen?"
            : "Nothing in the catalog matches that right now. Want to widen budget or interest?",
        source: "rules",
      };
    }
    return {
      text:
        locale === "de"
          ? `${brand.assistantName} hier — drei echte Treffer aus unserem Katalog${ageMatch ? ` (ca. ${ageMatch[1]})` : ""}${budget ? ` unter ${budget / 100} €` : ""}:`
          : `${brand.assistantName} here — three real picks from our catalog${ageMatch ? ` (around ${ageMatch[1]})` : ""}${budget ? ` under €${budget / 100}` : ""}:`,
      products: picks.map((p) => ({
        slug: p.slug,
        name: pickLocalized(p.name, replyLocale) || p.name[locale],
        priceCents: p.variants[0]?.price_cents ?? 0,
        image: p.images[0],
        forSale: p.for_sale && p.status === "ACTIVE",
      })),
      source: "rules",
    };
  }

  if (/farbe|color|colour|setup/i.test(lower)) {
    const colors = Array.from(
      new Set(catalog.flatMap((p) => p.variants.map((v) => v.color.color_name))),
    );
    return {
      text:
        locale === "de"
          ? `Aktuell im Sortiment: ${colors.join(", ")}. Für dunkle Setups: Ink oder Signal Violet. Für hell/spielerisch: Acid Lime oder Hot Coral.`
          : `In stock colors right now: ${colors.join(", ")}. Dark setups: Ink or Signal Violet. Bright/playful: Acid Lime or Hot Coral.`,
      followUp:
        locale === "de" ? "Welches Produkt suchst du?" : "Which product are you eyeing?",
      source: "rules",
    };
  }

  const hits = searchCatalog(msg).slice(0, 3);
  if (hits.length) {
    return {
      text:
        locale === "de"
          ? "Das habe ich im Katalog gefunden:"
          : "Here’s what I found in the catalog:",
      products: hits.map((p) => ({
        slug: p.slug,
        name: pickLocalized(p.name, replyLocale) || p.name[locale],
        priceCents: p.variants[0]?.price_cents ?? 0,
        image: p.images[0],
        forSale: p.for_sale && p.status === "ACTIVE",
      })),
      source: "rules",
    };
  }

  return {
    text:
      locale === "de"
        ? `Ich bin ${brand.assistantName}, dein Shopping-Guide. Frag nach Geschenken, Farben, Größen — oder „Geschenk für 12 unter 25 €“. Preise und Bestand kommen nur aus echten Produktdaten. Rabatte erfinde ich nicht.`
        : `I’m ${brand.assistantName}, your shopping guide. Ask about gifts, colors, sizes — or “gift for 12 under €25”. Prices and stock come only from real product data. I don’t invent discounts.`,
    followUp: locale === "de" ? "Alter + Budget + Interesse?" : "Age + budget + interest?",
    source: "rules",
  };
}

/**
 * Catalog-grounded shopping assistant.
 * Prefers ChatGPT (OpenAI), falls back to rules if key missing or API fails.
 */
export async function runShopAssistant(input: {
  message: string;
  locale: Locale;
  history?: ChatMessage[];
  authenticatedEmail?: string | null;
}): Promise<AssistantReply> {
  // Orders always stay rule-gated (no LLM leakage of order data)
  if (
    /bestellung|order|tracking|wo ist|where is|lieferung|shipping/i.test(
      input.message.toLowerCase(),
    )
  ) {
    return runRulesAssistant(input);
  }

  try {
    const ai = await runOpenAiAssistant(input);
    if (ai) return ai;
  } catch (error) {
    console.error(
      "[shop-assistant:openai-fallback]",
      error instanceof Error ? error.message : error,
    );
  }

  return runRulesAssistant(input);
}
