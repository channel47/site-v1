/**
 * Sitewide copy and structural data — single source of truth for everything
 * the chrome and Home render (docs/PLAN.md is the spec). Kept here rather
 * than inline so copy edits never touch presentation.
 */

/** External links, kept in one place. */
export const LINKS = {
  join:
    "https://www.skool.com/the-vibe-marketers/about?ref=be313e8087da44cca0ecd7edd9ac0775",
  // Social profiles join the footer row as they're confirmed — never guess a URL.
} as const

/** Home hero — descriptive and plain (PLAN §1 Home copy). */
export const HOME = {
  headline: "Skills, connectors, and agents for marketers.",
  subhead:
    "Built in real ad accounts by a working operator. Free to grab, live sessions monthly.",
  /** The 1–2 line signed note that earns the capture ask. */
  note: "Everything here came out of accounts I actually run. When something new ships, the list hears about it first.",
  noteSignature: "— Jackson",
} as const

/** Sitewide email-capture copy (PLAN §5 Newsletter framing). */
export const CAPTURE = {
  cta: "Subscribe",
  helper:
    "New skills, connectors, and posts as they ship — plus the next live session. No spam.",
  successTitle: "You're on the list.",
  successHelper: "New drops and the next live session, straight to you.",
} as const

/** The line-art schematic drawn over each card (see SchematicFig). */
export type CardMotif = "posts" | "skills" | "agents" | "connectors" | "workshops"

/**
 * One riso type card. Each is a self-contained, vivid colour field (a deep
 * OKLCH base) dressed in the riso treatment: a screen-blended `flood` radial,
 * a static halftone `dots` field, and a schematic line drawing keyed by
 * `motif`. Colours are baked into the data because the cards stay vivid in
 * both light and dark — they don't theme with the page.
 *
 * Cards exist only for POPULATED types (PLAN §2) — Agents and Articles join
 * when their first real item ships. Motif = type identity; colour =
 * individuality.
 */
export interface TypeCard {
  title: string
  desc: string
  href: string
  /** Card base colour (OKLCH). */
  bg: string
  /** Screen-blended radial flood behind the schematic. */
  flood: string
  /** Halftone dot field (a repeating radial-gradient image). */
  dots: string
  motif: CardMotif
}

export const TYPE_CARDS: TypeCard[] = [
  {
    title: "Posts",
    desc: "Field stories from real accounts — every tool here ships with the story of why it exists.",
    href: "/browse?type=posts",
    bg: "oklch(0.52 0.11 85)",
    flood:
      "radial-gradient(circle, rgba(250,226,152,0.6), rgba(250,226,152,0) 60%)",
    dots: "radial-gradient(rgba(250,226,152,0.82) 1.1px, transparent 1.4px)",
    motif: "posts",
  },
  {
    title: "Skills",
    desc: "Composable skills your agents call to research, write, and optimize.",
    href: "/browse?type=skills",
    bg: "oklch(0.55 0.19 32)",
    flood:
      "radial-gradient(circle, rgba(247,205,120,0.6), rgba(247,205,120,0) 60%)",
    dots: "radial-gradient(rgba(247,205,120,0.82) 1.1px, transparent 1.4px)",
    motif: "skills",
  },
  {
    title: "Connectors",
    desc: "MCP connectors that plug straight into Google, Meta, Bing, LinkedIn, TikTok, and Pinterest.",
    href: "/browse?type=connectors",
    bg: "oklch(0.54 0.115 200)",
    flood:
      "radial-gradient(circle, rgba(190,222,130,0.6), rgba(190,222,130,0) 60%)",
    dots: "radial-gradient(rgba(190,222,130,0.82) 1.1px, transparent 1.4px)",
    motif: "connectors",
  },
  {
    title: "Workshops",
    desc: "Live monthly build-alongs inside Vibe Marketers — watch a system get built, then grab it.",
    href: "/workshops",
    bg: "oklch(0.48 0.13 340)",
    flood:
      "radial-gradient(circle, rgba(244,168,196,0.6), rgba(244,168,196,0) 60%)",
    dots: "radial-gradient(rgba(244,168,196,0.82) 1.1px, transparent 1.4px)",
    motif: "workshops",
  },
]
