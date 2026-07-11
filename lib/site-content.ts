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
  // Not yet linked directly by nav/footer (both point at /session) — Wave 3's
  // /session page consumes this for the Cal.com booking CTA.
  booking: "https://cal.com/ctrlswing/15min",
} as const

/** Home hero — first person, capture in the hero, bio below the rows (v2). */
export const HOME = {
  headline: "I build agentic systems for marketers.",
  subhead:
    "Skills, connectors, and workshops from real ad accounts I run every day. Free to grab, live sessions monthly.",
  /** The bio block between "Browse all" and the footer. */
  name: "Jackson Dean",
  tagline: "7 years buying media",
  avatar: "/jackson.jpeg",
  bio: "I run ad accounts for a living, and I got tired of rebuilding the same tools every Monday. So I ship them here as I make them. If one of them saves you an afternoon, it's yours.",
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
 * Builds reuse the Post gold accent (`--c-build` aliases `--c-post` in
 * globals.css) — they're distinguished by a pixel glyph, not a new hue. */
export type ContentTypeKey =
  | "builds"
  | "skills"
  | "connectors"
  | "posts"
  | "workshops"

export const TYPE_COLORS: Record<ContentTypeKey, string> = {
  builds: "var(--c-build)",
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
  /** The shine-link copy closing the row's open body — specific to what the
   * type actually contains, not a generic "Browse {type} →". */
  linkText: string
}

export const CATEGORIES: Category[] = [
  {
    key: "builds",
    title: "Builds",
    desc: "Annotated blueprints for systems I've actually built and run — enough that you can make your own version, without the full tutorial.",
    href: "/browse?type=builds",
    linkText: "Browse all builds →",
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
