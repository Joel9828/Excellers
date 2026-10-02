"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { whatWeDo } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";

/** Clarify, Build, Advance — the offer in three words. */
export default function WhatWeDo() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section ref={ref} id="what" className="relative overflow-hidden py-24 sm:py-28" aria-label="What we do">
      <div className="shell relative grid justify-items-center gap-5 text-center">
        <motion.p initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 0.6 }} className="eyebrow">
          {whatWeDo.eyebrow}
        </motion.p>
        <motion.h2
          initial={false}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[22ch] font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-ink"
        >
          {whatWeDo.title}
        </motion.h2>

        <div className="mt-8 grid w-full gap-6 sm:grid-cols-3">
          {whatWeDo.items.map((it, i) => (
            <motion.div
              key={it.name}
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.7, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass relative grid justify-items-center gap-2 overflow-hidden rounded-[16px] px-6 py-8"
            >
              <b className="relative z-10 font-[family-name:var(--font-display)] text-[1.75rem] font-bold text-marian">
                {it.name}
              </b>
              <span className="relative z-10 text-[1rem] leading-relaxed text-slate">{it.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
