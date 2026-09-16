import type { Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";
import Link from "next/link";

const faqs: Array<{ q: Record<Locale, string>; a: Record<Locale, string> }> = [
  {
    q: {
      de: "Wie lange dauert die Lieferung?",
      en: "How long does shipping take?",
      fr: "Combien de temps pour la livraison ?",
      es: "¿Cuánto tarda el envío?",
      it: "Quanto tempo per la spedizione?",
      zh: "配送需要多久？",
    },
    a: {
      de: "Lagerware meist 1–3 Werktage bis Übergabe an den Versand. Personalisierte / Print-on-Demand-Artikel brauchen zusätzliche Fertigungszeit — siehe Produktseite und Versandinfo.",
      en: "In-stock items typically 1–3 business days to the carrier. Personalized / POD items need extra production time — see product page and shipping info.",
      fr: "Articles en stock : 1–3 jours ouvrés jusqu’au transporteur. Personnalisé / POD : délai de fabrication en plus.",
      es: "En stock: 1–3 días laborables hasta el transportista. Personalizados / POD: tiempo de fabricación extra.",
      it: "A magazzino: 1–3 giorni lavorativi al corriere. Personalizzati / POD: tempo di produzione extra.",
      zh: "现货通常 1–3 个工作日交承运商。个性化/按需打印需额外制作时间。",
    },
  },
  {
    q: {
      de: "Kann ich personalisierte Ware widerrufen?",
      en: "Can I withdraw personalized items?",
      fr: "Puis-je me rétracter sur un article personnalisé ?",
      es: "¿Puedo desistir de un producto personalizado?",
      it: "Posso recedere su un articolo personalizzato?",
      zh: "个性化商品可以撤回吗？",
    },
    a: {
      de: "Individuell angefertigte Ware ist vom Widerrufsrecht ausgenommen, wenn die gesetzlichen Voraussetzungen greifen. Details in der Widerrufsbelehrung.",
      en: "Custom-made goods can be excluded from withdrawal when the legal conditions apply. See the withdrawal notice.",
      fr: "Les biens confectionnés sur mesure peuvent être exclus du droit de rétractation. Voir la notice.",
      es: "Los bienes hechos a medida pueden quedar excluidos del desistimiento. Ver aviso.",
      it: "I beni su misura possono essere esclusi dal recesso. Vedi l’informativa.",
      zh: "按您规格定制的商品在符合法定条件时可能不适用撤回权。详见撤回说明。",
    },
  },
  {
    q: {
      de: "Sind Schichtlinien ein Mangel?",
      en: "Are layer lines a defect?",
      fr: "Les lignes de couches sont-elles un défaut ?",
      es: "¿Las líneas de capa son un defecto?",
      it: "Le linee di strato sono un difetto?",
      zh: "层纹算瑕疵吗？",
    },
    a: {
      de: "Nein — sichtbare Fertigungscharakteristik gehört zur Beschaffenheit von 3D-Druck, solange die Funktion stimmt. Siehe AGB.",
      en: "No — manufacturing character is part of 3D-printed goods if function is met. See T&Cs.",
      fr: "Non — le caractère de fabrication fait partie du produit 3D si la fonction est OK.",
      es: "No — el carácter de fabricación forma parte del producto 3D si la función está OK.",
      it: "No — il carattere di produzione fa parte del prodotto 3D se la funzione è OK.",
      zh: "不是——在功能正常的前提下，层纹属于 3D 打印产品特性。见条款。",
    },
  },
  {
    q: {
      de: "Welche Zahlungsarten gibt es?",
      en: "Which payment methods?",
      fr: "Quels moyens de paiement ?",
      es: "¿Qué métodos de pago?",
      it: "Quali metodi di pagamento?",
      zh: "支持哪些支付方式？",
    },
    a: {
      de: "Je nach Checkout: Karte, Apple Pay, Google Pay, PayPal u. a. via Stripe — siehe Zahlungsinformationen.",
      en: "Depending on checkout: card, Apple Pay, Google Pay, PayPal etc. via Stripe — see payment info.",
      fr: "Selon le checkout : carte, Apple Pay, Google Pay, PayPal via Stripe.",
      es: "Según el checkout: tarjeta, Apple Pay, Google Pay, PayPal vía Stripe.",
      it: "In base al checkout: carta, Apple Pay, Google Pay, PayPal via Stripe.",
      zh: "视结账配置：卡、Apple Pay、Google Pay、PayPal 等（Stripe）。",
    },
  },
  {
    q: {
      de: "Wo finde ich Herstellerangaben?",
      en: "Where is manufacturer info?",
      fr: "Où trouver les infos fabricant ?",
      es: "¿Dónde está la info del fabricante?",
      it: "Dove trovo i dati del produttore?",
      zh: "制造商信息在哪里？",
    },
    a: {
      de: "Auf der Seite Produktsicherheit (GPSR) und auf den jeweiligen Produktseiten.",
      en: "On the Product safety (GPSR) page and each product page.",
      fr: "Page Sécurité produits (GPSR) et pages produit.",
      es: "Página Seguridad (GPSR) y páginas de producto.",
      it: "Pagina Sicurezza (GPSR) e schede prodotto.",
      zh: "产品安全 (GPSR) 页面及各产品页。",
    },
  },
];

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="display text-5xl font-black md:text-6xl">{t(locale, "faq_title")}</h1>
      <div className="mt-10 space-y-6">
        {faqs.map((item) => (
          <section key={item.q.de} className="border-2 border-ink bg-fog p-5">
            <h2 className="font-extrabold uppercase">{item.q[locale]}</h2>
            <p className="mt-2 text-sm text-ink/75">{item.a[locale]}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm">
        <Link href={`/${locale}/contact`} className="font-extrabold uppercase underline">
          {t(locale, "nav_contact")}
        </Link>
      </p>
    </main>
  );
}
