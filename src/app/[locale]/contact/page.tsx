import type { Locale } from "@/lib/brand";
import { brand } from "@/lib/brand";
import { company } from "@/lib/legal/company";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black md:text-6xl">{t(locale, "nav_contact")}</h1>
      <p className="mt-4 max-w-xl text-ink/75">{t(locale, "contact_intro")}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <a href={`mailto:${brand.infoEmail}`} className="border-2 border-ink bg-yellow p-5 transition hover:shadow-[4px_4px_0_#0A0A0A]">
          <p className="text-xs font-extrabold uppercase text-muted">
            {t(locale, "contact_info_label")}
          </p>
          <p className="mt-2 break-all text-sm font-extrabold">{brand.infoEmail}</p>
        </a>
        <a href={`mailto:${brand.ordersEmail}`} className="border-2 border-ink bg-fog p-5 transition hover:bg-yellow">
          <p className="text-xs font-extrabold uppercase text-muted">{t(locale, "contact_orders")}</p>
          <p className="mt-2 break-all text-sm font-extrabold">{brand.ordersEmail}</p>
        </a>
        <a href={`mailto:${brand.supportEmail}`} className="border-2 border-ink bg-fog p-5 transition hover:bg-yellow">
          <p className="text-xs font-extrabold uppercase text-muted">Support</p>
          <p className="mt-2 break-all text-sm font-extrabold">{brand.supportEmail}</p>
        </a>
      </div>

      <div className="mt-10">
        <ContactForm locale={locale} />
      </div>

      <div className="mt-8 border-2 border-ink bg-paper p-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-muted">
          {t(locale, "contact_address")}
        </p>
        <p className="mt-2 whitespace-pre-line text-sm font-medium">
          {company.legalName}
          {"\n"}
          {company.street}
          {"\n"}
          {company.zip} {company.city}
          {"\n"}
          {company.country}
        </p>
        <p className="mt-4 text-sm text-ink/75">{t(locale, "contact_response_body")}</p>
      </div>

      <ul className="mt-10 space-y-2 text-sm">
        <li>
          <Link className="font-extrabold uppercase underline" href={`/${locale}/legal/widerruf`}>
            {t(locale, "legal_widerruf")}
          </Link>
        </li>
        <li>
          <Link className="font-extrabold uppercase underline" href={`/${locale}/legal/retouren`}>
            {t(locale, "legal_retouren")}
          </Link>
        </li>
        <li>
          <Link className="font-extrabold uppercase underline" href={`/${locale}/legal/impressum`}>
            Impressum
          </Link>
        </li>
      </ul>
    </main>
  );
}
