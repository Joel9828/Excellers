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
  blurb: "A business transformation consultancy.",
};

export const nav = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "E-Principle", href: "#principle" },
  { label: "Engagements", href: "#engagements" },
  { label: "Insights", href: "#insights" },
  { label: "Questions", href: "#questions" },
];

/* ── hero ─────────────────────────────────────────────────────── */
export const hero = {
  eyebrow: "We Manifest",
  headline: "From Possibilities to Progress.",
  lede: "EXCELLERS is a business transformation partner. We turn opportunities, challenges and ideas into clearer decisions, stronger systems and measurable progress.",
  primary: "Start a conversation",
  secondary: "See how we manifest",
};

/* ── the tension ──────────────────────────────────────────────── */
export const tension = {
  eyebrow: "The tension",
  title: "Possibility is not progress.",
  lede: "Most ambitions stall between the idea and the result. Five steps close that gap.",
  steps: ["Clarity", "Structure", "Action", "Capability", "Progress"],
};

/* ── what we do ───────────────────────────────────────────────── */
export const whatWeDo = {
  eyebrow: "What we do",
  title: "We turn complexity into a way forward.",
  items: [
    { name: "Clarify", desc: "Name what matters and what is in the way." },
    { name: "Build", desc: "Give the opportunity structure and a plan." },
    { name: "Advance", desc: "Deliver, and leave your team able to carry on." },
  ],
};

/* ── eight capabilities ───────────────────────────────────────── */
export const capabilities = [
  {
    name: "Business & Strategy",
    desc: "Direction, portfolio and operating-model choices.",
      icon: {
      paths: '<path d="M4 14H10M10 14L13 8.8M10 14L13 19.2" />',
      dots: [
        [4, 14],
        [13, 19.2],
      ],
      manifest: [13, 8.8],
    },
  },
  {
    name: "Customer Experience",
    desc: "Journeys, service design and the moments that shape loyalty.",
      icon: {
      paths: '<path d="M4 8C4 14 8 17 12 17S20 14 20 8" />',
      dots: [
        [4, 8],
        [20, 8],
      ],
      manifest: [12, 17],
    },
  },
  {
    name: "Operations",
    desc: "Process, performance and the mechanics of delivery.",
      icon: {
      paths: '<circle cx="12" cy="12" r="7" />',
      dots: [
        [12, 5],
        [5.94, 15.5],
      ],
      manifest: [18.06, 15.5],
    },
  },
  {
    name: "People",
    desc: "Organisation, capability and leadership through change.",
      icon: {
      paths: '<path d="M5 18a7 7 0 0 1 14 0M12 11V6" />',
      dots: [
        [5, 18],
        [19, 18],
      ],
      manifest: [12, 6],
    },
  },
  {
    name: "Technology",
    desc: "Architecture, platforms and delivery engineering.",
      icon: {
      paths: '<rect x="3" y="6" width="18" height="12" rx="6" /><path d="M9 12h6" />',
      dots: [
        [9, 12],
      ],
      manifest: [15, 12],
    },
  },
  {
    name: "Digital Growth",
    desc: "Acquisition, conversion and measurable growth online.",
      icon: {
      paths: '<path d="M4 19L7 13.8H11L14 8.6H18" />',
      dots: [
        [4, 19],
      ],
      manifest: [18, 8.6],
    },
  },
  {
    name: "Industry Solutions",
    desc: "Capabilities adapted to the realities of a sector.",
      icon: {
      paths: '<path d="M7 19H17M7 19V10M12 19V6M17 19V12" />',
      dots: [
        [7, 10],
        [17, 12],
      ],
      manifest: [12, 6],
    },
  },
  {
    name: "AI & Automation",
    desc: "Applied intelligence and automation where it removes real work.",
      icon: {
      paths: '<path d="M12 12V5M12 12L5.94 15.5M12 12L18.06 15.5" />',
      dots: [
        [12, 5],
        [5.94, 15.5],
        [18.06, 15.5],
      ],
      manifest: [12, 12],
    },
  },
];

export const capabilitiesIntro = {
  eyebrow: "Capabilities",
  title: "The right capability. The right moment.",
  lede: "Eight capabilities, one system. Each strengthens the others through the same five-stage method. Select one to see it connect.",
  connects:
    "It works with the seven other capabilities through the same five-stage method, so progress in one lifts the rest.",
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
  stageOf: "Stage %s of 5",
  footnote: "stages, in a fixed order",
  footnoteDetail: "Explore, Enlighten, Execute, Empower, Evolve.",
  stages: [
    {
      n: "01",
      name: "Explore",
      meaning:
        "Curiosity drives innovation. We venture into uncharted territory and discover new possibilities.",
      question: "What is possible?",
      readout: "Signal Sweep · Scanning",
    },
    {
      n: "02",
      name: "Enlighten",
      meaning:
        "We illuminate complex challenges, guiding informed decisions for meaningful progress.",
      question: "What matters?",
      readout: "Evidence · Analysing",
    },
    {
      n: "03",
      name: "Execute",
      meaning:
        "We turn ideas into reality with precision and determination.",
      question: "What needs to happen?",
      readout: "Delivery Graph · Executing",
    },
    {
      n: "04",
      name: "Empower",
      meaning:
        "We cultivate success through support, encouragement and trust.",
      question: "Who carries it forward?",
      readout: "Autonomy Index · Handover",
    },
    {
      n: "05",
      name: "Evolve",
      meaning:
        "We embrace change for continuous growth, staying ahead through constant innovation.",
      question: "What comes next?",
      readout: "Growth Curve · Compounding",
    },
  ],
};

/* ── proof ────────────────────────────────────────────────────── */
/* Internal proof only. The empty state is deliberate and is the client's
   wording: no client work is claimed until a client has approved it. */
export const proof = {
  eyebrow: "Proof",
  title: "Progress you can inspect.",
  lede: "Systems, methods and outcomes, shown as they are.",
  tools: [
    {
      name: "E-Principle interactive",
      desc: "The stepper above, as a working tool.",
    },
    {
      name: "EXCELLERS CRM PRO",
      desc: "A 14-sheet workbook with live KPI dashboards.",
    },
    {
      name: "Careers system",
      desc: "A talent registration flow, designed end to end.",
    },
  ],
  empty: {
    title: "Case studies are coming",
    body: "Client work appears here once each client has approved it. Until then, ask for a walkthrough of our own tools.",
    cta: "Ask for a walkthrough",
  },
};

/* ── who we work with ─────────────────────────────────────────── */
export const audiences = {
  eyebrow: "Who we work with",
  title: "For people building what's next.",
  lede: "Turn friction into progress, whatever your role.",
  items: [
    { name: "Founders", desc: "Turn a vision into a venture." },
    { name: "Leaders", desc: "Turn strategy into delivery." },
    { name: "Operations teams", desc: "Turn friction into flow." },
    { name: "Growth teams", desc: "Turn attention into traction." },
    {
      name: "Transformation teams",
      desc: "Turn programmes into lasting change.",
    },
  ],
};

/* ── insights ─────────────────────────────────────────────────── */
export const insights = {
  eyebrow: "Insights",
  title: "EXCELLERS Insights",
  lede: "Thinking on operations, people, technology and AI.",
  empty: {
    title: "First insights are coming",
    body: "Articles appear here once published, filterable by capability and E-Principle stage.",
    cta: "Explore insights",
  },
};

/* ── engagements ──────────────────────────────────────────────── */
export const engagements = {
  eyebrow: "Engagements",
  title: "Start where the need is.",
  lede: "Scoped around the work. We agree scope first, then commercial terms.",
  cta: "Discuss scope",
  tiers: [
    {
      tag: "For a decision",
      name: "Advisory",
      points: [
        "A scoped question and a clear deliverable",
        "Working sessions with a named lead",
        "Recommendations your team can act on",
      ],
    },
    {
      tag: "For ongoing progress",
      name: "Partnership",
      points: [
        "A regular working cadence with your team",
        "A roadmap reviewed as conditions change",
        "Access across all eight capabilities",
      ],
    },
    {
      tag: "For meaningful change",
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
    "A named lead",
    "A written roadmap",
    "Clear scope and terms",
    "Confidentiality",
    "Capability transfer where required",
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
  eyebrow: "Next step",
  title: "Every possibility starts with a decision.",
  lede: "Tell us what you are trying to change and we will come back with a proposed scope.",
  cta: "Start a conversation",
  label: "Work email",
  placeholder: "name@company.com",
  help: "We reply within two working days.",
  invalid: "Enter a full address, such as name@company.com.",
  sent: "Thank you. We will be in touch within two working days.",
};

/* A null href means there is nowhere real to go yet: the footer renders it
   as plain text marked "Coming soon" rather than a link that quietly lands
   back on the contact form. */
export const footer = {
  columns: [
    {
      title: "Capabilities",
      links: capabilities.map((c) => ({
        label: c.name,
        href: "#capabilities",
      })),
    },
    {
      title: "Company",
      links: [
        { label: "The E-Principle", href: "#principle" },
        { label: "Engagements", href: "#engagements" },
        { label: "Insights", href: "#insights" },
        { label: "Careers", href: null },
      ],
    },
  ],
  tagline:
    "Business transformation for organizations ready to move from possibility to progress.",
  legal: `Explore. Enlighten. Execute. Empower. Evolve. © ${new Date().getFullYear()} EXCELLERS · We Manifest™`,
};
