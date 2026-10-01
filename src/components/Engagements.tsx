"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { engagements } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";
import RaggedEdge from "./RaggedEdge";

/**
 * Three scope-based tiers. No figures and no "recommended" badge — the master
 * layout is explicit that pricing is agreed after scope, and that which tier
 * to push is still an open strategic question.
 */
export default function Engagements() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section
      ref={ref}
      id="engagements"
      // inherited from the removed Proof section: the torn edge that hands
      // the page back from the Marian E-Principle block to white
      className="relative py-28 sm:py-36"
      aria-label="Engagements"
    >
      <RaggedEdge color="#ffffff" seed={11} height={380} />
      {/* runs up over the torn strip so the texture has no seam at the edge */}
      <div
        className="dot-field pointer-events-none absolute inset-x-0 bottom-0 -top-[380px] opacity-40"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="mb-14 grid justify-items-center gap-5 text-center">
          <motion.h2
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[20ch] font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-ink"
          >
            {engagements.title}
          </motion.h2>
          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-[58ch] text-[1.125rem] leading-[1.65] text-slate"
          >
            {engagements.lede}
          </motion.p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {engagements.tiers.map((t, i) => (
            <motion.article
              key={t.name}
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
              transition={{ duration: 0.75, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass glass-hover relative flex flex-col items-center gap-5 overflow-hidden rounded-[18px] p-8 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_70px_-30px_rgba(1,62,138,0.5)]"
            >
              <span className="sheen" aria-hidden="true" />
              <span className="relative z-10 text-[0.9375rem] font-medium text-slate">{t.tag}</span>
              <h3 className="relative z-10 text-[1.75rem] font-bold leading-[1.2] tracking-[-0.015em] text-ink">
                {t.name}
              </h3>

              <ul className="relative z-10 grid w-full gap-3.5 border-t border-mist/80 pt-6 text-left">
                {t.points.map((p) => (
                  <li key={p} className="grid grid-cols-[20px_1fr] gap-2 text-base leading-relaxed text-slate">
                    <Hex />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="signal-btn relative z-10 mt-auto rounded-[4px] px-6 py-3.5 text-base font-semibold text-void shadow-[0_10px_26px_-12px_rgba(0,180,217,0.8)] transition hover:brightness-110"
              >
                {engagements.cta}
              </a>
            </motion.article>
          ))}
        </div>

        {/* shared baseline */}
        <motion.div
          initial={false}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="glass relative mt-6 grid items-center justify-items-center gap-6 overflow-hidden rounded-[18px] px-8 py-7 text-center"
        >
          <h3 className="relative z-10 text-[1.125rem] font-bold text-ink">{engagements.baselineTitle}</h3>
          <ul className="relative z-10 flex flex-wrap justify-center gap-x-9 gap-y-3">
            {engagements.baseline.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-base text-slate">
                <Hex />
                {b}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function Hex() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" className="mt-[5px] flex-none text-honolulu" aria-hidden="true">
      <path d="M6 0l6 3.5v7L6 14 0 10.5v-7z" fill="currentColor" />
    </svg>
  );
}
