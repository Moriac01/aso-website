"use client";

import { useState } from "react";

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

/** Accordéon Vision / Valeurs / Engagements (interactif, donc composant client). */
export function AboutAccordion() {
  const [openSection, setOpenSection] = useState<number>(0);

  return (
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
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf6ff] text-2xl font-light text-[#0a67d0]">
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
  );
}
