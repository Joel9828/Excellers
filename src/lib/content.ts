/**
 * All site copy in one place.
 *
 * Source of truth: "EXCELLERS - Master Layout (Figma view).html", which
 * reconciles the brand guide with the master prompt. Positioning is a
 * business transformation consultancy; the method is the E-Principle
 * (Explore · Enlighten · Execute · Empower · Evolve).
 *
 * Nothing here invents figures, clients or testimonials — the layout is
 * explicit that none exist yet.
 */

/**
 * Opening-screen film. Leave as `null` to use the generated WebGL evolution
 * scene. To use footage instead, drop the file in `public/media/` and set this
 * to its path, e.g. "/media/intro.mp4".
 */
export const introVideo: string | null = null;

export const brand = {
  name: "EXCELLERS",
  slogan: "We Manifest",
  domain: "www.excellers.co",
  email: "hello@excellers.co",
  whatsapp: "+1 000 000 0000",
  whatsappHref: "https://wa.me/10000000000",
  blurb:
    "A business transformation consultancy working from Islamabad, Maryland and London.",
};

export const regions = ["Islamabad", "Maryland", "London"];

export const nav = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "E-Principle", href: "#principle" },
  { label: "Engagements", href: "#engagements" },
  { label: "Questions", href: "#questions" },
];

/* ── hero ─────────────────────────────────────────────────────── */
export const hero = {
  headline: "Business transformation, from the first question to lasting change.",
  lede: "EXCELLERS is a business transformation consultancy working across strategy, operations, people, technology and AI. We start with the outcome you need and work through to delivery.",
  primary: "Start a conversation",
  secondary: "See the E-Principle",
};

/* ── eight capabilities ───────────────────────────────────────── */
export const capabilities = [
  {
    name: "Business & Strategy",
    desc: "Direction, portfolio and operating-model choices.",
  },
  {
    name: "Customer Experience",
    desc: "Journeys, service design and the moments that shape loyalty.",
  },
  {
    name: "Operations",
    desc: "Process, performance and the mechanics of delivery.",
  },
  {
    name: "People",
    desc: "Organisation, capability and leadership through change.",
  },
  {
    name: "Technology",
    desc: "Architecture, platforms and delivery engineering.",
  },
  {
    name: "Digital Growth",
    desc: "Acquisition, conversion and measurable growth online.",
  },
  {
    name: "Industry Solutions",
    desc: "Capabilities adapted to the realities of a sector.",
  },
  {
    name: "AI & Automation",
    desc: "Applied intelligence and automation where it removes real work.",
  },
];

export const capabilitiesIntro = {
  eyebrow: "Capabilities",
  title: "Eight capabilities for the whole business",
  lede: "Start where the need is sharpest. Each capability connects to the others through the same five-stage method.",
};

/* ── the E-Principle ──────────────────────────────────────────── */
export const principle = {
  eyebrow: "The framework",
  title: "One sequence for every engagement",
  lede: "The E-Principle is the shared structure for how work is scoped, delivered and handed over.",
  demoTitle: "Step through the E-Principle",
  demoLede:
    "Five stages, each answering a different question about your change. Select a stage or use the arrow keys.",
  questionLabel: "The question this stage answers",
  footnote: "stages, in a fixed order",
  footnoteDetail: "Explore, Enlighten, Execute, Empower, Evolve.",
  stages: [
    {
      n: "01",
      name: "Explore",
      meaning:
        "Curiosity drives innovation. We venture into uncharted territory, push boundaries and discover new possibilities.",
      question: "What is possible, and what is actually going on?",
    },
    {
      n: "02",
      name: "Enlighten",
      meaning:
        "We illuminate complex challenges, guiding informed decisions for meaningful progress.",
      question: "What does the evidence say, and what should we decide?",
    },
    {
      n: "03",
      name: "Execute",
      meaning:
        "Action speaks louder than words. We turn ideas into reality with precision and determination.",
      question: "How do we deliver this without losing the intent?",
    },
    {
      n: "04",
      name: "Empower",
      meaning:
        "We cultivate success through support, encouragement and trust, fostering thriving communities.",
      question: "Who carries this forward when we step back?",
    },
    {
      n: "05",
      name: "Evolve",
      meaning:
        "We embrace change for continuous growth, staying ahead through constant innovation.",
      question: "What has to change next as conditions change?",
    },
  ],
};

export const benefits = [
  {
    title: "Progress you can see",
    body: "Each stage has a defined purpose, so your team always knows where the work stands.",
  },
  {
    title: "Decisions that follow evidence",
    body: "Enlighten comes before Execute: choices are made from findings, not the other way round.",
  },
  {
    title: "Handover built in",
    body: "Empower and Evolve keep capability with your team once the delivery work is done.",
  },
];

/* ── engagements ──────────────────────────────────────────────── */
export const engagements = {
  title: "Three ways to work with us",
  lede: "Engagements are scoped to the outcome. We agree scope first, then the commercial terms.",
  cta: "Discuss scope",
  tiers: [
    {
      tag: "For a defined question",
      name: "Advisory",
      points: [
        "A scoped question and a clear deliverable",
        "Working sessions with a named lead",
        "Recommendations your team can act on",
      ],
    },
    {
      tag: "For ongoing change",
      name: "Partnership",
      points: [
        "A regular working cadence with your team",
        "A roadmap reviewed as conditions change",
        "Access across all eight capabilities",
      ],
    },
    {
      tag: "For change across functions",
      name: "Transformation Program",
      points: [
        "Delivery across all five E-Principle stages",
        "A cross-capability team under one lead",
        "Handover and capability transfer in the plan",
      ],
    },
  ],
  baselineTitle: "In every engagement",
  baseline: [
    "A named engagement lead",
    "A written roadmap",
    "A confidentiality agreement",
  ],
};

/* ── philosophy ───────────────────────────────────────────────── */
export const statement = {
  big: "We Manifest",
  trademark: "™",
  body: "Strategic planning, effective execution and dedicated effort, applied to turn an ambitious vision into a venture that works.",
  source: "The EXCELLERS philosophy",
};

/* ── questions ────────────────────────────────────────────────── */
export const faq = {
  title: "Questions before the first conversation",
  items: [
    {
      q: "Which regions do you work from, and how do time zones work?",
      a: "We work from Islamabad, Maryland and London. At the start of an engagement we agree a working cadence so that sessions fall inside your working day.",
    },
    {
      q: "How do you handle confidentiality?",
      a: "Confidentiality is part of the baseline for every engagement. We sign an agreement before we review any of your material.",
    },
    {
      q: "Where does an engagement start?",
      a: "With a conversation about the outcome you need. From that we propose a scope, which usually maps to Advisory, Partnership or a Transformation Program.",
    },
    {
      q: "Do you publish fixed prices?",
      a: "No. Engagements are scoped to the outcome, so we agree scope first and discuss commercial terms once it is clear.",
    },
    {
      q: "Do you work in specific industries?",
      a: "The eight capabilities apply across sectors. Industry Solutions is where we adapt them to the realities of a particular sector.",
    },
  ],
};

/* ── closing CTA + footer ─────────────────────────────────────── */
export const closing = {
  title: "Start with the outcome you need.",
  lede: "Tell us what you are trying to change. We will come back with a proposed scope.",
  cta: "Start a conversation",
};

export const footer = {
  columns: [
    {
      title: "Capabilities",
      links: capabilities.map((c) => c.name),
    },
    {
      title: "Company",
      links: ["The E-Principle", "Engagements", "Insights", "Careers"],
    },
    {
      title: "Regions",
      links: regions,
    },
  ],
  legal: `© ${new Date().getFullYear()} EXCELLERS`,
};
