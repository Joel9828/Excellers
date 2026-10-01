"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { capabilities, capabilitiesIntro } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";

/**
 * The eight capabilities, as one monochrome grid. They are numbered because
 * they are a fixed set, and Signal appears only as the hover line — the master
 * layout is explicit that the accent is not spent anywhere else here.
 */
export default function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section
      ref={ref}
      id="capabilities"
      className="relative overflow-hidden py-28 sm:py-36"
      aria-label="Capabilities"
    >
      <div className="dot-field pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="shell relative">
        <div className="mb-14 grid justify-items-center gap-5 text-center">
          <motion.p
            initial={false}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            {capabilitiesIntro.eyebrow}
          </motion.p>
          <motion.h2
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[20ch] font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-ink"
          >
            {capabilitiesIntro.title}
          </motion.h2>
          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-[58ch] text-[1.125rem] leading-[1.65] text-slate"
          >
            {capabilitiesIntro.lede}
          </motion.p>
        </div>

        <div className="glass relative grid overflow-hidden rounded-[22px] sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <motion.a
              key={c.name}
              href="#contact"
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative z-10 flex min-h-[248px] flex-col items-center overflow-hidden border-b border-r border-mist/60 px-7 pb-8 pt-7 text-center transition-colors duration-300 last:border-r-0 hover:bg-white/60 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
            >
              {/* Signal hover line — the one place the accent is spent here */}
              <span
                className="absolute -left-px -right-px -top-px h-[3px] origin-left scale-x-0 bg-signal transition-transform duration-[350ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                aria-hidden="true"
              />

              {/* hexagon-framed number */}
              <span className="relative grid h-[50px] w-11 place-items-center text-honolulu">
                <svg viewBox="0 0 44 50" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <path
                    d="M22 1l20 11.5v25L22 49 2 37.5v-25z"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                  />
                </svg>
                <b className="relative text-[13px] font-semibold tabular-nums text-ink/85">
                  {String(i + 1).padStart(2, "0")}
                </b>
              </span>

              <h3 className="mt-8 min-h-[2.5em] text-[1.25rem] font-bold leading-[1.25] tracking-[-0.01em] text-ink">
                {c.name}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.55] text-slate">{c.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
