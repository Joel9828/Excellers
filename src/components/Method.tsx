"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { principle } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";
import BrandBackdrop from "./BrandBackdrop";
import PhaseVisual from "./PhaseVisual";
import RaggedEdge from "./RaggedEdge";

/**
 * The framework. A compact intro on paper, then a pinned section whose five
 * phase panels translate horizontally while the page scrolls vertically.
 *
 * Each panel carries copy on the left and a live HUD diagram on the right, so
 * no part of the run is empty paper; a drifting tech grid, a scrub progress
 * bar and a phase stepper sit over the top as fixed chrome.
 */
export default function Method() {
  const wrap = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  // not `whileInView`: a missed observer callback here left the whole intro
  // invisible, which read as a blank white screen
  const shown = useRevealed(introRef);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrapEl = wrap.current;
    const railEl = rail.current;
    if (!wrapEl || !railEl) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.registerPlugin(ScrollTrigger);

      const panels = gsap.utils.toArray<HTMLElement>(".stage-panel", railEl);
      const distance = () => railEl.scrollWidth - window.innerWidth;

      const tween = gsap.to(railEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapEl,
          pin: true,
          scrub: 0.7,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setProgress(self.progress);
            setActive(
              Math.min(
                panels.length - 1,
                Math.round(self.progress * (panels.length - 1)),
              ),
            );
          },
        },
      });

      // ghost numbers drift slower than their panel for depth
      panels.forEach((p) => {
        const ghost = p.querySelector(".stage-ghost");
        if (!ghost) return;
        gsap.fromTo(
          ghost,
          { xPercent: 14 },
          {
            xPercent: -14,
            ease: "none",
            scrollTrigger: {
              trigger: p,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="principle" data-theme="brand" className="on-brand brand-plane relative text-white">
      <RaggedEdge gradient={["#0a5aa4", "#013e8a", "#04234f"]} seed={3} height={380} />

      {/* Sticky so the watermark rides the whole section rather than sitting
          centred once in a 7000px-tall box. The outer layer is absolute and
          clipped: a bare `sticky h-0` rail lets its 100svh child hang a full
          viewport past the section and wash over whatever follows. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="sticky top-0 h-[100svh]">
          <BrandBackdrop variant="brand" className="absolute inset-0" />
        </div>
      </div>

      {/* runs up over the torn strip so the texture has no seam at the edge */}
      <div
        className="dot-field-on-brand pointer-events-none absolute inset-x-0 bottom-0 -top-[380px] opacity-50"
        aria-hidden="true"
      />

      {/* ── intro ──────────────────────────────────────────────── */}
      <div ref={introRef} className="relative flex min-h-[56svh] items-center justify-center px-6 pb-10 pt-24 text-center">
        <div className="relative max-w-[720px]">
          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            [ {principle.eyebrow} ]
          </motion.p>

          <motion.h2
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-[20ch] font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em] text-white"
          >
            {principle.title}
          </motion.h2>

          <motion.p
            initial={false}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, delay: 0.16 }}
            className="mx-auto mt-6 max-w-[58ch] text-[1.125rem] leading-[1.65] text-white/75"
          >
            {principle.lede}
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-semibold uppercase tracking-[0.14em]"
          >
            {principle.stages.map((p, i) => (
              <span key={p.name} className="flex items-center gap-3">
                <span className={i === 4 ? "text-sky font-bold" : "text-white/55"}>
                  {p.name.toUpperCase()}
                </span>
                {i < principle.stages.length - 1 && (
                  <span className="h-px w-4 bg-white/25" aria-hidden="true" />
                )}
              </span>
            ))}
          </motion.div>

          <motion.p
            initial={false}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 text-[13px] font-medium uppercase tracking-[0.14em] text-white/55"
          >
            Keep scrolling — the framework runs sideways
          </motion.p>
        </div>
      </div>

      {/* ── pinned horizontal phases ───────────────────────────── */}
      <div ref={wrap} className="relative overflow-hidden">
        {/* drifting grid + scanlines give the run a machine surface */}
        <div
          className="tech-grid-on-brand pointer-events-none absolute inset-0 animate-[grid-drift_7s_linear_infinite] opacity-70"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_58%,rgba(0,180,217,0.16),transparent_58%)]"
          aria-hidden="true"
        />

        {/* stepper */}
        <div // top-28, not top-24: clears the floating nav pill (bottom ~87px) with room
          // to spare, so the two never crowd each other as the pin releases
          className="pointer-events-none absolute left-1/2 top-28 z-20 hidden -translate-x-1/2 items-center gap-0 lg:flex">
          {principle.stages.map((p, i) => (
            <span key={p.name} className="flex items-center">
              <span className="flex w-[84px] flex-col items-center gap-1.5">
                <span className="relative flex h-7 w-7 items-center justify-center">
                  {/* plain fade, not a shared-layout ring: layout animations
                      measure against the wrong box inside a pinned container */}
                  <span
                    className={`absolute inset-0 rounded-full border border-sky/80 transition-opacity duration-300 ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    className={`font-[family-name:var(--font-display)] text-[15px] font-bold transition-colors duration-300 ${
                      i <= active ? "text-white" : "text-white/30"
                    }`}
                  >
                    {p.name[0]}
                  </span>
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${
                    i === active ? "text-sky font-bold" : "text-white/35"
                  }`}
                >
                  {p.name.toUpperCase()}
                </span>
              </span>
              {i < principle.stages.length - 1 && (
                <span className="relative -mt-4 h-px w-6 bg-white/20" aria-hidden="true">
                  <span
                    className="absolute inset-y-0 left-0 bg-sky transition-[width] duration-500"
                    style={{ width: i < active ? "100%" : "0%" }}
                  />
                </span>
              )}
            </span>
          ))}
        </div>

        {/* scrub progress */}
        <div className="glass-on-brand pointer-events-none absolute bottom-8 left-1/2 z-20 hidden w-[min(560px,60vw)] -translate-x-1/2 overflow-hidden rounded-2xl px-5 py-3.5 lg:block">
          <div className="relative z-10 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            <span>Stage {String(active + 1).padStart(2, "0")} / 05</span>
            <span className="tabular-nums">{Math.round(progress * 100)}%</span>
          </div>
          <div className="relative z-10 h-px w-full bg-white/25">
            <div
              className="absolute inset-y-0 left-0 bg-sky"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(127,215,255,0.8)]"
              style={{ left: `calc(${progress * 100}% - 3px)` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div ref={rail} className="flex flex-col lg:w-max lg:flex-row">
          {principle.stages.map((p, i) => (
            <article
              key={p.n}
              className="stage-panel relative flex min-h-[70svh] w-full shrink-0 items-center overflow-hidden px-6 py-20 lg:h-[100svh] lg:min-h-0 lg:w-screen lg:px-[7vw] lg:pb-12 lg:pt-16"
            >
              <span
                className="stage-ghost pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none
                           font-[family-name:var(--font-display)] text-[clamp(11rem,32vw,28rem)] font-extrabold leading-none text-white/[0.07]"
                aria-hidden="true"
              >
                {p.n}
              </span>

              <div className="relative mx-auto grid w-full max-w-[760px] justify-items-center gap-6 text-center">
                {/* copy */}
                <div className="max-w-[620px]">
                  <span className="glass-on-brand relative mb-5 inline-flex items-center gap-2.5 overflow-hidden rounded-full px-4 py-1.5">
                    <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-sky shadow-[0_0_8px_2px_rgba(127,215,255,0.7)]" />
                    <span className="relative z-10 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80">
                      Stage {p.n}
                    </span>
                  </span>

                  {/* No in-view trigger here: the panel sliding in *is* the
                      reveal, and an observer inside a pinned, translated rail
                      can miss entirely on a fast scroll, leaving copy blank. */}
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.015em] text-white">
                    {p.name}
                  </h3>

                  <div className="my-6 flex items-center justify-center gap-3">
                    <span className="h-px w-16 bg-gradient-to-r from-transparent to-sky" />
                    <span className="h-1 w-1 rotate-45 bg-sky" />
                    <span className="h-px w-16 bg-gradient-to-l from-transparent to-sky" />
                  </div>

                  <p className="mx-auto max-w-[46ch] text-[1.0625rem] leading-[1.65] text-white/80">
                    {p.meaning}
                  </p>

                  <p className="mt-7 text-[15px] font-medium text-white/65">
                    {principle.questionLabel}
                  </p>
                  <p className="mx-auto mt-3 max-w-[30ch] font-[family-name:var(--font-display)] text-[1.625rem] font-bold leading-[1.3] text-white">
                    {p.question}
                  </p>
                </div>

                {/* HUD */}
                <div className="hud-tall-only hidden origin-top scale-[0.85] lg:block">
                  <PhaseVisual index={i} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
