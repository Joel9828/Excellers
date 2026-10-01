import SmoothScroll from "@/components/SmoothScroll";
import GlassPointer from "@/components/GlassPointer";
import Intro from "@/components/Intro";
import BrandBackdrop from "@/components/BrandBackdrop";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import Manifesto from "@/components/Manifesto";
import Method from "@/components/Method";
import Engagements from "@/components/Engagements";
import Faq from "@/components/Faq";
import ArcMarquee from "@/components/ArcMarquee";
import Footer from "@/components/Footer";
import { CookieBanner, LangFlag, ScrollRail, SparkButton } from "@/components/Chrome";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <GlassPointer />
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Header />
      <ScrollRail />
      <SparkButton />
      <LangFlag />

      {/* the opening curtain — the site slides up over it */}
      <Intro />

      {/* `bg-white` here (rather than per-section) lets the brand watermark sit
          behind every section at once */}
      <main id="main" className="relative z-10 bg-white">
        {/* Sticky, not fixed: a fixed child would escape <main> and paint over
            the intro curtain. The absolute + overflow-hidden wrapper gives the
            sticky layer exact bounds so it cannot spill past <main>. */}
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="sticky top-0 h-[100svh]">
            <BrandBackdrop className="absolute inset-0" />
          </div>
        </div>

        <Hero />
        <Capabilities />
        <Manifesto />

        {/* the E-Principle and Engagements each carry their own torn top edge,
            so the hand-offs into and out of the Marian block cost no scroll */}
        <Method />
        <Engagements />

        <Faq />
        <ArcMarquee />
        <Footer />
      </main>

      <CookieBanner />
    </>
  );
}
