"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { hero, regions } from "@/lib/content";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28 sm:pb-16"
    >
      <div
        className="dot-field pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div
        className="tech-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_center,#000_15%,transparent_72%)]"
        aria-hidden="true"
      />

      {/* HUD corner brackets */}
      {(
        [
          "left-5 top-24 border-l border-t",
          "right-5 top-24 border-r border-t",
          "left-5 bottom-6 border-l border-b",
          "right-5 bottom-6 border-r border-b",
        ] as const
      ).map((c) => (
        <span
          key={c}
          className={`pointer-events-none absolute hidden h-7 w-7 border-signal/45 sm:block ${c}`}
          aria-hidden="true"
        />
      ))}

      {/* Globe: centred on small screens where the copy is full width, then
          anchored to the right half from lg up so it never crosses the
          headline. */}
      <div
        className="absolute inset-x-0 top-[6%] z-10 mx-auto h-[38svh] w-full max-w-[420px]
                   sm:h-[44svh] sm:max-w-[500px]
                   lg:inset-x-auto lg:right-[4%] lg:top-1/2 lg:mx-0 lg:h-[64svh] lg:w-[min(46vw,620px)] lg:max-w-none lg:-translate-y-1/2"
      >
        <Globe className="h-full w-full" />

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 7, times: [0, 0.12, 0.8, 1], delay: 2.4 }}
          className="pointer-events-none absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2
                     whitespace-nowrap rounded-full border border-mist bg-white/85 px-3 py-1.5
                     text-[11px] tracking-[0.12em] text-slate/80 backdrop-blur-md"
        >
          DRAG TO SPIN · CLICK TO PULSE
        </motion.span>
      </div>

      {/* copy — kept to the left half from lg up so nothing runs under the globe */}
      <div className="shell relative">
        <div className="lg:max-w-[54%]">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[16ch] font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-bold leading-[1.05] tracking-[-0.015em] text-ink"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-slate"
          >
            {hero.lede}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <a
              href="#contact"
              className="signal-btn glass-hover relative overflow-hidden rounded-[6px] px-6 py-3.5 text-base font-semibold text-void shadow-[0_12px_30px_-14px_rgba(0,180,217,0.9)] transition hover:brightness-110"
            >
              <span className="sheen" aria-hidden="true" />
              <span className="relative z-10">{hero.primary}</span>
            </a>
            <a
              href="#principle"
              className="glass glass-hover relative overflow-hidden rounded-[6px] px-6 py-3.5 text-base font-semibold text-ink transition hover:-translate-y-0.5"
            >
              <span className="sheen" aria-hidden="true" />
              <span className="relative z-10">{hero.secondary}</span>
            </a>
          </motion.div>

          {/* region strip */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-10 flex flex-wrap gap-x-10 gap-y-3 border-t border-mist pt-7 text-[15px] text-slate"
          >
            {regions.map((r) => (
              <li key={r} className="flex items-center gap-2.5">
                <Hex />
                {r}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* the Manifest Line — a travelling light along a hairline */}
      <div
        className="relative z-10 mt-12 h-[2px] overflow-hidden bg-mist"
        aria-hidden="true"
      >
        <span className="manifest-line absolute inset-y-0 w-[32%]" />
      </div>
    </section>
  );
}

/** The guide's honeycomb cell, used as a bullet. */
function Hex() {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      className="flex-none text-honolulu"
      aria-hidden="true"
    >
      <path d="M6 0l6 3.5v7L6 14 0 10.5v-7z" fill="currentColor" />
    </svg>
  );
}
