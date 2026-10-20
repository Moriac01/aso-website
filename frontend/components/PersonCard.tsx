import Image from "next/image";

import type { Person } from "@/app/(site)/about/data";

/** « Emmanuel MADOUKOU » → « EM » ; « Daria Gloria DANZI-MOFINI » → « DD ». */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = Array.from(words[0])[0] ?? "";
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** Portrait au format 4:5 — photo cadrée sur le visage, ou initiales sur la teinte du site. */
export function PersonPortrait({
  person,
  sizes,
  className = "",
  initialsClassName = "text-5xl md:text-7xl",
  zoomOnHover = false,
}: {
  person: Person;
  sizes: string;
  className?: string;
  initialsClassName?: string;
  zoomOnHover?: boolean;
}) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-[#e6ede7] ${className}`}>
      {person.photo ? (
        <Image
          src={person.photo}
          alt={`Portrait de ${person.name}`}
          fill
          sizes={sizes}
          className={`object-cover ${zoomOnHover ? "transition-transform duration-500 group-hover:scale-[1.03]" : ""}`}
          style={{ objectPosition: person.photoPosition }}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center font-semibold tracking-[0.03em] text-[#0a67d0] ${initialsClassName}`}
        >
          {initials(person.name)}
        </span>
      )}
    </div>
  );
}

/** Carte d'un membre dans la grille : portrait, nom, fonction. Un clic ouvre son profil. */
export function PersonCard({ person, onOpen }: { person: Person; onOpen: () => void }) {
  return (
    <article className="group relative">
      <PersonPortrait
        person={person}
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 380px"
        className="rounded-[1.125rem] md:rounded-3xl"
        initialsClassName="text-[2.5rem] md:text-[4.75rem]"
        zoomOnHover
      />

      <h3 className="mt-3 text-[15px] font-semibold leading-5 text-[#070707] md:mt-5 md:text-[22px] md:leading-tight md:tracking-[-0.01em]">
        {/* Toute la carte est cliquable ; le bouton porte le nom pour les lecteurs d'écran. */}
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="text-left after:absolute after:inset-0 after:rounded-[1.125rem] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[#0c7af8] focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-[#f7faf6] md:after:rounded-3xl"
        >
          {person.name}
          <span className="sr-only"> — voir le profil</span>
        </button>
      </h3>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0a67d0] md:mt-1.5 md:text-[13px] md:tracking-[0.14em]">
        {person.role}
      </p>
      <p
        aria-hidden="true"
        className="mt-3.5 hidden items-center gap-2 text-[15px] font-medium text-[#070707] md:inline-flex"
      >
        Voir le profil
        <span className="text-[#0a67d0] transition-transform duration-200 group-hover:translate-x-1">→</span>
      </p>
    </article>
  );
}
