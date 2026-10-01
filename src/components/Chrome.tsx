"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import useScrolledPast from "@/lib/useScrolledPast";

/** Right-hand scroll readout: a hairline track plus a live percentage. */
export function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const height = useTransform(smooth, (v) => `${Math.max(4, v * 100)}%`);
  const [pct, setPct] = useState(0);

  const revealed = useScrolledPast(0.55);

  useEffect(() => smooth.on("change", (v) => setPct(Math.round(v * 100))), [smooth]);

  return (
    <div
      className="pointer-events-none fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 items-center gap-2 transition-opacity duration-500 sm:flex"
      style={{ opacity: revealed ? 1 : 0 }}
    >
      <div className="relative h-16 w-px rounded-full bg-mist/80 backdrop-blur-sm">
        <motion.div style={{ height }} className="absolute inset-x-0 top-0 grad-bg" />
      </div>
      <span className="text-[10px] font-medium tabular-nums tracking-[0.12em] text-slate">
        {String(pct).padStart(3, "0")}%
      </span>
    </div>
  );
}

/** Fixed brand mark in the top-right corner — spins gently on hover. */
export function SparkButton() {
  const revealed = useScrolledPast(0.55);
  return (
    <a
      href="#contact"
      aria-label="Contact Excellers"
      tabIndex={revealed ? 0 : -1}
      className={`glass group fixed right-4 top-24 z-[80] hidden h-11 w-11 items-center justify-center rounded-xl transition duration-500 hover:scale-105 sm:flex ${
        revealed ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className="relative z-10 text-marian transition-transform duration-700 group-hover:rotate-180"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="11.1"
            y="2"
            width="1.8"
            height="8"
            rx="0.9"
            fill="currentColor"
            transform={`rotate(${i * 45} 12 12)`}
          />
        ))}
      </svg>
    </a>
  );
}

/** Language switcher stub, mirroring the flag button in the recording. */
export function LangFlag() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const revealed = useScrolledPast(0.55);
  const langs = [
    { code: "EN", label: "English (US)" },
    { code: "ES", label: "Español (MX)" },
  ];

  return (
    <div
      className={`fixed left-4 top-1/2 z-[80] hidden -translate-y-1/2 transition-opacity duration-500 sm:block ${
        revealed ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Change language"
        className="glass flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold tracking-[0.1em] text-marian transition hover:scale-105"
      >
        {lang}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="glass absolute left-11 top-0 w-[130px] overflow-hidden rounded-xl p-1"
          >
            {langs.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className="relative z-10 w-full rounded-lg px-2.5 py-2 text-left text-[12px] text-slate transition hover:bg-white/70 hover:text-ink"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Cookie consent — remembers the choice in localStorage. */
export function CookieBanner() {
  const [show, setShow] = useState(false);
  // don't interrupt the opening curtain with a consent dialog
  const revealed = useScrolledPast(0.55);

  useEffect(() => {
    if (!revealed) return;
    try {
      if (!localStorage.getItem("ex-consent")) {
        const t = setTimeout(() => setShow(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      /* private mode — just don't nag */
    }
  }, [revealed]);

  const decide = (v: "accept" | "reject") => {
    try {
      localStorage.setItem("ex-consent", v);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 26 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Cookie preferences"
          className="glass fixed inset-x-3 bottom-4 z-[95] mx-auto flex max-w-[960px] flex-col items-start gap-3 overflow-hidden rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:gap-6"
        >
          <p className="relative z-10 flex-1 text-[13px] leading-relaxed text-slate">
            Without data, we&apos;re guessing. With analytics and marketing cookies we
            know what helps you and what doesn&apos;t. You can change your mind anytime.{" "}
            <a href="#contact" className="font-semibold text-marian underline underline-offset-2">
              Privacy policy
            </a>
          </p>
          <div className="relative z-10 flex shrink-0 items-center gap-3">
            <button
              onClick={() => decide("reject")}
              className="text-[13px] font-medium text-slate transition hover:text-ink"
            >
              Reject
            </button>
            <button
              onClick={() => decide("accept")}
              className="brand-pill rounded-[4px] px-7 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-125"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
