"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { HomeContent } from "@/server/content/home";

/** Haut de la page d'accueil — textes et photo : Contenu → Page d'accueil. */
export default function Hero({ content }: { content: HomeContent["hero"] }) {
  return (
    <section className="min-h-[52vh] px-5 pb-2 pt-8 text-[#070707] sm:px-8 sm:pb-3 sm:pt-10 lg:min-h-[54vh] lg:px-12 lg:pb-3 lg:pt-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-x-16 gap-y-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-[#526057] sm:text-lg sm:leading-8">
            {content.subtitle}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
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
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-[#d9e0d5] bg-white p-3 shadow-sm"
        >
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width={1080}
            height={720}
            sizes="(max-width: 1024px) 100vw, 600px"
            loading="eager"
            fetchPriority="high"
            className="aspect-video w-full rounded-xl object-cover"
          />
          {content.caption ? (
            <figcaption className="px-2 pb-1 pt-3 text-base font-medium text-[#0c0c0c] sm:text-lg">
              {content.caption}
            </figcaption>
          ) : null}
        </motion.figure>
      </div>
    </section>
  );
}
