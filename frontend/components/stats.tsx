"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type CounterProps = {
  end: number;
  duration?: number;
};

function Counter({ end, duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);

  const startCounting = () => {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
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

export default function Stats() {
  const stats = [
    { label: "Enfants soutenus", value: 50 },
    { label: "Bénévoles actifs", value: 10 },
    { label: "Projets en cours", value: 2 },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-2  sm:px-8 lg:px-12 lg:py-3">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#dfe7df] bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="text-4xl font-bold text-[#070707]">
              <Counter end={s.value} duration={2000} />+
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