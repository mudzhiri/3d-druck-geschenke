import { stores } from "@/lib/catalog";
import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";

export default async function StoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black md:text-7xl">{t(locale, "section_irl")}</h1>
      <p className="mt-4 max-w-xl text-ink/75">{t(locale, "section_irl_body")}</p>
      <ul className="mt-12 space-y-6">
        {stores.map((s) => (
          <li key={s.id} className="border-2 border-ink bg-fog p-6 md:p-8">
            <p className="display text-3xl font-black">{s.name}</p>
            <p className="mt-2 text-muted">
              {s.address}, {s.city}
            </p>
            <p className="mt-1 font-extrabold uppercase text-ink">{s.is_24_7 ? "24/7" : s.hours}</p>
            <p className="mt-4 text-sm text-muted">Categories: {s.categories.join(" · ")}</p>
            <p className="mt-2 text-xs text-muted">
              Live inventory hidden until retail sync is reliable.
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-10 overflow-hidden border-2 border-ink bg-yellow p-8">
        <p className="text-sm font-medium text-ink/80">
          Map placeholder — wire Mapbox/Google when API key approved.
        </p>
        <p className="mt-2 font-mono text-xs text-ink">
          {stores[0]?.lat}, {stores[0]?.lng}
        </p>
      </div>
    </main>
  );
}
