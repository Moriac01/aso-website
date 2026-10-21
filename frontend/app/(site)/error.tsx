"use client";

import Link from "next/link";

/** Erreur inattendue sur une page du site : message en français et possibilité de réessayer. */
export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-1 items-center bg-[#f7faf6] px-5 py-20 text-[#070707] sm:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">Un instant</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Cette page n’a pas pu s’afficher.</h1>
        <p className="mt-4 text-base leading-7 text-[#526057]">
          Un problème temporaire est survenu. Réessayez dans quelques instants ; s’il persiste, écrivez-nous.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center rounded-full bg-[#0a67d0] px-6 text-[15px] font-semibold text-white hover:bg-[#08529f]"
          >
            Réessayer
          </button>
          <Link href="/" className="inline-flex h-12 items-center rounded-full border border-[#0a67d0] px-6 text-[15px] font-semibold text-[#0a67d0] hover:bg-[#0a67d0] hover:text-white">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
