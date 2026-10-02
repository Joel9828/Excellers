"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { proof } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";
import RaggedEdge from "./RaggedEdge";

/**
 * Internal proof only — three things built in-house.
 *
 * The empty state is deliberate, and is the client's wording: no client work
 * is claimed until that client has approved it. It replaces the earlier
 * "Reserved slot…" developer copy the master layout flagged as visible on the
 * live site.
 *
 * This section follows the Marian E-Principle block, so it carries the torn
 * edge that hands the page back to white.
 */
export default function Proof() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });

  return (
    <section ref={ref} id="proof" className="relative py-28 sm:py-36" aria-label="Proof">
      <RaggedEdge color="#ffffff" seed={11} height={380} />
      {/* runs up over the torn strip so the texture has no seam at the edge */}
      <div
        className="dot-field pointer-events-none absolute inset-x-0 bottom-0 -top-[380px] opacity-40"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="mb-12 grid justify-items-center gap-5 text-center">
          <motion.p initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 0.6 }} className="eyebrow">
            {proof.eyebrow}
          </motion.p>
          <motion.h2
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-ink"
          >
            {proof.title}
          </motion.h2>
          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-[52ch] text-[1.125rem] leading-[1.65] text-slate"
          >
            {proof.lede}
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {proof.tools.map((t, i) => (
            <motion.article
              key={t.name}
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.7, delay: 0.12 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="glass relative grid content-start gap-2 overflow-hidden rounded-[16px] px-7 py-7 text-center"
            >
              <b className="relative z-10 text-[1.125rem] font-bold text-ink">{t.name}</b>
              <span className="relative z-10 text-[0.9375rem] leading-relaxed text-slate">{t.desc}</span>
            </motion.article>
          ))}
        </div>

        {/* the empty state, deliberately visible */}
        <motion.div
          initial={false}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mx-auto mt-8 grid max-w-[620px] justify-items-center gap-3 rounded-[16px] border-[1.5px] border-dashed border-honolulu/70 bg-honolulu/[0.05] px-8 py-8 text-center"
        >
          <h3 className="text-[1.125rem] font-bold text-marian">{proof.empty.title}</h3>
          <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-slate">{proof.empty.body}</p>
          <a
            href="#contact"
            className="mt-2 rounded-[6px] border border-marian/40 px-6 py-3 text-[0.9375rem] font-semibold text-marian transition hover:bg-marian/[0.06]"
          >
            {proof.empty.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
