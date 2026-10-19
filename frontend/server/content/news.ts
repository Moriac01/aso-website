import { unstable_cache } from "next/cache";

import { newsCategories } from "@/server/payload/collections/News";
import type { News as NewsDoc } from "@/server/payload/payload-types";

import {
  CACHE_SECONDS,
  CACHE_TAGS,
  getPayloadClient,
  mediaAlt,
  mediaUrl,
  withFallback,
} from "./client";

/** Actualité telle que l'affichent les composants du site. */
export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Contenu riche (éditeur du back-office). */
  content: NewsDoc["content"];
  image: string;
  imageAlt: string;
  category: string;
  publishedAt: string;
  featured: boolean;
};

const FALLBACK_IMAGE = "/icon.png";

const categoryLabel = (value: string) =>
  newsCategories.find((option) => option.value === value)?.label ?? value;

function toNewsItem(doc: NewsDoc): NewsItem {
  return {
    id: String(doc.id),
    slug: doc.slug ?? String(doc.id),
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    image: mediaUrl(doc.image, "card") ?? FALLBACK_IMAGE,
    imageAlt: mediaAlt(doc.image, doc.title),
    category: categoryLabel(doc.category),
    publishedAt: doc.publishedAt,
    featured: Boolean(doc.featured),
  };
}

/** Toutes les actualités publiées, de la plus récente à la plus ancienne. */
const loadPublishedNews = unstable_cache(
  async (): Promise<NewsItem[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "news",
      where: { _status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 100,
      depth: 1,
      overrideAccess: false,
    });
    return docs.map(toNewsItem);
  },
  ["cms-news-published"],
  { tags: [CACHE_TAGS.news], revalidate: CACHE_SECONDS },
);

export const getPublishedNews = () => withFallback("actualités", [], loadPublishedNews);

export const getFeaturedNews = async (limit = 3) =>
  (await getPublishedNews()).filter((item) => item.featured).slice(0, limit);

export const getLatestNews = async (limit = 3) => (await getPublishedNews()).slice(0, limit);

export const getNewsBySlug = async (slug: string) =>
  (await getPublishedNews()).find((item) => item.slug === slug);
