"use client";

import { useEffect, useState } from "react";

/**
 * True once the reader has scrolled past `fraction` of the viewport height.
 * Used to hold the site chrome back until the intro curtain has been passed.
 */
export default function useScrolledPast(fraction = 0.6) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const check = () => setPast(window.scrollY > window.innerHeight * fraction);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [fraction]);

  return past;
}
