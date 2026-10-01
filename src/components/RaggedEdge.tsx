"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";

/**
 * The torn boundary between a dark and a light section, driven by scroll.
 *
 * The strip belongs to the *destination* section and hangs above its top edge,
 * filled with that section's own colour. As the boundary crosses the viewport
 * the fill rises through the strip and the turbulence churns, so the tear
 * sweeps open as you scroll rather than sliding past as a rigid shape.
 *
 * Because it travels with the section it introduces, it costs no extra scroll,
 * and `overflow-hidden` guarantees the fill can never escape the strip and
 * paint over the section above.
 *
 * No z-index on purpose: the strip belongs to a later section than the one it
 * covers, so DOM order already paints it on top, and staying in normal flow
 * lets the section's own texture layer run up over the fill — otherwise the
 * texture starts abruptly at the section edge and shows as a hard seam.
 *
 * Both animated values are written straight to their SVG attributes from a
 * motion value: framer is unreliable writing SVG lengths through `animate`
 * (it emits `undefined` between keyframes), and a filter primitive's `scale`
 * is not a style at all.
 */
export default function RaggedEdge({
  color,
  gradient,
  seed = 3,
  height = 380,
  className = "",
}: {
  /** Flat fill — should match the background of the section below. */
  color?: string;
  /** Three stops, when the section below is a gradient plane rather than flat. */
  gradient?: [string, string, string];
  seed?: number;
  height?: number;
  className?: string;
}) {
  const id = `ragged-${seed}`;
  const gradId = `ragged-grad-${seed}`;
  const strip = useRef<HTMLDivElement>(null);
  const rect = useRef<SVGRectElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);

  const { scrollYProgress } = useScroll({
    target: strip,
    offset: ["start end", "end start"],
  });

  // the fill climbs through the strip as the boundary crosses the screen
  const fillY = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    [height * 0.74, height * 0.12],
  );
  // ...and the tear churns hardest while it is actually on screen
  const churn = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [62, 138, 62]);

  useMotionValueEvent(fillY, "change", (v) => {
    rect.current?.setAttribute("y", String(v));
  });
  useMotionValueEvent(churn, "change", (v) => {
    disp.current?.setAttribute("scale", String(v));
  });

  // static, readable fallback when motion is not wanted
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    rect.current?.setAttribute("y", String(height * 0.42));
    disp.current?.setAttribute("scale", "100");
  }, [height]);

  return (
    <div
      ref={strip}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className}`}
      style={{ top: -height, height }}
    >
      <svg className="h-full w-full">
        <defs>
          {gradient && (
            // matches .brand-plane's 152deg direction closely enough that the
            // tear reads as the same surface, not a patch laid over it
            <linearGradient id={gradId} x1="0" y1="0" x2="0.55" y2="1">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="46%" stopColor={gradient[1]} />
              <stop offset="100%" stopColor={gradient[2]} />
            </linearGradient>
          )}
          <filter id={id} x="-25%" y="-60%" width="150%" height="220%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0075 0.016"
              numOctaves="4"
              seed={seed}
              result="noise"
            />
            <feDisplacementMap
              ref={disp}
              in="SourceGraphic"
              in2="noise"
              scale="62"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <rect
          ref={rect}
          x="-12%"
          y={height * 0.74}
          width="124%"
          height="300%"
          fill={gradient ? `url(#${gradId})` : color}
          filter={`url(#${id})`}
        />
      </svg>
    </div>
  );
}
