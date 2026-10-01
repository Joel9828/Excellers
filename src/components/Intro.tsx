"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { brand, introVideo, principle } from "@/lib/content";

const EvolutionScene = dynamic(() => import("./EvolutionScene"), { ssr: false });

/**
 * The opening curtain. It sits at the very top of the page and stays pinned
 * while the reader scrolls the first viewport; the site proper slides up over
 * it, so the intro is a threshold rather than a page you have to sit through.
 *
 * The backdrop is `introVideo` from lib/content when one is configured, and a
 * generated particle "evolution" scene otherwise — see README.
 *
 * Entrances are CSS animations, not JS: this is the first paint, and an
 * animation that fails to run must not leave the screen empty.
 */
export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <div ref={ref} className="relative h-[170svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-paper">
        {/* ── backdrop ─────────────────────────────────────────── */}
        <motion.div style={{ scale }} className="absolute inset-0">
          {introVideo ? (
            <video
              className="h-full w-full object-cover opacity-55"
              src={introVideo}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          ) : (
            <EvolutionScene className="h-full w-full" />
          )}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(244,246,250,0.55)_58%,#f4f6fa_94%)]"
            aria-hidden="true"
          />
          <div className="scanlines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        </motion.div>

        {/* ── foreground ───────────────────────────────────────── */}
        <motion.div
          style={{ opacity, y }}
          className="relative flex h-full flex-col items-center justify-center px-6 text-center"
        >
          {/* The lockup. The wordmark already contains the horse as its C;
              the overlay is the same artwork flying into that exact slot, so
              the two become one at the end of the flight. */}
          <div className="relative w-[min(86vw,720px)]" role="img" aria-label="EXCELLERS">
            <span className="relative block aspect-[1911/379] w-full">
              {/* glow that travels with the horse */}
              <span
                className="lk-glow absolute rounded-full bg-[radial-gradient(circle,rgba(0,180,217,0.45),transparent_70%)] blur-2xl"
                style={{ left: "23.225%", top: "3.166%", width: "11.108%", height: "73.087%" }}
                aria-hidden="true"
              />

              <Image
                src="/brand/wordmark.png"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 86vw, 720px"
                className="object-contain"
              />

              <span
                className="lk-horse absolute"
                style={{ left: "23.225%", top: "3.166%", width: "11.108%", height: "73.087%" }}
                aria-hidden="true"
              >
                <Image
                  src="/brand/symbol.png"
                  alt=""
                  fill
                  priority
                  sizes="120px"
                  className="object-contain drop-shadow-[0_6px_18px_rgba(1,62,138,0.28)]"
                />
              </span>
            </span>
          </div>

          <p
            className="i-track mt-5 text-[clamp(0.7rem,1.6vw,0.95rem)] font-medium uppercase text-slate"
            style={{ animationDelay: "0.75s" }}
          >
            {brand.slogan}
            <sup className="ml-[0.15em] text-[0.55em] tracking-normal">&trade;</sup>
          </p>

          {/* the five values, ticking in */}
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {principle.stages.map((p, i) => (
              <li
                key={p.name}
                className="i-rise glass-chip flex items-center gap-4 rounded-full px-4 py-2"
                style={{ animationDelay: `${1.15 + i * 0.11}s` }}
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate">
                  {p.name.toUpperCase()}
                </span>
                
              </li>
            ))}
          </ul>

          {/* scroll cue */}
          <div
            className="i-fade glass-chip absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 rounded-full px-4 py-3.5"
            style={{ animationDelay: "1.9s" }}
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate">
              Scroll
            </span>
            <span className="relative h-11 w-px overflow-hidden bg-mist">
              <span className="absolute inset-x-0 h-1/2 animate-[cue-run_1.9s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-honolulu to-transparent" />
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
