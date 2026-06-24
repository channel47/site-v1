/**
 * Early-access landing page content.
 *
 * Single source of truth for everything the live, email-first page renders.
 * Copy and card data are transcribed from the "CH47 Early Access" Claude Design
 * file. Kept here (rather than inline) so it can later be served from an API or
 * CMS with no change to the presentation layer.
 */

/** External links, kept in one place. */
export const LINKS = {
  join:
    "https://www.skool.com/the-vibe-marketers/about?ref=be313e8087da44cca0ecd7edd9ac0775",
} as const

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
  /** Generative texture motif drawn over the colour field (see CraftCanvas). */
  motif: "grid" | "orbits" | "network" | "contours"
  /** Tint for that motif — a soft, light cast matched to the card's hue. */
  tint: string
  /** RNG seed so each card's motif layout stays stable across renders. */
  seed: number
}

export const EA_RAIL: EARailCard[] = [
  {
    title: "Skills",
    desc: "Composable skills your agents call to research, write, and optimize.",
    bg: "oklch(0.47 0.135 45)",
    blobs: ["oklch(0.66 0.205 55)", "oklch(0.44 0.16 30)", "oklch(0.63 0.12 80)"],
    motif: "grid",
    tint: "rgba(255,206,150,1)",
    seed: 3,
  },
  {
    title: "Agents",
    desc: "Autonomous sub-agents that run the work end to end, on your approval.",
    bg: "oklch(0.42 0.11 285)",
    blobs: ["oklch(0.58 0.165 292)", "oklch(0.40 0.11 268)", "oklch(0.56 0.13 320)"],
    motif: "orbits",
    tint: "rgba(206,196,255,1)",
    seed: 11,
  },
  {
    title: "Connectors",
    desc: "MCP connectors that plug straight into Google, Bing, Klaviyo, and Shopify.",
    bg: "oklch(0.45 0.085 210)",
    blobs: ["oklch(0.62 0.11 200)", "oklch(0.42 0.08 232)", "oklch(0.58 0.10 175)"],
    motif: "network",
    tint: "rgba(176,234,238,1)",
    seed: 19,
  },
]
