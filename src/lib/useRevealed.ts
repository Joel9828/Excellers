"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * "Has this element been reached yet?" — the safe replacement for
 * `whileInView` + `once: true`.
 *
 * A plain in-view trigger can miss entirely: during a fast or smooth-scrolled
 * jump the IntersectionObserver may never report the element as intersecting,
 * and anything animating up from `opacity: 0` then stays invisible for good.
 * That is how the framework intro ended up as a blank white screen.
 *
 * So this settles on true if *any* of these happen:
 *  - the element intersects the viewport, or
 *  - an observer callback finds it already above the viewport (scrolled past), or
 *  - a failsafe timer fires.
 *
 * It only ever flips false → true, so content never disappears again.
 */
export default function useRevealed(
  ref: RefObject<Element | null>,
  { rootMargin = "0px 0px -8% 0px", failsafeMs = 2500 } = {},
) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setRevealed(true);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        // `bottom < 0` means we are already past it — reveal rather than
        // wait for an "entering" callback that is never coming.
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) show();
        if (done) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);

    const t = setTimeout(show, failsafeMs);

    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [ref, rootMargin, failsafeMs]);

  return revealed;
}
