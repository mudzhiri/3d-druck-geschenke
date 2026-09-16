import type { Locale } from "@/lib/brand";
import { company, companyAddressBlock } from "./company";
import type { LegalSlug } from "./registry";

export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalDocument = {
  /** Shown under title — lawyer review / placeholder notice */
  banner: string;
  /** If locale !== de: German law / DE text prevails */
  bindingNote?: string;
  sections: LegalSection[];
};

function addr() {
  return companyAddressBlock();
}

const DE: Record<LegalSlug, LegalDocument> = {
  impressum: {
    banner:
      "Angaben mit [PLACEHOLDER] müssen vor dem öffentlichen Verkauf mit finalen Unternehmensdaten ersetzt werden. Freigabe durch Rechtsberatung empfohlen.",
    sections: [
      {
        heading: "Angaben gemäß § 5 DDG (ehem. TMG)",
        paragraphs: [
          addr(),
          `E-Mail: ${company.email}`,
          `Telefon: ${company.phone}`,
        ],
      },
      {
        heading: "Vertretungsberechtigt",
        paragraphs: [`Geschäftsführung: ${company.managingDirector}`],
      },
      {
        heading: "Registereintrag",
        paragraphs: [
          `Registergericht: ${company.registerCourt}`,
          `Registernummer: ${company.registerNumber}`,
        ],
      },
      {
        heading: "Umsatzsteuer",
        paragraphs: [`Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: ${company.vatId}`],
      },
      {
        heading: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
        paragraphs: [company.responsibleContent, addr()],
      },
      {
        heading: "Kontakt für Bestellungen & Support",
        paragraphs: [
          `Bestellungen: ${company.email}`,
          `Allgemeine Anfragen: ${company.email}`,
        ],
      },
      {
        heading: "EU-Streitschlichtung",
        paragraphs: [
          "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/",
          "Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen — sofern keine gesetzliche Pflicht besteht. Details: Seite „Streitbeilegung / ODR“.",
        ],
      },
    ],
  },

  datenschutz: {
    banner:
      "Datenschutzerklärung als Entwurf. Vor Live-Verkauf: Verarbeitungsverzeichnis, AV-Verträge (Stripe, Hosting, E-Mail) und Rechtsprüfung abschließen.",
    sections: [
      {
        heading: "1. Verantwortlicher",
        paragraphs: [
          addr(),
          `E-Mail: ${company.email}`,
          "Verantwortlich im Sinne der DSGVO ist der oben genannte Anbieter.",
        ],
      },
      {
        heading: "2. Hosting & Bereitstellung der Website",
        paragraphs: [
          "Die Website wird bei Vercel Inc. (USA/EU-Edge) gehostet. Dabei können Server-Logfiles (IP-Adresse, Zeitpunkt, User-Agent, Referrer) technisch erforderlich verarbeitet werden (Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an sicherem Betrieb).",
          "DNS kann über Cloudflare laufen. Es gelten die jeweiligen Datenschutzinformationen der Anbieter.",
        ],
      },
      {
        heading: "3. Bestellungen & Vertragsabwicklung",
        paragraphs: [
          "Zur Erfüllung des Kaufvertrags verarbeiten wir Name, Adresse, E-Mail, Bestelldaten, Personalization-Texte (falls angegeben) und Zahlungsstatus (Art. 6 Abs. 1 lit. b DSGVO).",
          "Zahlungsabwicklung erfolgt über Stripe Payments Europe / Stripe, Inc. Stripe verarbeitet Zahlungsdaten als eigener Verantwortlicher bzw. Auftragsverarbeiter gemäß Stripe-Datenschutzhinweisen.",
          "Bestellbestätigungen und Transaktionsmails können über Resend oder vergleichbare E-Mail-Dienste versendet werden.",
        ],
      },
      {
        heading: "4. Kundenkonto (optional)",
        paragraphs: [
          "Ein Kundenkonto ist optional (Gastkauf möglich). Authentifizierung kann über Supabase Auth erfolgen (E-Mail Magic Link / OAuth). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bzw. Einwilligung.",
        ],
      },
      {
        heading: "5. Shop-Assistent (KI)",
        paragraphs: [
          "Der optionale Geschenk-Assistent verarbeitet Ihre Eingaben, um katalogbasierte Antworten zu geben. Es werden keine erfundenen Preise oder Lagerbestände ausgegeben. Chat-Inhalte werden nur zur Anfragebearbeitung genutzt und nicht für Marketingprofile verwendet, sofern nicht gesondert eingewilligt.",
          "Rechtsgrundlage: Art. 6 Abs. 1 lit. b bzw. f DSGVO (Anfragebearbeitung / Service).",
        ],
      },
      {
        heading: "6. Cookies & Einwilligung",
        paragraphs: [
          "Essenzielle Cookies/Local Storage (Warenkorb, Session, Consent-Status) sind technisch erforderlich (Art. 6 Abs. 1 lit. f bzw. b DSGVO).",
          "Analyse-/Marketing-Cookies werden nur nach Einwilligung gesetzt (Art. 6 Abs. 1 lit. a DSGVO). Details: Cookie-Richtlinie und Cookie-Einstellungen.",
        ],
      },
      {
        heading: "7. Speicherdauer",
        paragraphs: [
          "Vertrags- und Buchhaltungsdaten speichern wir gemäß gesetzlicher Aufbewahrungsfristen (i.d.R. 6–10 Jahre).",
          "Consent- und Support-Anfragen: bis zur Zweckerfüllung bzw. Widerruf, danach Löschung oder Sperrung.",
        ],
      },
      {
        heading: "8. Empfänger / Drittlandtransfer",
        paragraphs: [
          "Empfänger können Hosting-, Zahlungs-, E-Mail- und ggf. Logistikdienstleister sein.",
          "Bei Transfers in die USA (z. B. Vercel, Stripe, bestimmte E-Mail-Anbieter) stützen wir uns — soweit anwendbar — auf Angemessenheitsbeschluss / EU-US Data Privacy Framework und/oder Standardvertragsklauseln.",
        ],
      },
      {
        heading: "9. Ihre Rechte",
        paragraphs: [
          "Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie Beschwerde bei einer Aufsichtsbehörde.",
          `Kontakt Datenschutzanfragen: ${company.email}`,
        ],
      },
      {
        heading: "10. Pflichtangaben / Minderjährige",
        paragraphs: [
          "Unser Angebot richtet sich grundsätzlich an Volljährige bzw. mit Zustimmung der Erziehungsberechtigten. Produkthinweise zu Altersempfehlungen sind den jeweiligen Produktseiten zu entnehmen.",
        ],
      },
    ],
  },

  agb: {
    banner:
      "AGB-Entwurf für den B2C-Fernabsatz. Vor Verkauf: anwaltliche Freigabe, Preise inkl. MwSt. prüfen, Liefergebiete finalisieren.",
    sections: [
      {
        heading: "§ 1 Geltungsbereich",
        paragraphs: [
          `Diese AGB gelten für alle Bestellungen natürlicher Personen (Verbraucher) und Unternehmer über ${company.domain} gegenüber ${company.legalName} (nachfolgend „Verkäufer“).`,
          "Abweichende Bedingungen des Kunden gelten nicht, es sei denn, der Verkäufer stimmt ausdrücklich zu.",
        ],
      },
      {
        heading: "§ 2 Vertragsschluss",
        paragraphs: [
          "Die Darstellung der Produkte im Shop stellt kein verbindliches Angebot dar, sondern eine Aufforderung zur Bestellung.",
          "Mit Absenden der Bestellung gibt der Kunde ein verbindliches Angebot ab. Der Vertrag kommt durch Auftragsbestätigung per E-Mail oder durch Versand / Bereitstellung der Ware zustande.",
          "Der Bestellvorgang kann über Stripe Checkout abgewickelt werden.",
        ],
      },
      {
        heading: "§ 3 Preise & Zahlung",
        paragraphs: [
          "Alle Preise verstehen sich in Euro inklusive der gesetzlichen Umsatzsteuer, zuzüglich etwaiger Versandkosten, die vor Bestellabschluss ausgewiesen werden.",
          "Akzeptierte Zahlungsarten werden im Checkout angezeigt (z. B. Karte, Apple Pay, Google Pay, PayPal — sofern freigeschaltet).",
        ],
      },
      {
        heading: "§ 4 Lieferung",
        paragraphs: [
          "Lieferung erfolgt innerhalb der im Shop angegebenen Gebiete (Standard: Deutschland; EU nach Freischaltung).",
          "Angaben zu Lieferzeiten sind unverbindlich, sofern nicht ausdrücklich als verbindlich gekennzeichnet. Print-on-Demand-Artikel können längere Fertigungszeiten haben.",
          "Details: Seite „Versand & Lieferung“.",
        ],
      },
      {
        heading: "§ 5 Eigentumsvorbehalt",
        paragraphs: [
          "Die Ware bleibt bis zur vollständigen Zahlung Eigentum des Verkäufers.",
        ],
      },
      {
        heading: "§ 6 Personalisierung",
        paragraphs: [
          "Bei personalisierten Produkten (Name, Initialen, Text, Sonderfarbe) entfällt das Widerrufsrecht, soweit die Ware nach Kundenspezifikation angefertigt wird (§ 312g Abs. 2 Nr. 1 BGB).",
          "Der Kunde ist für die Richtigkeit der eingegebenen Personalisierungsdaten verantwortlich. Rechtswidrige / markenverletzende Texte dürfen abgelehnt werden.",
        ],
      },
      {
        heading: "§ 7 Fertigungscharakter / Beschaffenheit",
        paragraphs: [
          "3D-gedruckte Produkte können herstellungsbedingte Oberflächenstrukturen, Schichtlinien und geringe Toleranzen aufweisen. Dies ist Bestandteil der Produktbeschaffenheit und kein Mangel, soweit die vertraglich geschuldete Funktion erfüllt ist.",
        ],
      },
      {
        heading: "§ 8 Gewährleistung",
        paragraphs: [
          "Es gelten die gesetzlichen Mängelhaftungsrechte. Gegenüber Unternehmern gelten abweichende Regelungen nur, soweit zulässig vereinbart.",
        ],
      },
      {
        heading: "§ 9 Haftung",
        paragraphs: [
          "Der Verkäufer haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit.",
          "Bei leichter Fahrlässigkeit haftet der Verkäufer nur bei Verletzung wesentlicher Vertragspflichten, begrenzt auf den vorhersehbaren, typischerweise eintretenden Schaden.",
        ],
      },
      {
        heading: "§ 10 Widerruf",
        paragraphs: [
          "Verbrauchern steht ein gesetzliches Widerrufsrecht zu, soweit nicht gesetzliche Ausnahmen greifen (insbesondere Personalisierung). Details: Widerrufsbelehrung.",
        ],
      },
      {
        heading: "§ 11 Schlussbestimmungen",
        paragraphs: [
          "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Zwingende Verbraucherschutzvorschriften des Aufenthaltsstaates bleiben unberührt.",
          "Sollten einzelne Bestimmungen unwirksam sein, bleibt der Vertrag im Übrigen wirksam.",
        ],
      },
    ],
  },

  widerruf: {
    banner:
      "Musterbelehrung angelehnt an gesetzliche Vorgaben. Personalisierte Ware: Ausnahme prüfen. Rechtsberatung vor Go-Live.",
    sections: [
      {
        heading: "Widerrufsrecht",
        paragraphs: [
          "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.",
          "Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.",
          `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${company.legalName}, ${company.street}, ${company.zip} ${company.city}, E-Mail: ${company.email}) mittels einer eindeutigen Erklärung (z. B. per Post oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.`,
          "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
        ],
      },
      {
        heading: "Folgen des Widerrufs",
        paragraphs: [
          "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.",
          "Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
          "Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.",
          "Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.",
          "Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.",
          "Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.",
        ],
      },
      {
        heading: "Ausschluss bzw. Erlöschen des Widerrufsrechts",
        paragraphs: [
          "Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind (§ 312g Abs. 2 Nr. 1 BGB).",
          "Das gilt insbesondere für 3D-gedruckte Produkte mit personalisiertem Namen, Initialen, Text oder kundenspezifischer Konfiguration nach Bestellung.",
        ],
      },
      {
        heading: "Muster-Widerrufsformular",
        paragraphs: [
          "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)",
          `An ${company.legalName}, ${company.street}, ${company.zip} ${company.city}, E-Mail: ${company.email}`,
          "Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)",
          "— Bestellt am (*)/erhalten am (*)",
          "— Name des/der Verbraucher(s)",
          "— Anschrift des/der Verbraucher(s)",
          "— Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)",
          "— Datum",
          "(*) Unzutreffendes streichen.",
        ],
      },
    ],
  },

  versand: {
    banner: "Versandinformationen — Lieferzeiten und Kosten vor Go-Live finalisieren.",
    sections: [
      {
        heading: "Liefergebiet",
        paragraphs: [
          "Standardmäßig liefern wir nach Deutschland. Lieferungen in weitere EU-Länder werden schrittweise freigeschaltet und im Checkout angezeigt.",
        ],
      },
      {
        heading: "Versandkosten",
        paragraphs: [
          "Die konkreten Versandkosten werden vor Abschluss der Bestellung im Checkout ausgewiesen.",
          "Ab einem im Shop angegebenen Warenwert kann Versandkostenfreiheit gelten (sofern aktiviert).",
        ],
      },
      {
        heading: "Lieferzeiten",
        paragraphs: [
          "Lagerartikel: typischerweise 1–3 Werktage nach Zahlungseingang bis Übergabe an den Versanddienstleister (Deutschland).",
          "Print-on-Demand / personalisierte Artikel: zusätzliche Fertigungszeit gemäß Produktseite (häufig mehrere Werktage).",
          "Feiertage und hohe Auslastung können die Lieferzeit verlängern.",
        ],
      },
      {
        heading: "Versanddienstleister & Tracking",
        paragraphs: [
          "Versand erfolgt über gängige Dienstleister (z. B. DHL). Eine Tracking-Nummer wird — sofern verfügbar — per E-Mail übermittelt.",
        ],
      },
      {
        heading: "Gefahrenübergang",
        paragraphs: [
          "Gegenüber Verbrauchern geht die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der verkauften Sache erst mit Übergabe der Sache an den Verbraucher über.",
        ],
      },
    ],
  },

  zahlung: {
    banner: "Zahlungsarten hängen von der Stripe-/Anbieter-Konfiguration ab.",
    sections: [
      {
        heading: "Akzeptierte Zahlungsarten",
        paragraphs: [
          "Je nach Verfügbarkeit im Checkout: Kredit-/Debitkarte, Apple Pay, Google Pay, PayPal und weitere von Stripe freigeschaltete Methoden.",
          "Die endgültig verfügbaren Methoden sehen Sie im Checkout.",
        ],
      },
      {
        heading: "Zahlungszeitpunkt",
        paragraphs: [
          "Die Belastung erfolgt in der Regel mit Abschluss des Checkouts bzw. gemäß den Bedingungen des Zahlungsdienstleisters.",
        ],
      },
      {
        heading: "Währung & Steuern",
        paragraphs: [
          "Abrechnung in EUR. Ausgewiesene Preise enthalten die gesetzliche MwSt., soweit anwendbar. Steuerliche Behandlung bei Lieferungen außerhalb DE/EU richtet sich nach den gesetzlichen Vorgaben.",
        ],
      },
      {
        heading: "Rechnungen",
        paragraphs: [
          `Rechnungen / Belege werden per E-Mail an die im Checkout angegebene Adresse versendet. Support: ${company.email}`,
        ],
      },
    ],
  },

  retouren: {
    banner:
      "Retourenprozess. Personalisierte Ware oft vom Widerruf ausgenommen — klar im Checkout/Produkt kommunizieren.",
    sections: [
      {
        heading: "Widerruf vs. Gewährleistung",
        paragraphs: [
          "Das gesetzliche Widerrufsrecht (14 Tage) und die gesetzliche Mängelhaftung sind zu unterscheiden. Details zum Widerruf: Widerrufsbelehrung.",
          "Bei Mängeln gelten die gesetzlichen Rechte — kontaktieren Sie uns bitte mit Bestellnummer und Beschreibung/Fotos.",
        ],
      },
      {
        heading: "Personalisierte Produkte",
        paragraphs: [
          "Individuell angefertigte / personalisierte Produkte sind vom Widerrufsrecht ausgenommen, soweit die gesetzlichen Voraussetzungen vorliegen.",
          "Offensichtliche Fertigungsfehler oder Transportschäden melden Sie bitte unverzüglich nach Erhalt.",
        ],
      },
      {
        heading: "Rücksendung",
        paragraphs: [
          `Retourenankündigung an ${company.email} mit Bestellnummer.`,
          "Rücksendeadresse wird nach Prüfung mitgeteilt. Unfreie Sendungen ohne Absprache können zurückgewiesen werden.",
          "Sofern Sie widerrufen und kein Mangel vorliegt, tragen Sie in der Regel die unmittelbaren Kosten der Rücksendung.",
        ],
      },
      {
        heading: "Erstattung",
        paragraphs: [
          "Erstattungen erfolgen auf das ursprüngliche Zahlungsmittel, sobald die Ware bei uns eingegangen bzw. der Nachweis der Rücksendung erbracht ist (Widerruf).",
        ],
      },
    ],
  },

  cookies: {
    banner: "Cookie-Richtlinie. Essenziell vs. optional — Einwilligung über Cookie-Banner.",
    sections: [
      {
        heading: "Was sind Cookies?",
        paragraphs: [
          "Cookies und ähnliche Technologien (Local Storage) speichern Informationen im Browser. Wir unterscheiden essenzielle und optionale Cookies.",
        ],
      },
      {
        heading: "Essenziell (ohne Einwilligung)",
        paragraphs: [
          "Warenkorb / Session (Local Storage)",
          "Speicherung Ihrer Cookie-Einwilligung (`pl_consent`)",
          "Sicherheits- und Lastverteilungs-Cookies des Hostings (falls gesetzt)",
        ],
      },
      {
        heading: "Optional (nur mit Einwilligung)",
        paragraphs: [
          "Analyse (z. B. anonymisierte Nutzungsstatistiken) — Cookie/Flag `pl_consent=analytics`",
          "Marketing-Pixels nur nach expliziter Freigabe (derzeit nicht aktiv, bis konfiguriert)",
        ],
      },
      {
        heading: "Einstellungen ändern",
        paragraphs: [
          "Über „Cookie-Einstellungen“ im Footer oder Banner können Sie Ihre Einwilligung ändern oder widerrufen. Der Widerruf berührt nicht die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung.",
        ],
      },
      {
        heading: "Rechtsgrundlagen",
        paragraphs: [
          "Essenziell: Art. 6 Abs. 1 lit. f bzw. b DSGVO. Optional: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 TDDDG.",
        ],
      },
    ],
  },

  produktsicherheit: {
    banner:
      "GPSR / Produktsicherheitsangaben. Herstellerdaten und Konformität vor Verkauf von Spielzeug/verbrauchernahen Produkten freigeben.",
    sections: [
      {
        heading: "Wirtschaftsakteur / Hersteller",
        paragraphs: [
          `Hersteller: ${company.manufacturerName}`,
          `Adresse: ${company.manufacturerAddress}`,
          `E-Mail: ${company.manufacturerEmail}`,
        ],
      },
      {
        heading: "Produktinformationen",
        paragraphs: [
          "Zu jedem Produkt finden Sie auf der Produktseite Angaben zu Material, Maßen, Pflege, enthaltenem Lieferumfang sowie — soweit relevant — Altersempfehlung und Warnhinweise.",
          "Chargen-/Versionskennzeichnung und weitere GPSR-Pflichtangaben werden bei Aktivierung des Verkaufs ergänzt.",
        ],
      },
      {
        heading: "Produktklassen",
        paragraphs: [
          "Produkte können als Dekoration, Accessoire, Collectible oder — falls freigegeben — als Spielzeug klassifiziert sein.",
          "Spielzeug darf erst verkauft werden, wenn Compliance-Status „CLEARED“ und erforderliche Dokumentation vorliegen (interner Freigabeprozess).",
        ],
      },
      {
        heading: "Sicherheitshinweise (allgemein)",
        paragraphs: [
          "Nicht geeignet für Kinder unter 3 Jahren, sofern Kleinteile vorhanden sind (Erstickungsgefahr) — siehe jeweilige Produktseite.",
          "Vor Hitze, offenem Feuer und aggressiven Chemikalien schützen. Nicht für Lebensmittelkontakt, sofern nicht ausdrücklich ausgewiesen.",
          "3D-Druck-Oberflächen können raue Kanten aufweisen — bei Bedarf entgraten bzw. wie angegeben handhaben.",
        ],
      },
      {
        heading: "Meldung von Vorfällen",
        paragraphs: [
          `Sicherheitsrelevante Vorfälle bitte an ${company.manufacturerEmail} melden. Wir prüfen und leiten erforderliche Maßnahmen ein.`,
        ],
      },
    ],
  },

  barrierefreiheit: {
    banner:
      "Erklärung zur Barrierefreiheit (BFSG / EU 2019/882). Kontinuierliche Verbesserung — Feedback willkommen.",
    sections: [
      {
        heading: "Geltungsbereich",
        paragraphs: [
          `Diese Erklärung gilt für den Online-Shop ${company.domain}.`,
        ],
      },
      {
        heading: "Stand der Vereinbarkeit",
        paragraphs: [
          "Wir streben die Vereinbarkeit mit den WCAG 2.2 Level AA sowie den Anforderungen des Barrierefreiheitsstärkungsgesetzes an.",
          "Der Shop befindet sich in aktiver Weiterentwicklung. Bekannte Einschränkungen können u. a. betreffen: komplexe Produktkonfiguratoren, eingebettete Drittanbieter-Checkout-Schritte, wechselnde Demo-Inhalte.",
        ],
      },
      {
        heading: "Maßnahmen",
        paragraphs: [
          "Semantische Überschriften, Tastaturfokus-Styles, Kontrast (Schwarz/Gelb/Weiß), Alternativtexte für Produktbilder (soweit gepflegt), mehrsprachige Inhalte.",
        ],
      },
      {
        heading: "Feedback & Kontakt",
        paragraphs: [
          `Barriere-Meldungen an: ${company.email}`,
          "Bitte beschreiben Sie die Seite und das Problem. Wir antworten in der Regel innerhalb weniger Werktage.",
        ],
      },
      {
        heading: "Durchsetzungsverfahren",
        paragraphs: [
          "Sollten Sie auf eine Antwort unzufrieden sein, können Sie sich an die zuständige Marktüberwachungs- bzw. Durchsetzungsstelle nach BFSG wenden (je nach Bundesland / aktueller Zuständigkeit).",
        ],
      },
    ],
  },

  streitbeilegung: {
    banner: "Informationen zur Streitbeilegung und EU-ODR-Plattform.",
    sections: [
      {
        heading: "Online-Streitbeilegung (ODR)",
        paragraphs: [
          "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr/",
          `Unsere E-Mail-Adresse: ${company.email}`,
        ],
      },
      {
        heading: "Verbraucherschlichtung",
        paragraphs: [
          "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen, sofern keine zwingende gesetzliche Pflicht besteht.",
          "Gleichwohl bemühen wir uns um eine einvernehmliche Lösung. Kontaktieren Sie uns bitte zuerst unter der genannten E-Mail-Adresse.",
        ],
      },
    ],
  },
};

/** English companion texts — German version remains authoritative for DE consumers. */
const EN: Record<LegalSlug, LegalDocument> = {
  impressum: {
    banner:
      "Fields marked [PLACEHOLDER] must be completed before public sale. Legal review recommended.",
    bindingNote:
      "For customers in Germany/EU, the German Impressum and German contract texts prevail where required by law.",
    sections: [
      {
        heading: "Provider information (§ 5 DDG)",
        paragraphs: [addr(), `Email: ${company.email}`, `Phone: ${company.phone}`],
      },
      {
        heading: "Authorized representative",
        paragraphs: [`Managing director: ${company.managingDirector}`],
      },
      {
        heading: "Commercial register",
        paragraphs: [
          `Court: ${company.registerCourt}`,
          `Number: ${company.registerNumber}`,
        ],
      },
      {
        heading: "VAT",
        paragraphs: [`VAT ID: ${company.vatId}`],
      },
      {
        heading: "Responsible for content (§ 18 (2) MStV)",
        paragraphs: [company.responsibleContent, addr()],
      },
      {
        heading: "EU dispute resolution",
        paragraphs: [
          "ODR platform: https://ec.europa.eu/consumers/odr/",
          "See also our Dispute resolution page.",
        ],
      },
    ],
  },
  datenschutz: {
    banner: "Draft privacy policy. Complete processor agreements before go-live.",
    bindingNote: "German Datenschutzerklärung is authoritative for DE processing.",
    sections: [
      {
        heading: "1. Controller",
        paragraphs: [addr(), `Email: ${company.email}`],
      },
      {
        heading: "2. Hosting",
        paragraphs: [
          "Hosted on Vercel; DNS may use Cloudflare. Server logs may be processed for security (Art. 6(1)(f) GDPR).",
        ],
      },
      {
        heading: "3. Orders",
        paragraphs: [
          "We process order, shipping and personalization data to fulfil the contract (Art. 6(1)(b) GDPR). Payments via Stripe. Transactional email via Resend or similar.",
        ],
      },
      {
        heading: "4. Account (optional)",
        paragraphs: ["Guest checkout available. Auth may use Supabase."],
      },
      {
        heading: "5. Shop assistant",
        paragraphs: [
          "Optional AI assistant uses your message to recommend catalog products. No invented prices/stock.",
        ],
      },
      {
        heading: "6. Cookies",
        paragraphs: [
          "Essential: cart, consent. Analytics only with consent. See Cookie policy.",
        ],
      },
      {
        heading: "7. Retention & rights",
        paragraphs: [
          "Statutory retention for invoices. Rights under Art. 15–21 GDPR.",
          `Contact: ${company.email}`,
        ],
      },
    ],
  },
  agb: {
    banner: "Draft T&Cs for B2C distance selling. Lawyer review before sale.",
    bindingNote: "German AGB prevail for contracts with consumers where German law applies.",
    sections: [
      {
        heading: "§ 1 Scope",
        paragraphs: [
          `These terms apply to orders via ${company.domain} with ${company.legalName}.`,
        ],
      },
      {
        heading: "§ 2 Contract",
        paragraphs: [
          "Product pages are invitations to treat. Submitting an order is an offer; acceptance by email confirmation or shipment.",
        ],
      },
      {
        heading: "§ 3 Prices & payment",
        paragraphs: [
          "Prices in EUR incl. VAT plus shipping shown at checkout. Payment methods as listed in Stripe Checkout.",
        ],
      },
      {
        heading: "§ 4 Delivery",
        paragraphs: ["Default shipping to Germany; other EU countries when enabled. See Shipping page."],
      },
      {
        heading: "§ 5 Personalization",
        paragraphs: [
          "Custom-made/personalized goods may be excluded from withdrawal (§ 312g (2) no. 1 BGB).",
        ],
      },
      {
        heading: "§ 6 Manufacturing character",
        paragraphs: [
          "Layer lines and small tolerances are part of 3D-printed goods and not a defect if function is met.",
        ],
      },
      {
        heading: "§ 7 Warranty & liability",
        paragraphs: [
          "Statutory warranty applies. Unlimited liability for intent/gross negligence and injury; limited for slight negligence as permitted by law.",
        ],
      },
      {
        heading: "§ 8 Law",
        paragraphs: [
          "German law applies, excluding CISG, without depriving consumers of mandatory protections of their residence.",
        ],
      },
    ],
  },
  widerruf: {
    banner: "Withdrawal information (template). Personalized goods may be excluded.",
    bindingNote: "German Widerrufsbelehrung is the legally binding consumer notice.",
    sections: [
      {
        heading: "Right of withdrawal",
        paragraphs: [
          "You have the right to withdraw within 14 days without giving reasons, starting when you receive the goods.",
          `Contact: ${company.legalName}, ${company.street}, ${company.zip} ${company.city}, ${company.email}`,
        ],
      },
      {
        heading: "Effects",
        paragraphs: [
          "We refund all payments received, including standard delivery costs, within 14 days of receiving your withdrawal notice, using the same payment method, once goods are returned or proof of return is provided.",
          "You bear direct return shipping costs unless the item is defective.",
        ],
      },
      {
        heading: "Exclusion",
        paragraphs: [
          "No withdrawal for goods made to your specifications / clearly personalized (§ 312g (2) no. 1 BGB).",
        ],
      },
      {
        heading: "Model withdrawal form",
        paragraphs: [
          `To ${company.legalName}, ${company.email}`,
          "I/We hereby withdraw from the contract for the following goods… Order date / received on… Name… Address… Signature (if paper)… Date…",
        ],
      },
    ],
  },
  versand: {
    banner: "Shipping info — finalize costs and times before go-live.",
    sections: [
      {
        heading: "Territory",
        paragraphs: ["Germany by default; further EU countries when enabled in checkout."],
      },
      {
        heading: "Costs & times",
        paragraphs: [
          "Shipping costs shown at checkout.",
          "In-stock: typically 1–3 business days to carrier (DE). Personalized/POD: extra production time per product page.",
        ],
      },
      {
        heading: "Tracking",
        paragraphs: ["Carrier tracking emailed when available."],
      },
    ],
  },
  zahlung: {
    banner: "Payment methods depend on Stripe configuration.",
    sections: [
      {
        heading: "Methods",
        paragraphs: [
          "Cards, Apple Pay, Google Pay, PayPal and other Stripe methods as shown at checkout. Currency: EUR incl. VAT where applicable.",
        ],
      },
    ],
  },
  retouren: {
    banner: "Returns process. Personalized items often excluded from withdrawal.",
    sections: [
      {
        heading: "How to return",
        paragraphs: [
          `Email ${company.email} with order number. We provide the return address after review.`,
          "Withdrawal vs warranty are different — see withdrawal notice for the 14-day right.",
        ],
      },
    ],
  },
  cookies: {
    banner: "Cookie policy. Optional cookies only with consent.",
    sections: [
      {
        heading: "Essential",
        paragraphs: ["Cart/session storage, consent cookie `pl_consent`, security cookies."],
      },
      {
        heading: "Optional",
        paragraphs: ["Analytics only if you allow `analytics` in cookie settings."],
      },
      {
        heading: "Change settings",
        paragraphs: ["Use Cookie settings in the footer/banner anytime."],
      },
    ],
  },
  produktsicherheit: {
    banner: "GPSR product safety info — complete manufacturer data before sale.",
    sections: [
      {
        heading: "Manufacturer",
        paragraphs: [
          company.manufacturerName,
          company.manufacturerAddress,
          company.manufacturerEmail,
        ],
      },
      {
        heading: "Safety",
        paragraphs: [
          "See each product page for materials, age guidance and warnings.",
          "Toys only sell when compliance status is CLEARED.",
          `Report safety issues to ${company.manufacturerEmail}.`,
        ],
      },
    ],
  },
  barrierefreiheit: {
    banner: "Accessibility statement (BFSG / EU 2019/882).",
    sections: [
      {
        heading: "Status",
        paragraphs: [
          "We aim for WCAG 2.2 AA. The shop is under active improvement.",
          `Feedback: ${company.email}`,
        ],
      },
    ],
  },
  streitbeilegung: {
    banner: "Dispute resolution / ODR information.",
    sections: [
      {
        heading: "ODR",
        paragraphs: [
          "https://ec.europa.eu/consumers/odr/",
          `Email: ${company.email}`,
          "We are not obliged to participate in consumer arbitration unless required by law; we still aim for amicable solutions.",
        ],
      },
    ],
  },
};

export function getLegalDocument(slug: LegalSlug, locale: Locale): LegalDocument {
  if (locale === "de") return DE[slug];
  // Non-DE locales: English companion + binding note
  const doc = EN[slug];
  return {
    ...doc,
    bindingNote:
      doc.bindingNote ??
      "Where required, the German version of this page is legally authoritative.",
  };
}

export function getLegalLastUpdated() {
  return company.lastUpdated;
}
