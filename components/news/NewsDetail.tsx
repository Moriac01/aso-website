import Image from "next/image";
import Link from "next/link";

import type { News } from "@/data/news";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export function NewsDetail({ item }: { item: News }) {
  return (
    <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-6">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0c7af8] transition hover:text-[#0a67d0]"
        >
          ← Retour aux actualités
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[#dfe7df] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
        <Image
          src={item.image}
          alt={item.title}
          width={1200}
          height={720}
          className="h-[320px] w-full object-cover sm:h-[420px]"
        />

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#526057]">
            <span className="inline-flex rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0c7af8]">
              {item.category}
            </span>
            <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-[#070707] sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>

          <div className="mt-8 space-y-5 text-base leading-8 text-[#2c3a34]">
            {item.content.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
