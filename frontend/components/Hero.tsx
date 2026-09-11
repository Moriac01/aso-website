"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-[52vh] px-5 pb-2 pt-8 text-[#070707] sm:px-8 sm:pb-3 sm:pt-10 lg:min-h-[54vh] lg:px-12 lg:pb-3 lg:pt-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-x-16 gap-y-4 lg:grid-cols-2">
        <div className="contents lg:flex lg:flex-col lg:justify-center lg:gap-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 max-w-2xl lg:order-0"
          >
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-2xl lg:text-5xl">
              Offrant espoir et avenir aux orphelins.
            </h1>

            <p className="mt-3 max-w-xl text-base leading-5 text-[#526057] sm:text-lg">
              Grâce à votre soutien, nous agissons pour l&apos;éducation, la santé
              et l&apos;épanouissement des enfants.
            </p>
          </motion.div>

        </div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: true }}
          className="order-2 overflow-hidden rounded-2xl border border-[#d9e0d5] p-3 shadow-sm lg:order-0"
        >
          <Image
            src="/IMG-20250913-WA0014.jpg"
            alt="Enfants accompagnés par l'association"
            width={800}
            height={800}
            priority
            className="aspect-video w-full rounded-xl object-cover"
          />
          <figcaption className="px-2 pb-1 pt-3 text-base font-medium text-[#0c0c0c] sm:text-lg">
            Donnez le sourire pour un avenir meilleur.
          </figcaption>
        </motion.figure>

      </div>
    </section>
  );
}
