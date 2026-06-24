/**
 * Landing page content.
 *
 * This is the single source of truth for everything the landing page renders.
 * It lives here (rather than inline in components) so that when the backend
 * lands — a real catalog of systems with downloadable skills, walkthrough
 * videos and principle essays — these shapes can be served from an API or CMS
 * with no change to the presentation layer.
 */

/** External links and headline pricing, kept in one place. */
export const LINKS = {
  join:
    "https://www.skool.com/the-vibe-marketers/about?ref=be313e8087da44cca0ecd7edd9ac0775",
  book: "https://cal.com/ctrlswing/15min",
  fungus: "https://fungusheadshop.com",
} as const

export const ACCESS_PRICE = "$249"
export const ACCESS_SEPARATE_PRICE = "$870+"
/** Member unlock code referenced in the bar and FAQ. */
export const MEMBER_CODE = "VIBE47"

/** A coloured marker used in the category stack and the system part chips. */
export type PartKind = "skill" | "connector" | "agent"

export const PART_DOT_CLASS: Record<PartKind, string> = {
  skill: "pt-skill",
  connector: "pt-connector",
  agent: "pt-agent",
}

/** One component that ships inside a system (a skill, MCP connector or agent). */
export interface SystemPart {
  /** Short uppercase label, e.g. "SKILL". */
  kind: PartKind
  /** Human label, e.g. "Review miner". */
  label: string
}

/** A buildable agentic system shown in the coverflow shelf and its modal. */
export interface System {
  /** Stable id — future routes like /systems/[slug]. */
  slug: string
  /** Kicker shown above the modal title, e.g. "PERSONA ENGINE". */
  kicker: string
  name: string
  /** Display price, or "Soon" for systems still in the lab. */
  price: string
  /** Whether the system is live (vs. an upcoming lab build). */
  live: boolean
  /** One-line summary shown in the modal. */
  blurb: string
  /** Selling points shown as a bullet list in the modal. */
  bullets: string[]
  /** Components that make up the system. */
  parts: SystemPart[]
  /** Accent token name (e.g. "cat-orange") that colours the card. */
  accent: string
  /** Icon key (see ICONS in systems-coverflow) drawn full-bleed on the card. */
  icon: string
  /** Optional artifact preview image; when set it overrides the colour+icon. */
  image?: string
}

export const SYSTEMS: System[] = [
  {
    slug: "research-personas",
    kicker: "PERSONA ENGINE",
    name: "Research & Personas",
    accent: "cat-orange",
    icon: "user",
    price: "$190",
    live: true,
    blurb:
      "Feed it reviews and transcripts; it mines the real language buyers use and hands back the personas every other system runs on.",
    bullets: [
      "Pulls 100+ real customer quotes from first-party & competitor reviews",
      "Builds a full voice-of-customer file — every quote source-linked",
      "Outputs the personas the rest of the library plugs into",
    ],
    parts: [
      { kind: "skill", label: "Review miner" },
      { kind: "agent", label: "Persona builder" },
    ],
  },
  {
    slug: "angle-generator",
    kicker: "RANKED ANGLES",
    name: "Angle Generator",
    accent: "cat-gold",
    icon: "target",
    price: "$150",
    live: true,
    blurb:
      "A ranked list of selling angles, each scored by buyer intent and backed by the exact customer quote that proves it.",
    bullets: [
      "Scores every angle by buyer intent",
      "Each angle backed by the quote that proves it",
      "Feeds straight into the advertorial & ad systems",
    ],
    parts: [{ kind: "skill", label: "Angle scorer" }],
  },
  {
    slug: "advertorial-builder",
    kicker: "PRE-SELL PAGE",
    name: "Advertorial Builder",
    accent: "cat-teal",
    icon: "article",
    price: "$290",
    live: true,
    blurb:
      "The editorial pre-sell page that lands cold traffic already sold — written whole from a winning angle.",
    bullets: [
      "Turns a winning angle into a full long-form pre-sell page",
      "Customer language baked into every section",
      "The flagship — what most people come for",
    ],
    parts: [{ kind: "skill", label: "Pre-sell writer" }],
  },
  {
    slug: "paid-search",
    kicker: "CONNECTOR",
    name: "Paid Search System",
    accent: "cat-indigo",
    icon: "dollar",
    price: "$240",
    live: true,
    blurb:
      "An MCP connector that runs Google & Bing with agents — it finds wasted spend and ships the changes once you approve.",
    bullets: [
      "MCP connector for Google & Bing Ads",
      "Flags wasted spend and proposes concrete changes",
      "Ships the edits on your approval",
    ],
    parts: [
      { kind: "connector", label: "Google & Bing MCP" },
      { kind: "agent", label: "Spend optimizer" },
    ],
  },
  {
    slug: "ad-creative",
    kicker: "IN THE LAB",
    name: "Ad Creative Generator",
    accent: "cat-green",
    icon: "sparkles",
    price: "Soon",
    live: false,
    blurb:
      "Scroll-stopping static and video creative, generated from your research and winning angles.",
    bullets: [
      "Static & video creative from your research",
      "Built live in an upcoming lab",
    ],
    parts: [{ kind: "skill", label: "Creative generator" }],
  },
  {
    slug: "email-flows",
    kicker: "IN THE LAB",
    name: "Email Flows",
    accent: "cat-rose",
    icon: "mail",
    price: "Soon",
    live: false,
    blurb:
      "Welcome, nurture and promo sequences in your brand's exact voice, off the same customer context.",
    bullets: [
      "Welcome, nurture & promo sequences in your voice",
      "Runs off the same customer context",
      "Built live in an upcoming lab",
    ],
    parts: [{ kind: "skill", label: "Sequence writer" }],
  },
]

/** A "shelf" in the hero — the building blocks of the eventual operating system. */
export interface Category {
  /** Kicker label, e.g. "SKILLS". */
  kicker: string
  /** Pill text, e.g. "drop-in". */
  tag: string
  /** Big title on the card. */
  title: string
  /** Body copy. */
  body: string
  /** Accent class — drives the front-card colour (acc0–acc3). */
  accent: string
}

export const CATEGORIES: Category[] = [
  {
    kicker: "SKILLS",
    tag: "drop-in",
    title: "Skills",
    body: "Drop-in capabilities your agents load on demand — review miners, angle scorers, pre-sell writers, each a single file.",
    accent: "acc0",
  },
  {
    kicker: "CONNECTORS",
    tag: "MCP",
    title: "Connectors",
    body: "MCP connectors that wire agents straight into Google, Bing, Klaviyo, Drip and Shopify — the platforms you run every day.",
    accent: "acc1",
  },
  {
    kicker: "AGENTS",
    tag: "sub-agents",
    title: "Agents",
    body: "Purpose-built sub-agents that do the work — mine personas, find wasted spend, ship the changes once you approve.",
    accent: "acc2",
  },
  {
    kicker: "PLAYBOOKS",
    tag: "method",
    title: "Playbooks",
    body: "The thinking that ties it together — how I find angles, structure traffic and run the whole stack with agents.",
    accent: "acc3",
  },
]

/* -------------------------------------------------------------------------
   Early-access landing page (the live, email-first page).
   Copy + card data transcribed from the "CH47 Early Access" Claude Design file.
   ------------------------------------------------------------------------- */

/** Headline, narrative copy and form helper for the early-access page. */
export const EARLY_ACCESS = {
  headline: "An agentic operating system for performance marketers",
  p1: "Seven years and three million dollars in ad spend taught me the wins were never the clever creative or the lucky audience. Underneath every account that scaled was a system — a repeatable way to find the angle, build the page, and read the numbers.",
  p2: "For years those systems lived in my head and a sprawl of half-finished docs. Agents changed that. The judgment I used to carry around is now something I can hand over directly — as skills, agents, connectors, and the playbooks that tie them together.",
  p3: "I'm packaging the whole stack into one operating system, from cold-traffic acquisition through retention. It's almost here — leave your email and you'll be first through the door.",
  helper: "No spam. One email when the first systems ship.",
} as const

/**
 * One card in the early-access pillar rail. The colours are baked into the data
 * because each card is a self-contained dark colour field (a base plus three
 * blurred blob hues), straight from the design — they don't theme with the page.
 * The rail scrolls horizontally on narrow screens and lays out as a fitted 3-up
 * gallery on wide ones; the copy reveals on hover (and shows outright on touch).
 */
export interface EARailCard {
  title: string
  desc: string
  /** Card base colour (OKLCH). */
  bg: string
  /** Three blurred blob hues drifting behind the card. */
  blobs: [string, string, string]
}

export const EA_RAIL: EARailCard[] = [
  {
    title: "Skills",
    desc: "Composable skills your agents call to research, write, and optimize.",
    bg: "oklch(0.47 0.135 45)",
    blobs: ["oklch(0.66 0.205 55)", "oklch(0.44 0.16 30)", "oklch(0.63 0.12 80)"],
  },
  {
    title: "Agents",
    desc: "Autonomous sub-agents that run the work end to end, on your approval.",
    bg: "oklch(0.42 0.11 285)",
    blobs: ["oklch(0.58 0.165 292)", "oklch(0.40 0.11 268)", "oklch(0.56 0.13 320)"],
  },
  {
    title: "Connectors",
    desc: "MCP connectors that plug straight into Google, Bing, Klaviyo, and Shopify.",
    bg: "oklch(0.45 0.085 210)",
    blobs: ["oklch(0.62 0.11 200)", "oklch(0.42 0.08 232)", "oklch(0.58 0.10 175)"],
  },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
}

/**
 * Testimonials are placeholders until real ones are collected — never fabricate
 * proof (see STRATEGY.md §4). The role line flags them as placeholder copy.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Very few people have managed to systematize marketing the way Jackson has. If you spend money on ads, this is for you.",
    name: "Add a real quote",
    role: "PLACEHOLDER · swap for a real testimonial",
  },
  {
    quote:
      "I bought one system expecting a prompt and got a whole workflow. It paid for itself on the first campaign.",
    name: "Add a real quote",
    role: "PLACEHOLDER · swap for a real testimonial",
  },
  {
    quote:
      "He thinks like an operator, not a freelancer. The research alone reframed how we talk about the product.",
    name: "Add a real quote",
    role: "PLACEHOLDER · swap for a real testimonial",
  },
]

export interface Faq {
  question: string
  /** Rendered as HTML so answers can carry inline links/marks. */
  answer: string
  /** Optional button shown under the answer (the Studio "book a call"). */
  cta?: { label: string; href: string }
}

export const FAQS: Faq[] = [
  {
    question: "Do I need to be technical to run these?",
    answer:
      "No. Every system ships with a short setup walkthrough that gets you running from zero. If you can copy a file and follow a video, you can use them. The walkthroughs and live builds go deeper if you want them.",
  },
  {
    question: "What's the difference between buying access and hiring you?",
    answer:
      "Access gets you the systems to run yourself — yours forever. The Studio gets you the finished output with my angle judgment applied, so you skip the setup and the learning curve. Same engine, your time back.",
  },
  {
    question: "I'm in the Vibe Marketers — is it really free?",
    answer:
      'Yes. Members get the code <span class="mono" style="font-size:13px;color:oklch(0.52 0.145 38)">VIBE47</span>, which unlocks the entire library here for free and discounts the studio rate. I build each system live in the monthly lab — you watch it get made, then take it home. <a href="{joinUrl}" target="_blank" rel="noopener" class="ul" style="color:oklch(0.52 0.145 38)">Join here →</a>',
  },
  {
    question: "How often do you add to the library?",
    answer:
      "Constantly — at least one new system or upgrade a month, built live in the lab (see the log above). Lifetime access means every one of those lands in your account free, forever.",
  },
  {
    question: "Can I just hire you to run my marketing?",
    answer:
      "Yes — that's the Studio. I run any of these systems on your business myself, with the angle judgment baked in. Advertorials from $1,950, the Angle Report at $650, or a full funnel build scoped per project.",
    cta: { label: "Book a call →", href: LINKS.book },
  },
  {
    question: "Who is this for?",
    answer:
      "Founders, marketers and operators running paid acquisition who want the workflow of a senior performance marketer without hiring one. If you're sending cold traffic and want it to convert, you're in the right place.",
  },
]
