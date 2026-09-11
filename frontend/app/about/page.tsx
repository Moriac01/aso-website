"use client";

import Link from "next/link";
import { useState } from "react";

import { PersonCard } from "@/components/PersonCard";
import { people } from "@/app/about/data";

const values = [
  {
    title: "Compassion",
    description: "Agir avec empathie et bienveillance envers chaque enfant et chaque famille.",
  },
  {
    title: "Intégrité",
    description: "Travailler avec honnêteté, transparence et respect des valeurs humanitaires.",
  },
  {
    title: "Responsabilité",
    description: "Gérer les ressources de manière efficace, juste et responsable.",
  },
  {
    title: "Dignité",
    description: "Respecter la valeur de chaque personne, sans distinction ni exclusion.",
  },
];

const sections = [
  {
    title: "Notre vision",
    content:
      "L’association Soutien aux Orphelins aspire à un avenir où chaque enfant orphelin peut grandir dans la sécurité, la confiance et l’espoir. Nous croyons que chacun mérite une chance d’apprendre, de guérir et de s’épanouir pleinement.",
  },
  {
    title: "Nos valeurs",
    content:
      "Nos actions sont guidées par la compassion, l’intégrité, la responsabilité et le respect de la dignité humaine. Ces principes orientent chaque intervention afin d’assurer un accompagnement juste, humain et durable.",
  },
  {
    title: "Nos engagements",
    content:
      "Nous nous engageons à améliorer la qualité de vie des enfants orphelins en leur offrant un accès équitable à l’éducation, aux soins de santé, au soutien psychologique, à une alimentation suffisante et à des conditions de vie plus sûres.",
  },
];

export default function APropos() {
  const [openSection, setOpenSection] = useState<number>(0);

  return (
    <main className="bg-[#f7faf6] text-[#070707]">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-gradient-to-br from-white via-[#f8fbff] to-[#eef7ff] p-6 shadow-lg sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0c7af8]">
                À propos
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#070707] sm:text-5xl">
                Une association au service des enfants vulnérables.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#526057] sm:text-lg">
                L&apos;Association Soutien aux Orphelins (ASO) est une organisation à but non lucratif,
                apolitique et laïque. Elle accompagne les enfants orphelins dans leurs besoins
                sociaux, éducatifs et sanitaires, sans distinction de région, de religion ni
                d&apos;ethnie.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#dfe7df] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0c7af8]">
                  <span className="text-2xl">❤</span>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-[#526057]">
                    Notre mission
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#070707]">Aider, protéger, grandir.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Accueillir les enfants dans des conditions plus sûres",
                  "Favoriser leur accès à l’éducation et aux soins",
                  "Les accompagner vers un avenir plus digne",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#f4f9f5] p-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#d9f5df] text-[#1d9b4a]">
                      ✓
                    </div>
                    <p className="text-sm leading-6 text-[#2c3a34]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-12">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { value: "100%", label: "Humanitaire" },
            { value: "24/7", label: "Accompagnement" },
            { value: "3", label: "Axes prioritaires" },
            { value: "+10", label: "Familles soutenues" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-[#dfe7df] bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#070707]">{stat.value}</p>
              <p className="mt-2 text-sm text-[#526057]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0c7af8]">
            Nos valeurs
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Des principes qui guident chaque action.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="rounded-3xl border border-[#dfe7df] bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf6ff] text-[#0c7af8]">
                <span className="text-lg font-bold">•</span>
              </div>
              <h3 className="text-xl font-semibold text-[#070707]">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526057]">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="overflow-hidden rounded-3xl border border-[#dfe7df] bg-white shadow-sm">
          {sections.map((section, index) => {
            const isOpen = index === openSection;

            return (
              <div key={section.title} className={index < sections.length - 1 ? "border-b border-[#edf2ef]" : ""}>
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                >
                  <span className="text-lg font-semibold text-[#070707] sm:text-xl">
                    {section.title}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf6ff] text-2xl font-light text-[#0c7af8]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 text-[#526057] sm:px-6 sm:pb-7">
                    <p className="text-base leading-8">{section.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            Notre équipe
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Notre bureau exécutif
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {people
            .filter((person) => person.type === "executive")
            .map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            La communauté ASO
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Nos membres et bénévoles
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {people
            .filter((person) => person.type !== "executive")
            .map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="rounded-[2rem] border border-[#dfe7df] bg-[#eef7ff] p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0c7af8]">
            Rejoignez notre engagement
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl">
            Votre temps, vos compétences et votre soutien peuvent faire une vraie différence.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#526057]">
            Que vous souhaitiez donner de votre temps, contribuer à nos actions ou soutenir nos
            missions, vous pouvez participer à renforcer l&apos;avenir des enfants et des familles
            accompagnées par l&apos;ASO.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteers"
              className="inline-flex items-center justify-center rounded-full bg-[#0c7af8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a67d0]"
            >
              Devenir bénévole
            </Link>
            <Link
              href="/actions"
              className="inline-flex items-center justify-center rounded-full border border-[#0c7af8] px-6 py-3 text-sm font-semibold text-[#088efc] transition hover:bg-[#0c7af8] hover:text-white"
            >
              Découvrir nos actions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
