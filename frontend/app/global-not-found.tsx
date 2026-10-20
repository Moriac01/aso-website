import type { Metadata } from "next";
import Link from "next/link";

import "./(site)/globals.css";

export const metadata: Metadata = {
  title: "Page introuvable — ASO",
  description: "Cette page n’existe pas ou plus.",
};

/** Adresse qui ne correspond à aucune page (le site a deux gabarits : site public et back-office). */
export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center bg-[#f7faf6] px-5 font-sans text-[#070707] antialiased">
        <main className="mx-auto max-w-xl py-20 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- page autonome, sans optimisation d'image */}
          <img src="/icon.png" alt="ASO — Association Soutien aux Orphelins" width={64} height={56} className="mx-auto" />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-[#0a67d0]">Erreur 404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Cette page n’existe pas ou plus.</h1>
          <p className="mt-4 text-base leading-7 text-[#526057]">
            Le lien est peut-être incomplet, ou la page a été retirée. Vous pouvez repartir de l’accueil ou nous écrire.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex h-12 items-center rounded-full bg-[#0a67d0] px-6 text-[15px] font-semibold text-white hover:bg-[#08529f]">
              Retour à l’accueil
            </Link>
            <Link href="/contact" className="inline-flex h-12 items-center rounded-full border border-[#0a67d0] px-6 text-[15px] font-semibold text-[#0a67d0] hover:bg-[#0a67d0] hover:text-white">
              Nous contacter
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
