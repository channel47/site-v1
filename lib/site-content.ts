/**
 * Sitewide copy and structural data — single source of truth for everything
 * the chrome and Home render (docs/PLAN.md is the spec). Kept here rather
 * than inline so copy edits never touch presentation.
 */

/** External links, kept in one place. */
export const LINKS = {
  join:
    "https://www.skool.com/the-vibe-marketers/about?ref=be313e8087da44cca0ecd7edd9ac0775",
  x: "https://x.com/ctrlswing",
  github: "https://github.com/ctrlswing",
  linkedin: "https://linkedin.com/in/ctrlswing",
  // More social profiles join the footer row as they're confirmed — never guess a URL.
  // Consumed by /session for the Cal.com booking CTA. The session offer is
  // demoted from primary CTA (2026-07): only the footer links to /session.
  booking: "https://cal.com/ctrlswing/15min",
} as const

/** Home hero — broadened positioning. The hero carries a lean email
 * capture as the primary action — the page's only signup form. See
 * page.tsx. */
export const HOME = {
  headline: "Building agentic systems for everyday work.",
  subhead:
    "Skills, connectors, workshops, and practical guidance for making recurring work easier with agents.",
  /** One-line helper under the hero capture — the full newsletter pitch
   * lives on /newsletter. */
  heroCaptureHelper: "Occasional emails when something ships. Unsubscribe anytime.",
  /** The bio block between "Browse all" and the footer. */
  name: "Jackson Dean",
  tagline: "7 years buying media · building agentic systems",
  avatar: "/jackson.jpeg",
  bio: "Most of the systems here started with work I was tired of doing the same way twice. Some pull data together. Some help with research. Others turn a loose process into something an agent can run on a schedule. A lot of that work started in the ad accounts I run every day, and that history is still the deepest well of examples. When something works, I share the useful parts here.",
} as const

/** Working-session offer page (/session, v2 repositioning) — spec 06.
 * Offer facts ($250 / 60 min / four a month) are strategy-locked; the
 * testimonial is an explicit placeholder pending approval, never invented. */
export const SESSION = {
  title: "Agentic Systems Working Session",
  intro:
    "Bring one recurring workflow from your work or business. We'll think through how agents could make it easier, using tools that fit the way you already work: conversation, diagrams, tool recommendations, process mapping, or live experimentation. A finished build isn't required for the hour to be useful.",
  introShort:
    "Bring one recurring workflow. In sixty minutes we map it together and find where an agent earns its place, and where it doesn't.",
  steps: [
    "You bring one recurring workflow, and the tools already involved.",
    "We map how it works today, and where the time goes.",
    "We find where an agent could help, and where it shouldn't.",
    "You leave with a concrete approach and the next few steps, in tools you already use.",
  ],
  /** Hardcoded proof-card entry for the weekly KPI-review build, which has
   * no detail page yet. Append this after real getNotes() results on
   * /session; delete it the day that build ships as a real Note. */
  inProgressBuild: {
    tag: "Note · in progress",
    title: "The weekly KPI review, read before I open a dashboard",
    href: "/browse?type=notes",
  },
  offer: {
    label: "Book a working session",
    rows: [
      { label: "Duration", value: "60 minutes" },
      { label: "Price", value: "$250 USD" },
      { label: "Format", value: "One to one, live" },
      { label: "Capacity", value: "Four a month" },
    ],
    cta: "Book a session",
    microcopy:
      "Booking and payment happen on Cal.com. You'll pick a time and pay to confirm.",
  },
  personal: {
    name: "Jackson Dean",
    meta: "7 years buying media · building agentic systems",
    bio: "I run ad accounts for a living and build agentic systems for the recurring work around them. The useful pattern is the same everywhere: find work you repeat, give an agent a real role in it, and save time that compounds over weeks and months. I share the useful parts here.",
    bioShort:
      "I run ad accounts for a living and build agentic systems for the recurring work around them. Find work you repeat, give an agent a real role in it, and save time that compounds.",
  },
  testimonial: {
    quote:
      "One recurring report used to eat my Monday morning. I had a working version by the end of the week.",
    attribution: "Testimonial pending approval, placeholder",
  },
  boundary: {
    label: "One honest note",
    body: "It's probably not the right fit if you primarily need someone to debug an existing automation or implement a large project during the call. The hour is for thinking through one workflow together.",
    bodyShort:
      "Not the right fit if you mainly need someone to debug an existing automation or ship a large project during the call. The hour is for thinking through one workflow together.",
  },
} as const

/** Sitewide email-capture copy (PLAN §5 Newsletter framing). */
export const CAPTURE = {
  cta: "Subscribe",
  helper:
    "Occasional updates when a skill, connector, or workshop is added.",
  successTitle: "You're on the list.",
  successHelper: "You'll hear from me when there is something new to share.",
} as const

/** Content-type identity — ink at rest, colour only on hover/press/selection
 * (round 12/13/14/15). Keys match `FeedItem["type"]` plus "workshops".
 * Notes reuse the Post gold accent (`--c-note` aliases `--c-post` in
 * globals.css) — they're distinguished by a pixel glyph, not a new hue. */
export type ContentTypeKey =
  | "notes"
  | "skills"
  | "connectors"
  | "posts"
  | "workshops"

export const TYPE_COLORS: Record<ContentTypeKey, string> = {
  notes: "var(--c-note)",
  skills: "var(--c-skill)",
  connectors: "var(--c-connector)",
  posts: "var(--c-post)",
  workshops: "var(--c-workshop)",
}

/** Each type colour's brighter "shine" twin — build-in bit flashes (the
 * type icons) and the cover art's ambient sweep. */
export const TYPE_SHINES: Record<ContentTypeKey, string> = {
  notes: "var(--shine-note)",
  skills: "var(--shine-skill)",
  connectors: "var(--shine-connector)",
  posts: "var(--shine-post)",
  workshops: "var(--shine-workshop)",
}

/**
 * The four Home category rows / drawer nav rows — one per populated content
 * type. Agents joins when its first real item ships.
 */
export interface Category {
  key: ContentTypeKey
  title: string
  desc: string
  href: string
  /** The shine-link copy closing the row's open body — specific to what the
   * type actually contains, not a generic "Browse {type} →". */
  linkText: string
}

export const CATEGORIES: Category[] = [
  {
    key: "notes",
    title: "Notes",
    desc: "Annotated blueprints for systems I've actually built and run — enough that you can make your own version, without the full tutorial.",
    href: "/browse?type=notes",
    linkText: "Browse all notes →",
  },
  {
    key: "skills",
    title: "Skills",
    desc: "Three skills for brand context, competitor ad research, and creative strategy.",
    href: "/browse?type=skills",
    linkText: "Browse all skills →",
  },
  {
    key: "connectors",
    title: "Connectors",
    desc: "MCP servers for Google, Meta, Bing, LinkedIn, TikTok, and Pinterest Ads.",
    href: "/browse?type=connectors",
    linkText: "Browse all connectors →",
  },
  {
    key: "workshops",
    title: "Workshops",
    desc: "Sessions and build-alongs hosted inside the Vibe Marketers community.",
    href: "/browse?type=workshops",
    linkText: "Browse workshops →",
  },
]
