import type { MetadataRoute } from "next";

import { getAnnouncements } from "@/server/content/actions";
import { getPublishedNews } from "@/services/news";

const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "https://www.aso-rca.org").replace(/\/$/, "");

// Mis à jour au plus tard toutes les heures (nouvelles actualités et annonces).
export const revalidate = 3600;

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/actions", priority: 0.9, changeFrequency: "weekly" },
  { path: "/donate", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/news", priority: 0.8, changeFrequency: "weekly" },
  { path: "/transparence", priority: 0.8, changeFrequency: "monthly" },
  { path: "/volunteers", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" },
];

/** Plan du site pour Google : pages fixes, actualités publiées et annonces visibles. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, announcements] = await Promise.all([getPublishedNews(), getAnnouncements()]);
  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({ url: `${siteUrl}${path}`, priority, changeFrequency })),
    ...news.map((item) => ({ url: `${siteUrl}/news/${item.slug}`, lastModified: item.publishedAt, priority: 0.6 })),
    ...announcements.map((item) => ({ url: `${siteUrl}/annonces/${item.slug}`, priority: 0.7 })),
  ];
}
