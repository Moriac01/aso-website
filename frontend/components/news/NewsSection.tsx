import Link from "next/link";

import type { NewsItem } from "@/services/news";

import { NewsCard } from "@/components/news/NewsCard";

export function NewsSection({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
            Actualités
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Les dernières nouvelles de l’ASO
          </h2>
        </div>

        <Link
          href="/news"
          className="inline-flex items-center justify-center rounded-full border border-[#0a67d0] px-5 py-2.5 text-sm font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white"
        >
          Voir toutes les actualités
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
