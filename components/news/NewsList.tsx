import type { News } from "@/data/news";

import { NewsCard } from "@/components/news/NewsCard";

export function NewsList({ items }: { items: News[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-[#dfe7df] bg-white p-8 text-center text-[#526057] shadow-sm">
        Aucune actualité disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
