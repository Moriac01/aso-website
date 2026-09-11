import Image from "next/image";
import Link from "next/link";

import type { News } from "@/data/news";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export function NewsCard({ item }: { item: News }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#dfe7df] bg-white shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          width={800}
          height={520}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0c7af8]">
            {item.category}
          </span>
          <span className="text-xs text-[#526057]">{formatDate(item.publishedAt)}</span>
        </div>

        <h3 className="mt-5 text-2xl font-bold tracking-tight text-[#070707]">{item.title}</h3>
        <p className="mt-3 text-base leading-7 text-[#526057]">{item.excerpt}</p>

        <div className="mt-6">
          <Link
            href={`/news/${item.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#0c7af8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a67d0]"
          >
            Lire la suite
          </Link>
        </div>
      </div>
    </article>
  );
}
