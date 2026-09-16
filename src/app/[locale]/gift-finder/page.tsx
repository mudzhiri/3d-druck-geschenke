"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { catalog } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";
import { pickLocalized, type Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

export default function GiftFinderPage() {
  const params = useParams<{ locale: string }>();
  const locale = (params.locale as Locale) || "de";
  const [age, setAge] = useState(13);
  const [budget, setBudget] = useState(30);
  const [interest, setInterest] = useState<"Gaming" | "Play" | "Desk" | "Gifts">("Gaming");

  const picks = useMemo(() => {
    return catalog
      .filter((p) => {
        const priceOk = p.variants.some((v) => v.price_cents <= budget * 100);
        if (!priceOk) return false;
        if (interest === "Gaming") return p.vibes.includes("GAMING") || p.vibes.includes("DESK");
        if (interest === "Play") return p.vibes.includes("PLAY");
        if (interest === "Desk") return p.vibes.includes("DESK");
        return p.vibes.includes("GIFTS") || p.personalizable;
      })
      .slice(0, 3);
  }, [age, budget, interest]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black">{t(locale, "gift_finder")}</h1>
      <p className="mt-3 text-muted">
        Age {age} · max €{budget} · {interest}
      </p>
      <div className="mt-8 space-y-6">
        <label className="block">
          <span className="text-sm font-extrabold uppercase text-muted">Age</span>
          <input
            type="range"
            min={6}
            max={40}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>
        <label className="block">
          <span className="text-sm font-extrabold uppercase text-muted">Budget €</span>
          <input
            type="range"
            min={10}
            max={80}
            step={5}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(["Gaming", "Play", "Desk", "Gifts"] as const).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInterest(i)}
              className={`px-4 py-2 text-sm font-extrabold uppercase ${
                interest === i
                  ? "bg-yellow text-ink border-2 border-ink"
                  : "border-2 border-ink bg-paper"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-10 space-y-3">
        {picks.map((p) => (
          <li key={p.id}>
            <Link
              href={`/${locale}/product/${p.slug}`}
              className="block border-2 border-ink bg-fog p-4 transition hover:bg-yellow"
            >
              <p className="font-extrabold uppercase">{pickLocalized(p.name, locale)}</p>
              <p className="text-sm text-muted">{formatMoney(p.variants[0].price_cents)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
