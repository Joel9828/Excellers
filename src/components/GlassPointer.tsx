"use client";

import { useEffect } from "react";

/**
 * Feeds the pointer position to every `.glass-track` element as --mx/--my,
 * so the specular bloom on a glass surface follows the cursor.
 *
 * One delegated listener rather than a handler per card, and the write is
 * deferred to rAF so a fast sweep across a grid cannot cause a style write
 * per pointer event. Purely decorative: the CSS has a centred fallback, so
 * if this never mounts the glass still looks right.
 */
export default function GlassPointer() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      pending = null;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        ".glass-track",
      ) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pending = {
        el,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
