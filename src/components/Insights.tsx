"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { insights } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";

/** Insights, honest about being empty until the first article is published. */
export default function Insights() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section ref={ref} id="insights" className="relative overflow-hidden py-28 sm:py-32" aria-label="Insights">
      <div className="shell relative grid justify-items-center gap-5 text-center">
        <motion.p initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 0.6 }} className="eyebrow">
          {insights.eyebrow}
        </motion.p>
        <motion.h2
          initial={false}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-ink"
        >
          {insights.title}
        </motion.h2>
        <motion.p
          initial={false}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-[52ch] text-[1.125rem] leading-[1.65] text-slate"
        >
          {insights.lede}
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 grid w-full max-w-[620px] justify-items-center gap-3 rounded-[16px] border-[1.5px] border-dashed border-honolulu/70 bg-honolulu/[0.05] px-8 py-8"
        >
          <h3 className="text-[1.125rem] font-bold text-marian">{insights.empty.title}</h3>
          <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-slate">{insights.empty.body}</p>
          <a
            href="#contact"
            className="mt-2 rounded-[6px] border border-marian/40 px-6 py-3 text-[0.9375rem] font-semibold text-marian transition hover:bg-marian/[0.06]"
          >
            {insights.empty.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
