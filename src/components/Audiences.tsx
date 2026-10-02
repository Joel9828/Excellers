"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { audiences } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";

/** Who the work is for, framed as the friction each role is trying to remove. */
export default function Audiences() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section ref={ref} id="who" className="relative overflow-hidden py-28 sm:py-32" aria-label="Who we work with">
      <div className="dot-field pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="shell relative">
        <div className="mb-12 grid justify-items-center gap-5 text-center">
          <motion.p initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 0.6 }} className="eyebrow">
            {audiences.eyebrow}
          </motion.p>
          <motion.h2
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[22ch] font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-ink"
          >
            {audiences.title}
          </motion.h2>
          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-[52ch] text-[1.125rem] leading-[1.65] text-slate"
          >
            {audiences.lede}
          </motion.p>
        </div>

        <div className="glass grid overflow-hidden rounded-[18px] sm:grid-cols-2 lg:grid-cols-5">
          {audiences.items.map((a, i) => (
            <motion.div
              key={a.name}
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.07 }}
              className="relative z-10 grid content-start gap-2 border-b border-r border-mist/60 px-6 py-7 text-center last:border-r-0"
            >
              <b className="text-[1.0625rem] font-bold text-ink">{a.name}</b>
              <span className="text-[0.9375rem] leading-relaxed text-slate">{a.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
