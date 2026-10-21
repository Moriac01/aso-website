import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Sprout } from "lucide-react";

import Hero from "@/components/Hero";
import { HomeBanner } from "@/components/HomeBanner";
import { homeBanner } from "@/lib/announcements";
import { getAnnouncements } from "@/server/content/actions";
import { NewsSection } from "@/components/news/NewsSection";
import Stats from "@/components/stats";
import { getHomeContent } from "@/server/content/home";
import { getKeyFigures } from "@/server/content/keyFigures";
import { getPublishedReports } from "@/server/content/transparency";
import { getFeaturedNews } from "@/services/news";

// Filet de sécurité : la page se régénère au plus tard toutes les 5 min
// (et immédiatement quand l'équipe publie depuis le back-office).
export const revalidate = 300;

// Nombre de colonnes des cartes « Nos actions » selon le nombre de piliers (1 à 4).
const pillarColumns = ["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-2 xl:grid-cols-4"];

const formatSize = (bytes: number | null) => {
  if (!bytes) return null;
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} Ko` : `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
};

export default async function Home() {
  const [home, featuredNews, keyFigures, reports, announcements] = await Promise.all([
    getHomeContent(),
    getFeaturedNews(),
    getKeyFigures(),
    getPublishedReports(),
    getAnnouncements(),
  ]);
  const banner = homeBanner(announcements);
  const latestReports = reports.filter((report) => report.fileUrl).slice(0, 2);

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      {banner?.action ? (
        <HomeBanner id={banner.item.id} text={banner.item.banner.text} href={banner.action.href} label={banner.action.label} />
      ) : null}
      <div className="pt-4 sm:pt-4 lg:pt-5">
        <Hero content={home.hero} />
      </div>

      <section className="mx-auto max-w-3xl px-5 pt-10 text-center sm:px-8 sm:pt-6 lg:px-12 lg:pt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
          Notre histoire
        </p>
        <p className="mt-2 text-lg leading-8 text-[#526057] sm:text-xl sm:leading-9">
          {home.story}
        </p>
      </section>

      <div className="mt-6 md:mt-10">
        <Stats items={keyFigures} />
      </div>

      <section id="actions" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef7ff] p-5 shadow-lg sm:p-8 lg:p-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
              Nos actions
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
              {home.pillarsTitle}
            </h2>
          </div>

          <div className={`grid gap-6 ${pillarColumns[Math.min(home.pillars.length, 4)]}`}>
            {home.pillars.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[1.5rem] border border-[#e3ecf4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-56 overflow-hidden sm:h-60">
                  {item.image ? (
                    <>
                      <Image
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        src={item.image.src}
                        alt={item.image.alt}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
                    </>
                  ) : (
                    // Pas encore de photo : illustration neutre.
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eef7ff] to-[#e3f5e8]">
                      <span className="flex size-20 items-center justify-center rounded-3xl bg-white text-[#1d9b4a] shadow-sm">
                        <Sprout className="size-10" aria-hidden="true" />
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {item.badge ? (
                    <span className="mb-3 inline-flex rounded-full bg-[#e3f5e8] px-3 py-1 text-xs font-semibold text-[#17683a]">
                      {item.badge}
                    </span>
                  ) : null}
                  <h3 className="text-xl font-semibold text-[#070707]">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#526057]">{item.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/actions"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0a67d0] px-6 text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#08529f]"
            >
              Découvrir nos actions
            </Link>
          </div>
        </div>
      </section>

      <section id="approche" className="bg-white py-16">
        <div
          className={`mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:px-12 ${home.approach.cards.length > 0 ? "lg:grid-cols-[1.2fr_0.8fr]" : ""}`}
        >
          <div className="rounded-[2rem] bg-[#0b1220] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.12)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#90cdf4]">
              Notre approche
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {home.approach.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
              {home.approach.text}
            </p>
          </div>

          {home.approach.cards.length > 0 ? (
            <div className="flex flex-col justify-center gap-6">
              {home.approach.cards.map((card, index) => (
                <div
                  key={card.label + index}
                  className={`rounded-3xl border border-[#dfe7df] p-6 ${index % 2 === 0 ? "bg-[#f4f9f5]" : "bg-white shadow-sm"}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a67d0]">{card.label}</p>
                  <p className="mt-3 text-xl font-bold leading-snug text-[#070707] sm:text-2xl">{card.text}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="transparence" className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:px-12">
        <div className="grid items-center gap-8 rounded-[2rem] border border-[#dfe7df] bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
              Transparence financière
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
              Nos comptes sont publics.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#526057]">
              Chaque dépense est enregistrée et justifiée. Nos rapports financiers, visés par notre
              Commissaire aux comptes, sont publiés pour que chaque donateur et partenaire sache où va
              son aide.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {latestReports.length > 0 ? (
              latestReports.map((report) => (
                <a
                  key={report.id}
                  href={report.fileUrl ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#dfe7df] bg-[#f7faf6] px-5 py-4 transition hover:border-[#0a67d0]"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-[#070707]">{report.title}</span>
                    <span className="text-sm text-[#526057]">
                      PDF{formatSize(report.fileSize) ? `, ${formatSize(report.fileSize)}` : ""}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-[#0a67d0]">
                    <Download className="size-4" aria-hidden="true" />
                    Télécharger
                  </span>
                </a>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-[#cfdccf] bg-[#f7faf6] px-5 py-4 text-[15px] leading-7 text-[#526057]">
                Nos premiers rapports financiers seront publiés ici dès qu’ils auront été visés par
                notre Commissaire aux comptes.
              </p>
            )}
            <Link
              href="/transparence"
              className="inline-flex items-center gap-2 self-start py-2 text-[15px] font-semibold text-[#0a67d0] hover:text-[#08529f]"
            >
              Voir la page Transparence
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <NewsSection items={featuredNews} />

      <section id="engagez-vous" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-[#eef7ff] p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">
            Agissez avec nous
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            {home.callToAction.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#526057]">
            {home.callToAction.text}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donate"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0a67d0] px-6 text-[15px] font-semibold text-white transition hover:bg-[#08529f]"
            >
              Faire un don
            </Link>
            <Link
              href="/volunteers"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#0a67d0] px-6 text-[15px] font-semibold text-[#0a67d0] transition hover:bg-[#0a67d0] hover:text-white"
            >
              Devenir bénévole
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
