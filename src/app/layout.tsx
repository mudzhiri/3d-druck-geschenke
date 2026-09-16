import { Bebas_Neue, Manrope, Noto_Sans_SC } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/lib/brand";

const display = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const body = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

const cjk = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-cjk",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline.de}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.tagline.de,
  metadataBase: new URL(brand.domainPlaceholder),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${body.variable} ${cjk.variable}`}>
      <body className="min-h-dvh bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
