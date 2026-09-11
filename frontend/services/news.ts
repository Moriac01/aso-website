import { news } from "@/data/news";
import type { News } from "@/data/news";

export const sortNewsByDate = (items: News[]) =>
  [...items].sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime(),
  );

export const getAllNews = (): News[] => sortNewsByDate(news);

export const getPublishedNews = (): News[] =>
  getAllNews().filter((item) => item.status === "published");

export const getFeaturedNews = (): News[] =>
  getPublishedNews().filter((item) => item.featured).slice(0, 3);

export const getNewsBySlug = (slug: string): News | undefined =>
  getPublishedNews().find((item) => item.slug === slug);

export const getLatestNews = (limit = 3): News[] => getPublishedNews().slice(0, limit);
