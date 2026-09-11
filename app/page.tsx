'use client';

import Link from "next/link";
import Image from "next/image";

import Hero from "@/components/Hero";
import { NewsSection } from "@/components/news/NewsSection";
import Stats from "@/components/stats";
import { getFeaturedNews } from "@/services/news";

const missions = [
  {
    title: "Éducation",
    text: "Soutien scolaire, accès à l’école et un cadre d’apprentissage adapté.",
    image: "/edu.jpg",
  },
  {
    title: "Santé",
    text: "Accompagnement des familles et accès aux soins essentiels pour une vie plus saine.",
    image: "/sant.jpg",
  },
  {
    title: "Épanouissement",
    text: "Stabilité, confiance et opportunités pour une croissance sereine.",
    image: "/IMG-20250913-WA0015.jpg",
  },
];

export default function Home() {
  const featuredNews = getFeaturedNews();

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <div className="pt-4 sm:pt-4 lg:pt-5">
        <Hero />
      </div>

      <section className="mx-auto max-w-3xl px-5 pt-10 text-center sm:px-8 sm:pt-4 md:pt-6 lg:px-12 lg:pt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
          Notre histoire
        </p>
        <p className="mt-1 text-lg leading-7 text-[#526057] sm:mt-2 sm:text-xl sm:leading-8">
          Nous croyons que chaque enfant mérite une vie plus sûre, plus digne et pleine d’avenir.
        </p>
      </section>

      <div className="mt-4.5 md:mt-10">
        <Stats />
      </div>

      <section id="actions" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef7ff] p-5 shadow-lg sm:p-8 lg:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
              Nos actions
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
              Des actions concrètes pour protéger l’avenir des enfants.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {missions.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-[1.5rem] border border-[#e3ecf4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative overflow-hidden">
                  <Image
                    width={400}
                    height={240}
                    src={item.image}
                    alt={item.title}
                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#070707]">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#526057]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/actions"
              className="inline-flex items-center justify-center rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0a67d0]"
            >
              Découvrir
            </Link>
          </div>
        </div>
      </section>

      <section id="impact" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-12">
          <div className="rounded-[2rem] bg-[#0b1220] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.12)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#90cdf4]">
              Impact réel
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Chaque geste compte pour construire un avenir meilleur.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
              Grâce à la mobilisation de nos partenaires et bénévoles, nous offrons
              un cadre plus sûr, plus stable et plus digne à des milliers d’enfants.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="rounded-3xl border border-[#dfe7df] bg-[#f4f9f5] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0c7af8]">
                En pratique
              </p>
              <p className="mt-3 text-2xl font-bold text-[#070707]">
                Une aide durable, pensée autour des besoins de chacun.
              </p>
            </div>

            <div className="rounded-3xl border border-[#dfe7df] bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#526057]">
                Témoignage
              </p>
              <blockquote className="mt-3 text-lg leading-8 text-[#070707]">
                “Grâce à ce soutien, nos enfants peuvent enfin croire en leur avenir et
                reprendre confiance en eux.”
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-[#0c7af8]">
                — Équipe ASO / contenu éditable côté admin
              </p>
            </div>
          </div>
        </div>
      </section>

      <NewsSection items={featuredNews} />

      <section id="engagez-vous" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-[#eef7ff] p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            Agissez avec nous
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Donnez un avenir à ceux qui en ont besoin.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#526057]">
            Votre soutien permet de financer des projets concrets, d’accompagner des familles
            et d’ouvrir de nouvelles opportunités aux enfants.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donate"
              className="rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a67d0]"
            >
              Soutenez-nous
            </Link>
            <Link
              href="/volunteers"
              className="rounded-full border border-[#0c7af8] px-6 py-3 text-sm font-semibold text-[#088efc] transition hover:bg-[#0c7af8] hover:text-white"
            >
              Agissez avec nous
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
