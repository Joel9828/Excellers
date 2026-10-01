"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { statement } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";
import ParticleCloud from "./ParticleCloud";

/**
 * The We Manifest™ philosophy, standing where a testimonial would normally
 * go — the master layout is explicit that no approved client quote exists
 * yet, and that this should be swapped for one when it does.
 */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section
      ref={ref}
      id="about"
      // The E-Principle's <RaggedEdge> is a 380px Marian strip hanging above
      // its own top; the bottom padding is its clearance.
      className="relative overflow-hidden pb-[480px] pt-28 sm:pt-32"
      aria-label="The EXCELLERS philosophy"
    >
      <div className="dot-field pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <ParticleCloud
        className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[min(56vw,720px)] -translate-x-1/2 -translate-y-1/2 opacity-55"
        count={620}
      />

      <div className="shell relative">
        <div className="glass glass-edge glass-frost glass-track relative mx-auto grid max-w-[880px] justify-items-center gap-7 overflow-hidden rounded-[28px] px-8 py-14 text-center sm:px-14">
          <span className="glass-glow" aria-hidden="true" />
          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 font-[family-name:var(--font-display)] text-[clamp(3rem,1.8rem+5vw,6rem)] font-bold leading-none tracking-[-0.02em] text-ink"
          >
            <span className="whitespace-nowrap">
              {statement.big}
              <sup className="relative top-[0.55em] ml-[0.06em] text-[0.32em] tracking-normal">
                {statement.trademark}
              </sup>
            </span>
          </motion.p>

          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.85, delay: 0.12 }}
            className="relative z-10 max-w-[56ch] text-[1.125rem] leading-[1.65] text-slate"
          >
            {statement.body}
          </motion.p>

          <motion.p
            initial={false}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 text-[0.9375rem] font-medium text-honolulu"
          >
            {statement.source}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
