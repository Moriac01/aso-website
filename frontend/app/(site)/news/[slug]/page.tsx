import Link from "next/link";

import { NewsDetail } from "@/components/news/NewsDetail";
import { getNewsBySlug, getPublishedNews } from "@/services/news";

export function generateStaticParams() {
  return getPublishedNews().map((item) => ({ slug: item.slug }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);

  if (!item) {
    return (
      <main className="bg-[#f7faf6] text-[#070707]">
        <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 lg:px-12 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            Actualité introuvable
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#070707] sm:text-5xl">
            Nous n’avons pas trouvé cette actualité.
          </h1>
          <p className="mt-5 text-base leading-8 text-[#526057]">
            La publication demandée n’existe pas ou n’est plus disponible.
          </p>
          <div className="mt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a67d0]"
            >
              Retour aux actualités
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <NewsDetail item={item} />
    </main>
  );
}
