/**
 * Company / seller identity for legal pages.
 * Fill placeholders before public sale — Impressum is a launch blocker.
 */
export const company = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME ?? "3D-Druck-Geschenke",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "[FIRMENNAME / RECHTSFORM — PLACEHOLDER]",
  street: process.env.NEXT_PUBLIC_LEGAL_STREET ?? "[Straße Hausnummer — PLACEHOLDER]",
  zip: process.env.NEXT_PUBLIC_LEGAL_ZIP ?? "[PLZ]",
  city: process.env.NEXT_PUBLIC_LEGAL_CITY ?? "[Ort]",
  country: "Deutschland",
  countryCode: "DE",
  email: process.env.NEXT_PUBLIC_INFO_EMAIL ?? "info@3d-druck-geschenke.de",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@3d-druck-geschenke.de",
  ordersEmail:
    process.env.NEXT_PUBLIC_ORDERS_EMAIL ?? "bestellungen@3d-druck-geschenke.de",
  phone: process.env.NEXT_PUBLIC_LEGAL_PHONE ?? "[Telefon — PLACEHOLDER]",
  vatId: process.env.NEXT_PUBLIC_VAT_ID ?? "[USt-IdNr. — PLACEHOLDER]",
  registerCourt: process.env.NEXT_PUBLIC_REGISTER_COURT ?? "[Registergericht — PLACEHOLDER]",
  registerNumber: process.env.NEXT_PUBLIC_REGISTER_NUMBER ?? "[HRB/HRA — PLACEHOLDER]",
  managingDirector:
    process.env.NEXT_PUBLIC_MANAGING_DIRECTOR ?? "[Geschäftsführung — PLACEHOLDER]",
  responsibleContent:
    process.env.NEXT_PUBLIC_RESPONSIBLE_CONTENT ??
    "[Verantwortlich i.S.d. § 18 Abs. 2 MStV — PLACEHOLDER]",
  manufacturerName:
    process.env.NEXT_PUBLIC_MANUFACTURER_NAME ?? "[Herstellername — PLACEHOLDER]",
  manufacturerAddress:
    process.env.NEXT_PUBLIC_MANUFACTURER_ADDRESS ??
    "[Herstelleradresse — PLACEHOLDER], Deutschland",
  manufacturerEmail:
    process.env.NEXT_PUBLIC_MANUFACTURER_EMAIL ?? "compliance@3d-druck-geschenke.de",
  domain: "https://3d-druck-geschenke.de",
  lastUpdated: "2026-09-16",
} as const;

export function companyAddressBlock() {
  return `${company.legalName}\n${company.street}\n${company.zip} ${company.city}\n${company.country}`;
}
