import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  const base = (brand.domainPlaceholder || "https://www.3d-druck-geschenke.de")
    .replace(/\/$/, "")
    .replace("https://3d-druck-geschenke.de", "https://www.3d-druck-geschenke.de");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/*/login",
        "/*/register",
        "/*/account",
        "/auth",
        "/checkout",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: "www.3d-druck-geschenke.de",
  };
}
