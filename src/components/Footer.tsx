"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { brand, closing, footer } from "@/lib/content";
import useRevealed from "@/lib/useRevealed";

/**
 * Closing CTA and footer. The CTA runs on a brand gradient plane — the second
 * and last place brand colour is spent at full strength — and the footer
 * itself sits on paper, organised by capability, company and region.
 */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const shown = useRevealed(ref, { rootMargin: "0px 0px -10% 0px" });
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "bad" | "sent">("idle");

  // Validation only — there is no endpoint yet, so the success copy promises a
  // reply rather than claiming the message was transmitted.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(/^\S+@\S+\.\S+$/.test(email) ? "sent" : "bad");
  };

  return (
    <footer id="contact" className="relative" ref={ref}>
      {/* ── closing CTA, on brand ───────────────────────────────── */}
      <div className="on-brand brand-plane-soft relative overflow-hidden text-white">
        <div
          className="dot-field-on-brand pointer-events-none absolute inset-0 opacity-50"
          aria-hidden="true"
        />
        {/* the Manifest Line */}
        <div className="relative h-[2px] overflow-hidden bg-white/20" aria-hidden="true">
          <span className="manifest-line absolute inset-y-0 w-[32%]" />
        </div>

        <div className="shell relative pb-24 pt-24">
          <div className="glass-on-brand relative mx-auto grid max-w-[880px] justify-items-center gap-9 overflow-hidden rounded-[26px] px-8 py-14 text-center sm:px-14">
          <div className="relative z-10 grid justify-items-center gap-5">
            <motion.h2
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[18ch] font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-bold leading-[1.08] tracking-[-0.012em]"
            >
              {closing.title}
            </motion.h2>
            <motion.p
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-[52ch] text-[1.125rem] leading-[1.65] text-white/80"
            >
              {closing.lede}
            </motion.p>
          </div>

          <motion.form
            initial={false}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            onSubmit={submit}
            noValidate
            className="relative z-10 grid w-full max-w-[560px] justify-items-center gap-3"
          >
            <label htmlFor="work-email" className="text-[0.9375rem] font-semibold text-white/85">
              {closing.label}
            </label>

            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <input
                id="work-email"
                type="email"
                autoComplete="email"
                placeholder={closing.placeholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state !== "idle") setState("idle");
                }}
                aria-invalid={state === "bad"}
                aria-describedby="email-msg"
                className={`h-[52px] w-full rounded-[6px] border bg-white/95 px-4 text-[1rem] text-ink outline-none transition placeholder:text-slate/70 sm:max-w-[320px] ${
                  state === "bad" ? "border-2 border-[#ff8d85]" : "border-white/30 focus:border-sky"
                }`}
              />
              <button
                type="submit"
                className="signal-btn glass-hover relative h-[52px] overflow-hidden rounded-[6px] px-7 text-base font-semibold text-void shadow-[0_14px_34px_-14px_rgba(0,180,217,0.95)] transition hover:brightness-110"
              >
                <span className="sheen" aria-hidden="true" />
                <span className="relative z-10">{closing.cta}</span>
              </button>
            </div>

            <p
              id="email-msg"
              role={state === "bad" ? "alert" : undefined}
              className={`text-[0.875rem] ${state === "bad" ? "font-medium text-[#ffb4ae]" : "text-white/65"}`}
            >
              {state === "bad" ? closing.invalid : state === "sent" ? closing.sent : closing.help}
            </p>
          </motion.form>
          </div>
        </div>
      </div>

      {/* ── footer proper, on paper ─────────────────────────────── */}
      <div className="relative bg-paper text-ink">
        <div className="shell grid gap-12 pb-10 pt-16 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <Image
              src="/brand/wordmark.png"
              alt="Excellers"
              width={196}
              height={39}
              className="mb-5 h-7 w-auto"
            />
            <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-slate">
              {brand.blurb}
            </p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-5 inline-block text-[0.9375rem] font-semibold text-honolulu underline decoration-1 underline-offset-[5px] transition hover:text-marian"
            >
              {brand.email}
            </a>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <a
                        href={l.href}
                        className="text-[0.9375rem] text-slate transition hover:text-marian"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <span className="text-[0.9375rem] text-slate/80">
                        {l.label}
                        {col.title === "Company" && (
                          <em className="ml-2 not-italic text-[0.75rem] uppercase tracking-[0.1em] text-slate/60">
                            Coming soon
                          </em>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-mist py-7 text-[0.875rem] text-slate">
          <span>
            <a
              href="https://www.excellers.co"
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:text-marian"
            >
              {brand.domain}
            </a>
          </span>
          <span>{footer.legal}</span>
          <span className="font-semibold text-marian">
            {brand.slogan}
            <sup className="ml-[0.1em] text-[0.7em]">&trade;</sup>
          </span>
        </div>
      </div>
    </footer>
  );
}
