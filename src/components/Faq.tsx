"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { faq } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";

/** B2B questions: regions, confidentiality, entry point, pricing, industries. */
export default function Faq() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section
      ref={ref}
      id="questions"
      className="relative overflow-hidden py-28 sm:py-36"
      aria-label="Questions"
    >
      <div className="dot-field pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="shell relative">
        <motion.h2
          initial={false}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 max-w-[20ch] text-center font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-ink"
        >
          {faq.title}
        </motion.h2>

        <div className="glass relative mx-auto max-w-[860px] overflow-hidden rounded-[20px] px-7 sm:px-9">
          {faq.items.map((item, i) => (
            <motion.details
              key={item.q}
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.07 }}
              className="group relative z-10 border-b border-mist/70 last:border-b-0"
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-6 py-6
                           text-[1.125rem] font-semibold leading-[1.4] text-ink
                           [&::-webkit-details-marker]:hidden"
              >
                {item.q}
                <span
                  className="h-3 w-3 flex-none rotate-45 border-b-2 border-r-2 border-honolulu
                             transition-transform duration-[250ms] group-open:-rotate-[135deg]"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[64ch] pb-7 pr-12 text-base leading-relaxed text-slate">
                {item.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
