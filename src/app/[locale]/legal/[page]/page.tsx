import { notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/brand";
import { activeLocales } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { getLegalDocument, getLegalLastUpdated } from "@/lib/legal/content";
import {
  isLegalSlug,
  legalSlugs,
  legalTitles,
  type LegalSlug,
} from "@/lib/legal/registry";

export function generateStaticParams() {
  return activeLocales.flatMap((locale) =>
    legalSlugs.map((page) => ({ locale, page })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale: raw, page } = await params;
  if (!isLegalSlug(page)) return { title: "Legal" };
  const locale = raw as Locale;
  return { title: legalTitles[page][locale] };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale: raw, page: rawPage } = await params;
  if (!isLegalSlug(rawPage)) notFound();
  const locale = raw as Locale;
  const page = rawPage as LegalSlug;
  const doc = getLegalDocument(page, locale);
  const title = legalTitles[page][locale];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted">
        {t(locale, "legal_nav")}
      </p>
      <h1 className="display mt-2 text-4xl font-black md:text-5xl">{title}</h1>
      <p className="mt-2 text-xs text-muted">
        {t(locale, "legal_updated")}: {getLegalLastUpdated()}
      </p>

      <p className="mt-6 border-2 border-ink bg-yellow p-4 text-sm font-medium text-ink">
        {doc.banner}
      </p>
      {doc.bindingNote && (
        <p className="mt-3 border-2 border-ink bg-fog p-3 text-sm text-ink/80">{doc.bindingNote}</p>
      )}

      <nav className="mt-8 flex flex-wrap gap-2" aria-label={t(locale, "legal_nav")}>
        {legalSlugs.map((slug) => (
          <Link
            key={slug}
            href={`/${locale}/legal/${slug}`}
            className={`border-2 border-ink px-2.5 py-1 text-[11px] font-extrabold uppercase ${
              slug === page ? "bg-yellow" : "bg-paper hover:bg-fog"
            }`}
          >
            {legalTitles[slug][locale]}
          </Link>
        ))}
      </nav>

      <div className="mt-10 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-extrabold uppercase tracking-tight">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted">
        <Link href={`/${locale}/contact`} className="font-extrabold uppercase underline">
          {t(locale, "nav_contact")}
        </Link>
        {" · "}
        <Link href={`/${locale}/legal/impressum`} className="underline">
          Impressum
        </Link>
      </p>
    </main>
  );
}
