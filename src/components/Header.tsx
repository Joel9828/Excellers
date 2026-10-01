"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { capabilities, hero, nav } from "@/lib/content";
import useScrolledPast from "@/lib/useScrolledPast";

/**
 * Floating pill nav. The IA is the master layout's: Capabilities, E-Principle,
 * Engagements, Questions, then one primary action. Capabilities keeps the
 * drop-down because it is the one item with eight children.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealed = useScrolledPast(0.55);

  /* the pill runs solid Marian on the white page, and inverts to white
     while the Marian E-Principle block is behind it */
  useEffect(() => {
    const zones = () => Array.from(document.querySelectorAll("[data-theme='brand']"));
    const check = () => {
      const probe = 56;
      setLight(
        zones().some((z) => {
          const r = z.getBoundingClientRect();
          return r.top <= probe && r.bottom >= probe;
        }),
      );
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hover = (v: boolean) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(v);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <motion.header
      initial={false}
      animate={{
        opacity: revealed ? 1 : 0,
        y: revealed ? 0 : -28,
        pointerEvents: revealed ? "auto" : "none",
      }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-3 z-[90] px-3 sm:top-5 sm:px-6"
      onMouseLeave={leave}
      // `inert` (not aria-hidden) so the hidden nav also leaves the tab order
      inert={!revealed}
    >
      <div className="relative mx-auto w-full max-w-[1200px]">
        <div
          className={`relative z-10 flex items-center gap-3 overflow-hidden rounded-[28px] px-4 py-2.5 transition-colors duration-500 sm:rounded-full sm:px-5 ${
            light ? "glass text-ink" : "brand-pill-glass text-white"
          }`}
          onMouseEnter={(e) => e.currentTarget.classList.add("pill-lit")}
          onMouseLeave={(e) => e.currentTarget.classList.remove("pill-lit")}
        >
          {/* a specular highlight rakes across the whole pill on hover */}
          <span className="sheen" aria-hidden="true" />

          {/* logo */}
          <a
            href="#top"
            className="nav-lock group relative z-10 flex shrink-0 items-center"
            aria-label="Excellers — home"
          >
            <span className="font-[family-name:var(--font-display)] text-[17px] font-bold tracking-[0.02em]">
              EX
              {/* the horse flies into this slot and dissolves into the C —
                  the landing lockup, replayed on every hover */}
              <span className="nav-c relative inline-block">
                C
                <span
                  className="nav-horse-glow absolute left-1/2 top-1/2 h-[2em] w-[2em] -translate-x-1/2 -translate-y-1/2
                             rounded-full bg-[radial-gradient(circle,rgba(0,180,217,0.55),transparent_68%)] blur-md"
                  aria-hidden="true"
                />
                <span
                  // 1.3em tall against a ~0.7em cap height: the same slight
                  // overhang the horse has in wordmark.png, so the landing
                  // reads as the real lockup. (Art aspect is 0.766 w/h.)
                  className="nav-horse absolute left-1/2 top-1/2 h-[1.3em] w-[1em] -translate-x-1/2 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <Image
                    src={light ? "/brand/symbol.png" : "/brand/symbol-white.png"}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </span>
              </span>
              EL<span className={light ? "text-honolulu" : "text-sky"}>LERS</span>
            </span>
          </a>

          {/* desktop nav */}
          <nav className="relative z-10 mx-auto hidden items-center gap-1 lg:flex" aria-label="Primary">
            <button
              onMouseEnter={() => hover(true)}
              onFocus={() => hover(true)}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={`nav-chip relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[15px] font-medium transition ${
                open ? "nav-chip-on opacity-100" : "opacity-80 hover:opacity-100"
              }`}
            >
              Capabilities
              <svg
                width="8"
                height="5"
                viewBox="0 0 7 5"
                className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path d="M0 0h7L3.5 5z" fill="currentColor" />
              </svg>
            </button>

            {nav.slice(1).map((it) => (
              <a
                key={it.label}
                href={it.href}
                onMouseEnter={() => hover(false)}
                className="nav-chip relative rounded-full px-3.5 py-2 text-[15px] font-medium opacity-80 transition hover:opacity-100"
              >
                {it.label}
              </a>
            ))}
          </nav>

          {/* right cluster */}
          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <a
              href="#contact"
              className="signal-btn glass-hover relative hidden overflow-hidden rounded-[6px] px-[18px] py-[11px] text-[15px] font-semibold text-void shadow-[0_10px_26px_-12px_rgba(0,180,217,0.9)] transition hover:brightness-110 sm:inline-flex"
            >
              <span className="sheen" aria-hidden="true" />
              <span className="relative z-10">{hero.primary}</span>
            </a>

            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-current/60 bg-current/10 backdrop-blur-md lg:hidden"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              onClick={() => setMobile((v) => !v)}
            >
              <span className="flex flex-col gap-[5px]">
                <i className={`block h-px w-4 bg-current transition ${mobile ? "translate-y-[3px] rotate-45" : ""}`} />
                <i className={`block h-px w-4 bg-current transition ${mobile ? "-translate-y-[3px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>

        {/* ── capabilities panel ───────────────────────────────── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.995 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => hover(true)}
              className="glass absolute inset-x-0 top-[calc(100%+10px)] hidden overflow-hidden rounded-[22px] p-7 text-ink lg:block"
            >
              <div className="relative z-10 mb-5 flex items-center justify-between">
                <span className="eyebrow">Capabilities</span>
                <a
                  href="#capabilities"
                  className="text-[13px] font-semibold text-honolulu underline decoration-1 underline-offset-4 transition hover:text-marian"
                >
                  All eight
                </a>
              </div>
              <div className="relative z-10 grid grid-cols-4 gap-x-5 gap-y-1">
                {capabilities.map((c, i) => (
                  <motion.a
                    key={c.name}
                    href="#capabilities"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.03 + i * 0.025 }}
                    className="group relative overflow-hidden rounded-xl border border-transparent p-3 transition duration-300 hover:border-white/70 hover:bg-white/55 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_28px_-16px_rgba(1,62,138,0.5)] hover:backdrop-blur-md"
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="text-[11px] font-semibold tabular-nums text-honolulu">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] font-semibold leading-snug text-ink">
                        {c.name}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-slate">
                      {c.desc}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── mobile sheet ─────────────────────────────────────── */}
        <AnimatePresence>
          {mobile && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass relative mt-2 overflow-hidden rounded-3xl p-5 text-ink lg:hidden"
            >
              <nav className="relative z-10 flex flex-col gap-1">
                {nav.map((it) => (
                  <a
                    key={it.label}
                    href={it.href}
                    onClick={() => setMobile(false)}
                    className="rounded-xl px-3 py-3 text-[15px] text-slate transition hover:bg-paper hover:text-ink"
                  >
                    {it.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobile(false)}
                  className="signal-btn mt-2 rounded-[4px] px-4 py-3 text-center text-[15px] font-semibold text-void"
                >
                  {hero.primary}
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
