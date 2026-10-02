"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { capabilities } from "@/lib/content";

/**
 * The capability ticker. The master layout runs the eight pillars as a slow
 * straight marquee in Signal on Void; here it keeps this site's curved
 * treatment, set on a very large circle and rotating with scroll.
 */
export default function ArcMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // scroll-linked rotation is still motion the reader did not ask for
  const still = useReducedMotion();
  const rotate = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [22, -22]);

  const R = 900;
  const text = capabilities.map((c) => c.name).join("   ◆   ") + "   ◆   ";

  return (
    <div ref={ref} className="relative h-[34svh] overflow-hidden sm:h-[42svh]">
      <motion.svg
        style={{ rotate }}
        viewBox="0 0 2000 2000"
        className="absolute left-1/2 top-0 h-[2000px] w-[2000px] -translate-x-1/2"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#013e8a" stopOpacity="0.10" />
            <stop offset="50%" stopColor="#0076b5" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#013e8a" stopOpacity="0.10" />
          </linearGradient>
          <path id="arc" d={`M ${1000 - R},1000 a ${R},${R} 0 1,1 ${R * 2},0`} fill="none" />
        </defs>
        <text
          className="font-[family-name:var(--font-body)]"
          fontSize="40"
          fontWeight="500"
          letterSpacing="2"
          fill="url(#arc-grad)"
        >
          <textPath href="#arc" startOffset="0%">
            {text.repeat(3)}
          </textPath>
        </text>
      </motion.svg>

      <p className="sr-only">
        Capabilities: {capabilities.map((c) => c.name).join(", ")}.
      </p>
    </div>
  );
}
