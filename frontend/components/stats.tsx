"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { KeyFigure } from "@/server/content/keyFigures";

type CounterProps = {
  end: number;
  duration?: number;
};

function Counter({ end, duration = 1500 }: CounterProps) {
  // Le vrai chiffre dès l'affichage : Google, les aperçus de liens et les navigateurs
  // sans JavaScript ne voient plus « 0 ». L'animation part de 0 seulement à l'écran.
  const [count, setCount] = useState(end);
  const reduceMotion = useReducedMotion();

  const startCounting = () => {
    // Valeur décimale, nulle ou très petite, ou animations désactivées sur l'appareil : rien à animer.
    if (reduceMotion || end <= 1 || !Number.isInteger(end)) return;
    const steps = Math.min(end, 40);
    let step = 0;
    setCount(0);
    const timer = setInterval(() => {
      step += 1;
      setCount(Math.round((end * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  };

  return (
    <motion.span onViewportEnter={startCounting} viewport={{ once: true }}>
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
            initial={{ y: 12 }}
            whileInView={{ y: 0 }}
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