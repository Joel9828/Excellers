"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis drives the page scroll and GSAP's ScrollTrigger reads from it, so the
 * pinned horizontal section stays in sync with the eased scroll position.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // `lerp` rather than `duration`: duration mode eases toward the target over
    // a fixed time, which reads as lag on a fast flick. lerp interpolates per
    // frame, so input lands instantly and the page keeps gliding after the
    // wheel stops — low friction, long slide. The multipliers cover more
    // distance per notch so it is slippery *and* quick.
    // (Lenis ignores `lerp` whenever `duration` is set, so `duration` is gone.)
    // `wheelMultiplier` is the speed dial: it scales how far one notch sends
    // the target, and with a fixed `lerp` the peak velocity scales with it —
    // so 1.6 → 4.8 is a true 3x. `lerp` stays put to keep the glide.
    //
    // Touch is deliberately NOT tripled. A wheel notch is an abstract tick, but
    // a drag is the page tracking a finger; multiply that by three and the
    // content shoots out from under the touch.
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 9.6,
      touchMultiplier: 4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // anchor links go through Lenis so they ease instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -100 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
