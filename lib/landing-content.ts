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

/** The line-art schematic drawn over each card (see SchematicFig). */
export type CardMotif = "skills" | "agents" | "connectors"

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
}

export const EA_RAIL: EARailCard[] = [
  {
    title: "Skills",
    desc: "Composable skills your agents call to research, write, and optimize.",
    bg: "oklch(0.55 0.19 32)",
    flood:
      "radial-gradient(circle, rgba(247,205,120,0.6), rgba(247,205,120,0) 60%)",
    dots: "radial-gradient(rgba(247,205,120,0.82) 1.1px, transparent 1.4px)",
    motif: "skills",
  },
  {
    title: "Agents",
    desc: "Autonomous sub-agents that run the work end to end, on your approval.",
    bg: "oklch(0.50 0.16 275)",
    flood:
      "radial-gradient(circle, rgba(240,150,175,0.6), rgba(240,150,175,0) 60%)",
    dots: "radial-gradient(rgba(240,150,175,0.82) 1.1px, transparent 1.4px)",
    motif: "agents",
  },
  {
    title: "Connectors",
    desc: "MCP connectors that plug straight into Google, Bing, Klaviyo, and Shopify.",
    bg: "oklch(0.54 0.115 200)",
    flood:
      "radial-gradient(circle, rgba(190,222,130,0.6), rgba(190,222,130,0) 60%)",
    dots: "radial-gradient(rgba(190,222,130,0.82) 1.1px, transparent 1.4px)",
    motif: "connectors",
  },
]
