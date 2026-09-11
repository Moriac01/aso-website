import Link from "next/link";

import { NewsList } from "@/components/news/NewsList";
import { getPublishedNews } from "@/services/news";

export default function NewsPage() {
  const items = getPublishedNews();

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 lg:px-12 lg:pb-12 lg:pt-16">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef7ff] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
              Actualités
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#070707] sm:text-5xl">
              Actualités
            </h1>
            <p className="mt-5 text-base leading-8 text-[#526057] sm:text-lg">
              Découvrez les dernières nouvelles, actions et événements de notre association.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#070707] sm:text-3xl">
            Dernières publications
          </h2>
          <Link
            href="/"
            className="text-sm font-semibold text-[#0c7af8] transition hover:text-[#0a67d0]"
          >
            Retour à l’accueil
          </Link>
        </div>

        <NewsList items={items} />
      </section>
    </main>
  );
}
