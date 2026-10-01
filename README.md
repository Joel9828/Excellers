# EXCELLERS — website

Next.js 16 · React 19 · Tailwind v4 · Framer Motion · GSAP ScrollTrigger · Lenis · three.js

A rebuild of the UI, motion design and scroll choreography from the reference
recording, rebranded to Excellers. Palette, typography and voice come from
`../EXCELLERS - Brandguide.pdf`.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Brand tokens

Defined once in `src/app/globals.css` under `@theme`:

| Token | Value | Role |
| --- | --- | --- |
| `--color-marian` | `#013E8A` | Marian Blue — main corporate colour |
| `--color-honolulu` | `#0076B5` | Honolulu Blue |
| `--color-signal` | `#00B4D9` | Pacific Cyan — the one accent |
| `--color-sky` | `#7FD7FF` | accent on dark grounds |
| `--color-slate` | `#54595F` | secondary text |
| `--color-mist` | `#D3D9E5` | lines and dividers |
| `--color-void` | `#060912` | page dark |
| `--color-deep` | `#04234F` | deep blue ground |
| `--color-paper` | `#F4F6FA` | page light |
| `--color-ink` | `#11131A` | text on light |

Type: **Source Serif 4** carries the display role (Constantia is the brand's
primary corporate face but is not web-licensed, so it stays first in the CSS
stack for anyone who has it locally); **Inter** is the body face.

Source of truth for content, type and colour is
`../EXCELLERS - Master Layout (Figma view).html`. Where that and the brand PDF
disagreed, the PDF won for colour, type and logo.

## Sections & motion

| Component | What it does |
| --- | --- |
| `Intro` | The opening curtain: pinned first screen, scroll to reveal the site. Plays `introVideo` when configured, otherwise `EvolutionScene`. Entrances are CSS (not JS) so the first paint can never come up blank |
| `EvolutionScene` | Generated "evolution mindset" backdrop — a particle field that re-forms itself: scatter → cell → double helix → lattice → network, looping |
| `BrandBackdrop` | The trademark as a full-screen watermark with a blue neon halo, behind every section. Mounted as a zero-height **sticky** rail inside `<main>`; a `fixed` child would escape `<main>` and paint over the intro |
| `SmoothScroll` | Lenis scrolling, wired into ScrollTrigger and anchor links. Runs in `lerp` mode (not `duration`) so input lands with no lag and the page keeps gliding after the wheel stops |
| `Header` | Floating pill nav, four hover mega-menus, inverts over light sections |
| `Hero` / `Globe` | Per-word headline rise; three.js point-cloud globe you can **grab and spin** (drag with inertia, click to fire a ripple). Lit navy body with a fresnel limb, evolution ripple waves, city beacons, orbit rings with satellites and travelling arc pulses |
| `Capabilities` | The eight capabilities as one monochrome grid, numbered because they are a fixed set; Signal appears only as the hover line |
| `Manifesto` | The We Manifest™ philosophy, standing where a testimonial would go |
| `Engagements` | Three scope-based tiers with no figures, and the shared baseline strip. Owns the `RaggedEdge` back to white — it is the section that follows the Marian E-Principle block |
| `Faq` | Regions, confidentiality, entry point, pricing, industries |
| `RaggedEdge` | The torn dark ⇄ light boundary (`feTurbulence` + `feDisplacementMap`), **driven by scroll**: as the boundary crosses the viewport the fill climbs through the strip and the turbulence churns, so the tear sweeps open. It belongs to the destination section and hangs above its top edge, so it costs no extra scroll. The section before one needs ~380px of bottom clearance — see `Manifesto` |
| `Method` / `PhaseVisual` | The **E-Principle**: compact intro on paper, then a GSAP-pinned horizontal rail of the five stages (Explore, Enlighten, Execute, Empower, Evolve). Each panel pairs the stage meaning and the question it answers with a live HUD diagram, over a drifting tech grid, with a stepper and scrub progress bar |
| `ArcMarquee` | The eight capability pillars as a ticker, set on a large circle and rotating with scroll |
| `Footer` | The Manifest Line, closing CTA, and a footer organised by capability, company and region |
| `Chrome` | Scroll rail, language switcher, spark button, cookie consent |

`prefers-reduced-motion` disables Lenis, the pin, the globe spin and the
particle drift; the horizontal rail falls back to stacked panels below 1024px.

## The intro film

The opening screen uses a generated WebGL scene by default. To use your own
footage instead:

1. Put the file in `public/media/` (e.g. `intro.mp4`).
2. Set `introVideo` in `src/lib/content.ts` to `"/media/intro.mp4"`.

See `public/media/README.md` for the recommended format. (A placeholder
`evolution.mp4` generated during an earlier pass was removed: it was 3.3 MB of
cyan noise and read worse than the WebGL scene.)

## Deploying to Hostinger (or any Apache/LiteSpeed host)

Hostinger's shared plans serve files, not Node — so the site ships as a
static export rather than a running Next server.

```bash
npm run export
```

That produces `out/` (~2.6 MB) and does four things the browser would
otherwise fail at silently:

1. builds with `EXPORT_STATIC=1`, which turns on `output: "export"`,
   `images.unoptimized` (no server means no on-the-fly image optimisation)
   and `assetPrefix: "./"`;
2. rewrites absolute `/brand/` and `/media/` paths to relative, so the
   upload works at a domain root *or* in a sub-folder;
3. copies `deploy/hostinger/.htaccess` into `out/`, refusing to continue
   if it has picked up a BOM — a byte-order mark there makes Apache 500
   the entire site;
4. re-parses all JS chunks and checks `out/` has `index.html`, `404.html`,
   `.htaccess` and `_next/`.

Then upload **the contents of `out/`** into `public_html` — including the
dotfile `.htaccess`, which most FTP clients hide by default.

The `.htaccess` forces HTTPS (via `X-Forwarded-Proto`, since Hostinger
terminates TLS at the proxy), maps pretty URLs onto the flat `.html` files
the export emits, sets the 404 page, adds MIME types for `woff2`/`avif`/
`webp`/`mp4`, enables compression, and splits caching three ways:
`_next/static/` is content-hashed so it is immutable for a year, HTML is
never cached, and `public/` assets get 30 days.

Nothing on the host needs Node, npm or a build step.

## Before launch — placeholders to replace

These are stubs, not real data:

- `src/lib/content.ts` → `brand.email`, `brand.whatsapp`, `brand.whatsappHref`
- Social links in the footer and all mega-menu links point at `#contact`
- No client logos, testimonials, case studies or figures appear anywhere — the
  master layout is explicit that none exist yet. Nothing on the page implies
  otherwise; add a case-study section once there is an approved one.
- The Careers system claim needs backend or ATS integration before it ships.

## Assets

`public/brand/` is extracted from the brand guide PDF:
`symbol.png`, `symbol-white.png`, `wordmark.png`, `wordmark-white.png`.
