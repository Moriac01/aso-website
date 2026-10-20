"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { KeyFigure } from "@/server/content/keyFigures";

type CounterProps = {
  end: number;
  duration?: number;
};

function Counter({ end, duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  const startCounting = () => {
    // Valeur nulle, négative ou décimale saisie dans le back-office, ou animations
    // désactivées sur l'appareil : affichage direct.
    if (reduceMotion || end <= 0 || !Number.isInteger(end)) {
      setCount(end);
      return;
    }
    let start = 0;
    const stepTime = Math.max(1, Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
  };

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onViewportEnter={startCounting}
      viewport={{ once: true }}
    >
      {count}
    </motion.span>
  );
}

// Autant de colonnes que de chiffres (jusqu'à 4 par ligne).
const columns = ["", "sm:mx-auto sm:max-w-sm", "sm:grid-cols-2", "sm:grid-cols-3", "sm:grid-cols-2 lg:grid-cols-4"];

/** Chiffres clés gérés dans le back-office (/admin → Chiffres clés). */
export default function Stats({ items }: { items: KeyFigure[] }) {
  if (items.length === 0) return null;
  const stats = items;

  return (
    <section className="mx-auto max-w-7xl px-5 py-2  sm:px-8 lg:px-12 lg:py-3">
      <div className={`grid gap-4 ${columns[Math.min(stats.length, 4)]}`}>
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#dfe7df] bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="text-4xl font-bold text-[#070707]">
              <Counter end={s.value} duration={2000} />
              {s.suffix}
            </div>
            <div className="mt-3 text-sm font-medium uppercase tracking-[0.16em] text-[#526057]">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}