/**
 * Early-access landing page content.
 *
 * Single source of truth for everything the live, email-first page renders.
 * Copy and card data are transcribed from the "CH47 Early Access" Claude Design
 * file (greige foundation, headline-top layout). Kept here (rather than inline)
 * so it can later be served from an API or CMS with no change to presentation.
 */

/** External links, kept in one place. */
export const LINKS = {
  join:
    "https://www.skool.com/the-vibe-marketers/about?ref=be313e8087da44cca0ecd7edd9ac0775",
} as const

/** Headline, narrative copy and form helper for the early-access page. */
export const EARLY_ACCESS = {
  headline: "An agentic operating system for performance marketers",
  p1: "Seven years and three million dollars in ad spend taught me the wins were never the clever creative or the lucky audience. Underneath every account that scaled was a system: a repeatable way to find the angle, build the page, and read the numbers.",
  p2: "For years those systems lived in my head and a sprawl of half-finished docs. Agents changed that. The judgment I used to carry around is now something I can hand over directly, as skills, agents, connectors, and the playbooks that tie them together.",
  p3: "I'm packaging the whole stack into one operating system, from cold-traffic acquisition through retention. It's almost here. Leave your email and you'll be first through the door.",
  helper: "No spam. One email when the first systems ship.",
} as const

/* ============================================================
   HOME — the evolved landing page (docs/PLAN.md §5).
   The single-purpose early-access page grows into the channel's
   front door: reframed POV hero, six type gateways, a next-live
   strip, a "latest" feed, a condensed signed note + capture, and
   an SEO footer. Copy is drafted against the operator-promise /
   trenches-credibility poles from PLAN §1.
   ============================================================ */

/** Reframed hero + condensed signed note + capture helper for Home. */
export const HOME = {
  /** POV headline — operator-promise, not a product pitch. */
  headline: "Become an agentic operator.",
  /** One-line subhead grounding the promise in the trenches. */
  subhead:
    "Channel 47 teaches ecommerce operators to run growth as a system of AI agents, skills, and connectors — drawn from years inside real ad accounts.",
  /** Condensed trenches voice — the long narrative now lives on /about. */
  note: "Seven years and $3M+ in ad spend taught me the wins were never the clever creative — they were the systems underneath. I'm handing those over, one at a time.",
  /** Where Jackson signs the note. */
  signature: "— Jackson Dean",
  /** Capture helper under the form. */
  helper: "No spam. One email when the first systems ship.",
  /** Section heading over the latest feed. */
  feedHeading: "Latest from the channel",
} as const

/** Compact icon nav in the header (PLAN §3). */
export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: "Browse", href: "/browse" },
  { label: "Live", href: "/workshops" },
  { label: "Newsletter", href: "/newsletter" },
]

/** The quiet "next live" strip. Set to null to collapse it. */
export const NEXT_LIVE: {
  title: string
  date: string
  href: string
} | null = {
  title: "Wiring Klaviyo flows to a retention agent, live",
  date: "Jul 3, 2026",
  href: LINKS.join,
}

/** One editorial row in the "Latest from the channel" feed. */
export interface FeedItem {
  title: string
  type: "Article" | "Post" | "Skill" | "Agent" | "Connector" | "Workshop"
  meta?: string
  href: string
}

export const LATEST: FeedItem[] = [
  {
    title: "The advertorial angle that beat our control by 3×",
    type: "Article",
    meta: "Jun 2026",
    href: "/browse?type=articles",
  },
  {
    title: "A skill that drafts Meta primary text in your brand voice",
    type: "Skill",
    href: "/browse?type=skills",
  },
  {
    title: "Why I stopped trusting ROAS at the ad-set level",
    type: "Post",
    meta: "Jun 2026",
    href: "/browse?type=posts",
  },
  {
    title: "Live: building a creative-testing agent from scratch",
    type: "Workshop",
    meta: "Jul 3",
    href: "/workshops",
  },
  {
    title: "Klaviyo MCP connector",
    type: "Connector",
    href: "/browse?type=connectors",
  },
]

/** Footer link groups — the site's SEO / completeness net (PLAN §3). */
export interface FooterColumn {
  heading: string
  links: NavLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Learn",
    links: [
      { label: "Articles", href: "/browse?type=articles" },
      { label: "Posts", href: "/browse?type=posts" },
      { label: "Skills", href: "/skills" },
      { label: "Agents", href: "/browse?type=agents" },
      { label: "Connectors", href: "/browse?type=connectors" },
    ],
  },
  {
    heading: "Live",
    links: [
      { label: "Workshops", href: "/workshops" },
      { label: "Vibe Marketers →", href: LINKS.join },
    ],
  },
  {
    heading: "More",
    links: [
      { label: "About", href: "/about" },
      { label: "Browse all", href: "/browse" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Skills index", href: "/skills" },
      { label: "Glossary", href: "/glossary" },
      { label: "FAQ", href: "/faq" },
    ],
  },
]

export const FOOTER_SOCIAL: NavLink[] = [
  { label: "Skool", href: LINKS.join },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
]

/** The line-art schematic drawn over each card (see SchematicFig). */
export type CardMotif =
  | "skills"
  | "agents"
  | "connectors"
  | "articles"
  | "posts"
  | "workshops"

/**
 * One card in the early-access pillar rail. Each card is a self-contained,
 * vivid colour field (a deep OKLCH base) dressed in the riso treatment: a
 * screen-blended `flood` radial, a drifting halftone `dots` field, and a
 * schematic line drawing keyed by `motif`. The colours are baked into the data
 * because the cards stay vivid in both light and dark — they don't theme with
 * the page. The rail scrolls horizontally on narrow screens and lays out as a
 * fitted 3-up gallery on wide ones; the copy reveals on hover (shows outright
 * on touch).
 */
export interface EARailCard {
  title: string
  desc: string
  /** Card base colour (OKLCH). */
  bg: string
  /** Screen-blended radial flood drifting behind the schematic. */
  flood: string
  /** Halftone dot field (a repeating radial-gradient image). */
  dots: string
  /** Which schematic line drawing sits on the card. */
  motif: CardMotif
  /** Where the card routes — Browse pre-filtered to this type. */
  href: string
}

/**
 * The six type gateways (PLAN §4). Each card is a self-contained vivid colour
 * field in the riso treatment; the motif is the type's identity, the colour is
 * its individuality. Clicking routes to Browse pre-filtered to that type. The
 * first three are the original library blocks; Articles / Posts / Workshops are
 * the three new content types, each with a fresh motif + colour field.
 */
export const EA_RAIL: EARailCard[] = [
  {
    title: "Skills",
    desc: "Composable skills your agents call to research, write, and optimize.",
    bg: "oklch(0.55 0.19 32)",
    flood:
      "radial-gradient(circle, rgba(247,205,120,0.6), rgba(247,205,120,0) 60%)",
    dots: "radial-gradient(rgba(247,205,120,0.82) 1.1px, transparent 1.4px)",
    motif: "skills",
    href: "/browse?type=skills",
  },
  {
    title: "Agents",
    desc: "Autonomous sub-agents that run the work end to end, on your approval.",
    bg: "oklch(0.50 0.16 275)",
    flood:
      "radial-gradient(circle, rgba(240,150,175,0.6), rgba(240,150,175,0) 60%)",
    dots: "radial-gradient(rgba(240,150,175,0.82) 1.1px, transparent 1.4px)",
    motif: "agents",
    href: "/browse?type=agents",
  },
  {
    title: "Connectors",
    desc: "MCP connectors that plug straight into Google, Bing, Klaviyo, and Shopify.",
    bg: "oklch(0.54 0.115 200)",
    flood:
      "radial-gradient(circle, rgba(190,222,130,0.6), rgba(190,222,130,0) 60%)",
    dots: "radial-gradient(rgba(190,222,130,0.82) 1.1px, transparent 1.4px)",
    motif: "connectors",
    href: "/browse?type=connectors",
  },
  {
    title: "Articles",
    desc: "Practical how-tos — the play, the page, and the numbers, worked end to end.",
    bg: "oklch(0.58 0.13 85)",
    flood:
      "radial-gradient(circle, rgba(140,205,200,0.6), rgba(140,205,200,0) 60%)",
    dots: "radial-gradient(rgba(140,205,200,0.82) 1.1px, transparent 1.4px)",
    motif: "articles",
    href: "/browse?type=articles",
  },
  {
    title: "Posts",
    desc: "The human voice — opinion, behind-the-scenes, and lessons from the trenches.",
    bg: "oklch(0.52 0.13 150)",
    flood:
      "radial-gradient(circle, rgba(238,196,150,0.6), rgba(238,196,150,0) 60%)",
    dots: "radial-gradient(rgba(238,196,150,0.82) 1.1px, transparent 1.4px)",
    motif: "posts",
    href: "/browse?type=posts",
  },
  {
    title: "Workshops",
    desc: "Live builds — we wire a system together on the call, then ship it.",
    bg: "oklch(0.53 0.16 12)",
    flood:
      "radial-gradient(circle, rgba(150,185,235,0.6), rgba(150,185,235,0) 60%)",
    dots: "radial-gradient(rgba(150,185,235,0.82) 1.1px, transparent 1.4px)",
    motif: "workshops",
    href: "/workshops",
  },
]
