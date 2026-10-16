/**
 * Accès aux actualités pour les pages du site.
 * Le contenu vient du back-office (/admin → Actualités) ; voir server/content/news.ts.
 */
export {
  getFeaturedNews,
  getLatestNews,
  getNewsBySlug,
  getPublishedNews,
} from "@/server/content/news";
export type { NewsItem } from "@/server/content/news";
