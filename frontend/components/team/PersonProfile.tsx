"use client";

import { useEffect, useRef } from "react";

import type { Person } from "@/app/(site)/about/data";
import { PersonPortrait } from "@/components/PersonCard";

const typeLabels: Record<Person["type"], string> = {
  executive: "Bureau exécutif",
  member: "Membre",
  volunteer: "Bénévole",
};

/**
 * Profil d'un membre en grand (fenêtre <dialog> native : focus gardé dans la fenêtre,
 * fermeture avec Échap). Flèches gauche/droite ou boutons pour passer au profil voisin.
 */
export function PersonProfile({
  person,
  onClose,
  onPrevious,
  onNext,
}: {
  person: Person | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = person !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // La page derrière ne défile plus tant que le profil est ouvert.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="profil-membre-nom"
      onClose={onClose}
      onClick={(event) => {
        // Clic sur le fond sombre (en dehors de la fiche) : fermeture.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" && onPrevious) onPrevious();
        if (event.key === "ArrowRight" && onNext) onNext();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[1000px] overflow-visible border-0 bg-transparent p-0 text-[#070707] backdrop:bg-[#07140c]/60"
    >
      {person ? (
        <div className="relative grid max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[1.75rem] bg-white shadow-2xl md:grid-cols-[400px_1fr] md:overflow-hidden md:rounded-[2rem]">
          <PersonPortrait
            person={person}
            sizes="(max-width: 768px) 100vw, 400px"
            className="max-h-[55dvh] md:max-h-none"
            initialsClassName="text-7xl md:text-8xl"
          />

          <div className="flex flex-col p-6 sm:p-10 md:p-14">
            <span className="self-start rounded-full bg-[#eaf6ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0a67d0]">
              {typeLabels[person.type]}
            </span>
            <h3
              id="profil-membre-nom"
              className="mt-5 text-2xl font-bold tracking-[-0.02em] sm:text-[34px] sm:leading-tight"
            >
              {person.name}
            </h3>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#0a67d0]">
              {person.role}
            </p>

            {person.description ? (
              <>
                <div className="mt-7 h-px bg-[#dfe7df]" />
                <p className="mt-7 text-base leading-[1.8] text-[#3d4a42]">{person.description}</p>
              </>
            ) : null}

            {onPrevious || onNext ? (
              <div className="mt-auto flex gap-3 pt-8">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="rounded-full border border-[#dfe7df] px-4 py-2.5 text-sm font-medium transition hover:border-[#0a67d0] hover:text-[#08529f]"
                >
                  <span aria-hidden="true">← </span>Précédent
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="rounded-full border border-[#dfe7df] px-4 py-2.5 text-sm font-medium transition hover:border-[#0a67d0] hover:text-[#08529f]"
                >
                  Suivant<span aria-hidden="true"> →</span>
                </button>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Fermer le profil"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-[#070707] shadow-sm transition hover:bg-[#eaf6ff] md:right-5 md:top-5 md:bg-[#f2f5f2]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
