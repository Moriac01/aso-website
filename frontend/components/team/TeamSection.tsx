"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

import type { Person, PersonType } from "@/app/(site)/about/data";
import { PersonCard } from "@/components/PersonCard";
import { PersonProfile } from "@/components/team/PersonProfile";

const GROUPS: { type: PersonType; label: string }[] = [
  { type: "executive", label: "Bureau exécutif" },
  { type: "member", label: "Membres" },
  { type: "volunteer", label: "Bénévoles" },
];

/** Équipe de l'ASO : onglets par catégorie, grille de portraits, profil au clic. */
export function TeamSection({ people }: { people: Person[] }) {
  // Seules les catégories qui ont au moins une personne ont un onglet.
  const groups = GROUPS.map((group) => ({
    ...group,
    people: people.filter((person) => person.type === group.type),
  })).filter((group) => group.people.length > 0);

  const [activeType, setActiveType] = useState<PersonType | undefined>(groups[0]?.type);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const active = groups.find((group) => group.type === activeType) ?? groups[0];
  if (!active) return null;

  const current = active.people;
  const openPerson = openIndex === null ? null : (current[openIndex] ?? null);
  const step = (delta: number) =>
    setOpenIndex((index) => (index === null ? null : (index + delta + current.length) % current.length));

  // Navigation au clavier entre onglets (flèches, Début, Fin), comme le prévoit l'ARIA.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, position: number) => {
    const last = groups.length - 1;
    const target =
      event.key === "ArrowRight" ? (position === last ? 0 : position + 1)
      : event.key === "ArrowLeft" ? (position === 0 ? last : position - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    setActiveType(groups[target].type);
    tabsRef.current[target]?.focus();
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">Notre équipe</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#070707] sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
            Les femmes et les hommes qui font vivre l&apos;ASO
          </h2>
        </div>
        <p className="text-base leading-7 text-[#526057] sm:text-[17px] sm:leading-[1.75]">
          Les membres du bureau exécutif pilotent l&apos;association, rendent compte de son action et
          veillent au bon usage de chaque don.
        </p>
      </div>

      {groups.length > 1 ? (
        <div
          role="tablist"
          aria-label="Catégories de l'équipe"
          className="mt-8 flex gap-5 overflow-x-auto border-b border-[#dfe7df] sm:gap-7 lg:mt-12"
        >
          {groups.map((group, position) => {
            const selected = group.type === active.type;
            return (
              <button
                key={group.type}
                ref={(element) => {
                  tabsRef.current[position] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${group.type}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveType(group.type)}
                onKeyDown={(event) => onTabKeyDown(event, position)}
                className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-0.5 py-3 text-sm transition sm:py-3.5 sm:text-[15px] ${
                  selected
                    ? "border-[#0a67d0] font-semibold text-[#070707]"
                    : "border-transparent font-medium text-[#5b6760] hover:text-[#070707]"
                }`}
              >
                {group.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        id={`${baseId}-panel`}
        role={groups.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={groups.length > 1 ? `${baseId}-tab-${active.type}` : undefined}
        className="mt-8 grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-3 md:gap-x-9 md:gap-y-14 lg:mt-12"
      >
        {current.map((person, index) => (
          <PersonCard key={person.id} person={person} onOpen={() => setOpenIndex(index)} />
        ))}
      </div>

      <PersonProfile
        person={openPerson}
        onClose={() => setOpenIndex(null)}
        onPrevious={current.length > 1 ? () => step(-1) : undefined}
        onNext={current.length > 1 ? () => step(1) : undefined}
      />
    </section>
  );
}
