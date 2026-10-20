import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "https://www.aso-rca.org").replace(/\/$/, "");

/** Moteurs de recherche : tout le site public, sauf le back-office et l'API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
