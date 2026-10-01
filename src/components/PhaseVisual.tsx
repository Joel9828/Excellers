"use client";

import { motion } from "framer-motion";

/**
 * The HUD panel that rides alongside each phase in the horizontal rail. One
 * diagram per phase so the right-hand half of the screen carries weight
 * instead of sitting empty white.
 */

const STROKE = "#0076b5";
const HOT = "#00b4d9";

function Frame({
  label,
  readout,
  children,
}: {
  label: string;
  readout: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full max-w-[420px]">
      {/* corner brackets */}
      {(
        [
          "left-0 top-0 border-l-2 border-t-2",
          "right-0 top-0 border-r-2 border-t-2",
          "left-0 bottom-0 border-l-2 border-b-2",
          "right-0 bottom-0 border-r-2 border-b-2",
        ] as const
      ).map((c) => (
        <span key={c} className={`absolute h-4 w-4 border-sky/70 ${c}`} aria-hidden="true" />
      ))}

      <div className="glass glass-edge relative m-[9px] overflow-hidden rounded-lg shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)]">
        <div className="relative z-10 flex items-center justify-between border-b border-mist/70 px-3.5 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
            {label}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 animate-pulse rounded-full bg-signal" />
            <span className="text-[11px] font-medium uppercase tabular-nums tracking-[0.1em] text-slate/70">
              {readout}
            </span>
          </span>
        </div>

        <div className="relative aspect-[4/3] w-full">
          <div className="tech-grid absolute inset-0 opacity-60" aria-hidden="true" />
          {children}
        </div>
      </div>
    </div>
  );
}

const dash = (i: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.5, delay: 0.15 + i * 0.12, repeat: Infinity, repeatDelay: 2.4 },
});

/** 01 — Explore: a radar sweep turning up scattered signals. */
function Explore() {
  return (
    <Frame label="SIGNAL SWEEP" readout="SCANNING">
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
        {[22, 38, 54].map((r) => (
          <circle key={r} cx="100" cy="75" r={r} fill="none" stroke={STROKE} strokeOpacity="0.2" />
        ))}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 75px" }}
        >
          <path d="M100 75 L100 21 A54 54 0 0 1 148 49 Z" fill={HOT} fillOpacity="0.14" />
          <line x1="100" y1="75" x2="100" y2="21" stroke={HOT} strokeWidth="1.2" />
        </motion.g>
        {[
          [74, 52],
          [130, 63],
          [112, 101],
          [83, 96],
          [142, 88],
        ].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="2.4"
            fill={HOT}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: i * 0.9 }}
          />
        ))}
      </svg>
    </Frame>
  );
}

/** 02 — Enlighten: evidence assembling, bar by bar. */
function Enlighten() {
  const bars = [28, 46, 38, 62, 54, 78, 70, 92];
  return (
    <Frame label="EVIDENCE" readout="ANALYSING">
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
        <line x1="18" y1="126" x2="184" y2="126" stroke={STROKE} strokeOpacity="0.3" />
        {bars.map((h, i) => (
          <motion.rect
            key={i}
            x={22 + i * 20}
            width="11"
            rx="1.5"
            fill={i === bars.length - 1 ? HOT : STROKE}
            fillOpacity={i === bars.length - 1 ? 0.85 : 0.4}
            initial={{ height: 0, y: 126 }}
            animate={{ height: h, y: 126 - h }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2.6,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
    </Frame>
  );
}

/** 03 — Execute: work branching out into delivery. */
function Execute2() {
  const edges = [
    [100, 34, 52, 78],
    [100, 34, 148, 78],
    [52, 78, 30, 118],
    [52, 78, 74, 118],
    [148, 78, 126, 118],
    [148, 78, 170, 118],
  ];
  return (
    <Frame label="DELIVERY GRAPH" readout="EXECUTING">
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
        {edges.map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={HOT}
            strokeWidth="1.1"
            {...dash(i)}
          />
        ))}
        {[
          [100, 34, 5],
          [52, 78, 4],
          [148, 78, 4],
          [30, 118, 3],
          [74, 118, 3],
          [126, 118, 3],
          [170, 118, 3],
        ].map(([x, y, r], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={i === 0 ? HOT : "#fff"}
            stroke={STROKE}
            strokeWidth="1.2"
            animate={{ scale: [1, 1.22, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.22 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}
      </svg>
    </Frame>
  );
}

/** 04 — Empower: a broadcast the team carries on its own. */
function Empower() {
  return (
    <Frame label="AUTONOMY INDEX" readout="HANDOVER">
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx="100"
            cy="75"
            r="14"
            fill="none"
            stroke={HOT}
            strokeWidth="1.3"
            initial={{ scale: 0.5, opacity: 0.85 }}
            animate={{ scale: 4.1, opacity: 0 }}
            transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "100px 75px" }}
          />
        ))}
        <circle cx="100" cy="75" r="11" fill={HOT} fillOpacity="0.9" />
        <circle cx="100" cy="75" r="17" fill="none" stroke={STROKE} strokeOpacity="0.45" />
      </svg>
    </Frame>
  );
}

/** 05 — Evolve: the curve that keeps bending upward. */
function Evolve() {
  return (
    <Frame label="GROWTH CURVE" readout="COMPOUNDING">
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
        <line x1="18" y1="126" x2="184" y2="126" stroke={STROKE} strokeOpacity="0.3" />
        <line x1="18" y1="126" x2="18" y2="22" stroke={STROKE} strokeOpacity="0.3" />
        <motion.path
          d="M18 122 C 60 120, 86 104, 108 78 S 150 34, 182 26"
          fill="none"
          stroke={HOT}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M18 122 C 60 120, 86 104, 108 78 S 150 34, 182 26 L 182 126 L 18 126 Z"
          fill={HOT}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.12, 0.12, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}
        />
        {/* Moved by transform, not by cx/cy: animating an SVG length as a
            keyframe array makes framer write "undefined" between repeats,
            which the browser rejects and logs on every cycle. */}
        <motion.g
          animate={{ x: [18, 108, 182], y: [122, 78, 26] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
        >
          <circle cx={0} cy={0} r="3.6" fill={HOT} />
        </motion.g>
      </svg>
    </Frame>
  );
}

const VISUALS = [Explore, Enlighten, Execute2, Empower, Evolve];

export default function PhaseVisual({ index }: { index: number }) {
  const V = VISUALS[index] ?? Explore;
  return <V />;
}
