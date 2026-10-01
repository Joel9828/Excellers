"use client";

import { useEffect, useRef } from "react";

/**
 * Drifting dot cloud used behind the big statements. Particles orbit inside a
 * soft ellipse and scatter away from the pointer, which is what gives the
 * reference its "text sitting inside a cloud of dust" look.
 */
export default function ParticleCloud({
  className = "",
  count = 620,
  color = "1,62,138",
}: {
  className?: string;
  count?: number;
  color?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    type P = {
      a: number; // angle around the ellipse
      r: number; // normalised radius
      sp: number; // angular speed
      sz: number;
      al: number;
      ox: number;
      oy: number; // pointer displacement, eased back to 0
    };
    let parts: P[] = [];

    const seed = () => {
      parts = Array.from({ length: count }, () => ({
        a: Math.random() * Math.PI * 2,
        r: Math.pow(Math.random(), 0.62),
        sp: (Math.random() * 0.4 + 0.12) * (Math.random() < 0.5 ? -1 : 1),
        sz: Math.random() * 1.5 + 0.4,
        al: Math.random() * 0.55 + 0.18,
        ox: 0,
        oy: 0,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    seed();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mx = -9999;
    let my = -9999;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(canvas);

    let raf = 0;
    let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;

      t += reduce ? 0 : 0.0045;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rx = w * 0.42;
      const ry = h * 0.42;

      for (const p of parts) {
        const ang = p.a + t * p.sp * 6;
        // squash toward the middle band so the cloud reads as an ellipse
        const px = cx + Math.cos(ang) * rx * p.r;
        const py = cy + Math.sin(ang) * ry * p.r * (0.7 + 0.3 * Math.sin(ang * 2));

        // push away from the cursor
        const dx = px - mx;
        const dy = py - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 15000) {
          const f = (1 - d2 / 15000) * 26;
          const d = Math.sqrt(d2) || 1;
          p.ox += (dx / d) * f * 0.12;
          p.oy += (dy / d) * f * 0.12;
        }
        p.ox *= 0.92;
        p.oy *= 0.92;

        ctx.globalAlpha = p.al;
        ctx.fillStyle = `rgb(${color})`;
        ctx.fillRect(px + p.ox, py + p.oy, p.sz, p.sz);
      }
      ctx.globalAlpha = 1;
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [count, color]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
