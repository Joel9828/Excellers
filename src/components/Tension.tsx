"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { tension } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";

/** The gap the whole offer exists to close: possibility is not progress. */
export default function Tension() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section ref={ref} id="tension" className="relative overflow-hidden py-24 sm:py-28" aria-label="The tension">
      <div className="dot-field pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="shell relative grid justify-items-center gap-5 text-center">
        <motion.p initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 0.6 }} className="eyebrow">
          {tension.eyebrow}
        </motion.p>
        <motion.h2
          initial={false}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-ink"
        >
          {tension.title}
        </motion.h2>
        <motion.p
          initial={false}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-[54ch] text-[1.125rem] leading-[1.65] text-slate"
        >
          {tension.lede}
        </motion.p>

        {/* the five steps, each dot a shade more solid than the last */}
        <ol className="glass mt-6 flex w-full max-w-[940px] flex-wrap overflow-hidden rounded-[16px]">
          {tension.steps.map((s, i) => (
            <motion.li
              key={s}
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.6, delay: 0.16 + i * 0.07 }}
              className="relative z-10 flex flex-1 basis-[140px] items-center justify-center gap-2.5 border-r border-mist/60 px-4 py-4 text-[0.9375rem] font-semibold text-marian last:border-r-0"
            >
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{
                  background: i === tension.steps.length - 1 ? "var(--color-signal)" : "var(--color-marian)",
                  opacity: i === tension.steps.length - 1 ? 1 : 0.25 + i * 0.15,
                }}
                aria-hidden="true"
              />
              {s}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
