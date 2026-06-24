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
      "Welcome, nurture and promo sequences in your brand’s exact voice, off the same customer context.",
    bullets: [
      "Welcome, nurture & promo sequences in your voice",
      "Runs off the same customer context",
      "Built live in an upcoming lab",
    ],
    parts: [{ kind: "skill", label: "Sequence writer" }],
  },
]

/** A "shelf" in the hero — the four kinds of thing in the library. */
export interface Category {
  /** Kicker label, e.g. "SYSTEMS". */
  kicker: string
  /** Pill text, e.g. "skills · connectors · agents". */
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
    kicker: "SYSTEMS",
    tag: "workflows",
    title: "Systems",
    body: "Repeatable workflows for research, angles, advertorials, page QA, and campaign review.",
    accent: "acc0",
  },
  {
    kicker: "METHOD",
    tag: "how it works",
    title: "Method",
    body: "How the work gets split between the marketer, the model, the source material, and the checks.",
    accent: "acc1",
  },
  {
    kicker: "WALKTHROUGHS",
    tag: "build notes",
    title: "Walkthroughs",
    body: "Build notes from systems as they come together.",
    accent: "acc2",
  },
  {
    kicker: "TOOLS",
    tag: "skills · connectors · agents · files",
    title: "Tools",
    body: "Skills, connectors, agents, and files when something is ready to run.",
    accent: "acc3",
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
    question: "Is any of this for sale yet?",
    answer:
      "Not yet. I’m building the library in the open, one system at a time, and shipping each to the list as it’s ready. Join the waitlist and you’ll be first when the early systems go live.",
  },
  {
    question: "Do I need to be technical to run these?",
    answer:
      "No. Every system ships with a short setup walkthrough that gets you running from zero. If you can copy a file and follow a video, you can use them. The walkthroughs go deeper if you want them.",
  },
  {
    question: "What will it cost?",
    answer:
      "Still settling that — but it’ll be fair, and it’ll be a one-time thing, not a subscription. The list gets the first and best terms when access opens.",
  },
  {
    question: "I’m in the Vibe Marketers — do I get anything?",
    answer:
      'Yes — members get the library free when it lands. Join the waitlist with the same email you use there and I’ll line it up. I build each system live in the monthly lab, so you can watch it get made, then take it home. <a href="{joinUrl}" target="_blank" rel="noopener" class="ul" style="color:oklch(0.52 0.145 38)">Join here →</a>',
  },
  {
    question: "Can I just hire you to run my marketing?",
    answer:
      "Yes — that’s the Studio, and it’s open now while the library is still being built. I run these systems on your business myself, with the angle judgment baked in. Advertorials from $1,950, the Angle Report at $650, or a full funnel build scoped per project.",
    cta: { label: "Book a call →", href: LINKS.book },
  },
  {
    question: "Who is this for?",
    answer:
      "Founders, marketers and operators running paid acquisition who want the workflow of a senior performance marketer without hiring one. If you’re sending cold traffic and want it to convert, you’re in the right place.",
  },
]
