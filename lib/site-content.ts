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

/** Content-type identity — ink at rest, colour only on hover/press/selection
 * (round 12/13/14/15). Keys match `FeedItem["type"]` plus "workshops". */
export type ContentTypeKey = "skills" | "connectors" | "posts" | "workshops"

export const TYPE_COLORS: Record<ContentTypeKey, string> = {
  skills: "var(--c-skill)",
  connectors: "var(--c-connector)",
  posts: "var(--c-post)",
  workshops: "var(--c-workshop)",
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
}

export const CATEGORIES: Category[] = [
  {
    key: "skills",
    title: "Skills",
    desc: "Composable skills your agents call to research, write, and optimize.",
    href: "/browse?type=skills",
  },
  {
    key: "connectors",
    title: "Connectors",
    desc: "MCP connectors that plug straight into Google, Meta, Bing, LinkedIn, TikTok, and Pinterest.",
    href: "/browse?type=connectors",
  },
  {
    key: "posts",
    title: "Posts",
    desc: "Field stories from real accounts — every tool here ships with the story of why it exists.",
    href: "/browse?type=posts",
  },
  {
    key: "workshops",
    title: "Workshops",
    desc: "Live monthly build-alongs inside Vibe Marketers — watch a system get built, then grab it.",
    href: "/workshops",
  },
]
