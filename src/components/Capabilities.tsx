"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { capabilities, capabilitiesIntro } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";
import CapabilityIcon from "./CapabilityIcon";

/**
 * The eight capabilities as one connected system, not a grid of cards.
 *
 * A list on the left, a radial honeycomb on the right. Selecting a capability
 * lights its node and every line that touches it — the point the copy makes is
 * that no capability stands alone, so the diagram has to show the links rather
 * than describe them.
 *
 * The list is the control; the SVG mirrors it and is `aria-hidden`, so a
 * screen reader gets the buttons and the live description, not the geometry.
 */

const R = 140;
const C = 200;

/** the eight nodes, evenly spaced from twelve o'clock */
const NODES = capabilities.map((_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 4;
  return [C + R * Math.cos(a), C + R * Math.sin(a)] as const;
});

/** every pair, so the mesh reads as a system rather than a star */
const EDGES: { a: number; b: number; near: boolean }[] = [];
for (let i = 0; i < 8; i++) {
  EDGES.push({ a: i, b: (i + 1) % 8, near: true });
  for (let j = i + 2; j < 8; j++) {
    if (!(i === 0 && j === 7)) EDGES.push({ a: i, b: j, near: false });
  }
}

export default function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -12% 0px" });
  const [active, setActive] = useState(0);

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

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* ── the list: the real control ─────────────────────── */}
          <div>
            <div className="glass overflow-hidden rounded-[18px]">
              {capabilities.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={i === active}
                  className={`relative z-10 flex w-full items-center gap-3.5 border-b border-mist/60 px-5 py-3.5 text-left text-[1rem] font-semibold transition last:border-b-0 ${
                    i === active
                      ? "bg-white/70 text-marian shadow-[inset_3px_0_0_var(--color-marian)]"
                      : "text-ink hover:bg-white/50 hover:text-honolulu"
                  }`}
                >
                  <CapabilityIcon
                    icon={c.icon}
                    size={30}
                    className="flex-none text-marian"
                  />
                  {c.name}
                </button>
              ))}
            </div>

            <p
              className="mt-6 min-h-[5.5rem] text-[1.0625rem] leading-[1.65] text-slate"
              aria-live="polite"
            >
              <b className="font-semibold text-ink">{capabilities[active].name}.</b>{" "}
              {capabilities[active].desc} {capabilitiesIntro.connects}
            </p>
          </div>

          {/* ── the honeycomb ──────────────────────────────────── */}
          <svg
            viewBox="0 0 400 400"
            className="mx-auto block w-full max-w-[460px]"
            aria-hidden="true"
          >
            {EDGES.map(({ a, b, near }) => {
              const on = a === active || b === active;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={NODES[a][0]}
                  y1={NODES[a][1]}
                  x2={NODES[b][0]}
                  y2={NODES[b][1]}
                  stroke={on ? "var(--color-honolulu)" : "var(--color-mist)"}
                  strokeWidth={on ? 1.8 : 1}
                  opacity={near || on ? 1 : 0.45}
                  className="transition-[stroke,stroke-width] duration-300"
                />
              );
            })}

            {/* spokes from the hub */}
            {NODES.map(([x, y], i) => (
              <line
                key={`h${i}`}
                x1={C}
                y1={C}
                x2={x}
                y2={y}
                stroke={i === active ? "var(--color-honolulu)" : "var(--color-mist)"}
                strokeWidth={i === active ? 1.8 : 1}
                className="transition-[stroke,stroke-width] duration-300"
              />
            ))}

            {/* the hub */}
            <circle cx={C} cy={C} r={34} fill="#ffffff" stroke="var(--color-marian)" strokeWidth={2} />
            <circle cx={C} cy={C - 12} r={4} fill="var(--color-signal)" />
            <text
              x={C}
              y={C + 10}
              textAnchor="middle"
              className="fill-slate text-[10px] font-semibold"
            >
              {capabilitiesIntro.hub[0]}
            </text>
            <text
              x={C}
              y={C + 22}
              textAnchor="middle"
              className="fill-slate text-[10px]"
            >
              {capabilitiesIntro.hub[1]}
            </text>

            {NODES.map(([x, y], i) => (
              <g
                key={capabilities[i].name}
                transform={`translate(${x} ${y})`}
                className={
                  i === active ? "text-honolulu" : "text-marian"
                }
              >
                <circle
                  r={32}
                  fill="#ffffff"
                  stroke={i === active ? "var(--color-marian)" : "var(--color-slate)"}
                  strokeWidth={i === active ? 2 : 1}
                  className="transition-[stroke,stroke-width] duration-300"
                />
                <g transform="translate(-19 -19)">
                  <CapabilityIcon icon={capabilities[i].icon} size={38} />
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
