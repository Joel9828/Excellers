"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { principle } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";
import RaggedEdge from "./RaggedEdge";
import StageGlyph from "./StageGlyph";
import PhaseVisual from "./PhaseVisual";

/**
 * The E-Principle as a tab stepper.
 *
 * This replaced a GSAP-pinned horizontal rail. The rail looked good but it
 * hijacked the scroll for five viewports, could not be driven from the
 * keyboard, and had no sensible reduced-motion path. Tabs give the same five
 * stages with arrow-key support, a real `tabpanel`, and no scroll capture —
 * which is what the client's master layout asks for.
 *
 * The stage glyph does the narrative work the rail used to: each tab shows
 * more of the honeycomb connected than the last.
 */
export default function Method() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -15% 0px" });
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = principle.stages.length;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      e.key
    ];
    if (step) {
      e.preventDefault();
      go((active + step + n) % n, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      go(n - 1, true);
    }
  };

  const stage = principle.stages[active];

  return (
    <section
      ref={ref}
      id="principle"
      data-theme="brand"
      // pb-[480px]: Proof's <RaggedEdge> is a 380px white strip hanging above
      // its own top edge, and this is its clearance — without it the tear
      // paints straight over the stage panel.
      className="on-brand brand-plane relative overflow-hidden pb-[480px] pt-28 text-white sm:pt-36"
      aria-label="The E-Principle"
    >
      <RaggedEdge gradient={["#0a5aa4", "#013e8a", "#04234f"]} seed={3} height={380} />
      <div
        className="dot-field-on-brand pointer-events-none absolute inset-x-0 bottom-0 -top-[380px] opacity-50"
        aria-hidden="true"
      />
      <div
        className="tech-grid-on-brand pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="mb-12 grid justify-items-center gap-5 text-center">
          <motion.p
            initial={false}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            [ {principle.eyebrow} ]
          </motion.p>
          <motion.h2
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[20ch] font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-white"
          >
            {principle.title}
          </motion.h2>
          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, delay: 0.16 }}
            className="max-w-[58ch] text-[1.125rem] leading-[1.65] text-white/75"
          >
            {principle.lede}
          </motion.p>
        </div>

        {/* ── the five tabs ──────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="E-Principle stages"
          onKeyDown={onKeyDown}
          className="mx-auto mb-8 flex max-w-[940px] flex-wrap justify-center gap-2.5"
        >
          {principle.stages.map((p, i) => (
            <button
              key={p.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`stage-${i}`}
              aria-selected={i === active}
              aria-controls="stage-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => go(i)}
              className={`glass-chip-on-brand flex min-h-[48px] items-center gap-2.5 rounded-full px-4 py-2 text-[0.9375rem] transition ${
                i === active
                  ? "font-semibold text-white ring-1 ring-sky/70"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <StageGlyph index={i} size={30} onBrand className="flex-none" />
              {p.name}
            </button>
          ))}
        </div>

        {/* ── the panel ──────────────────────────────────────────── */}
        <div
          role="tabpanel"
          id="stage-panel"
          aria-labelledby={`stage-${active}`}
          aria-live="polite"
          className="glass-on-brand mx-auto grid max-w-[940px] items-center gap-10 rounded-[22px] px-8 py-10 sm:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]"
        >
          {/* No entrance animation keyed to `active`: the panel content must
              never depend on a transition completing to become readable. */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sky">
              {principle.stageOf.replace("%s", String(active + 1))} ·{" "}
              {stage.name}
            </p>

            <h3 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.015em] text-white">
              {stage.question}
            </h3>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-sky" />
              <span className="h-1 w-1 rotate-45 bg-sky" />
            </div>

            <p className="max-w-[52ch] text-[1.0625rem] leading-[1.65] text-white/80">
              {stage.meaning}
            </p>

            <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.12em] text-white/55">
              {stage.readout}
            </p>
          </div>

          <div className="hidden justify-self-center lg:block">
            <PhaseVisual index={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
