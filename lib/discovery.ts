/**
 * Shared discovery registry for public routes and machine-readable surfaces.
 *
 * Content pages still come from `content/`; this file is the smaller source of
 * truth for route families, static pages, and machine endpoints that otherwise
 * tend to drift across llms.txt, sitemaps, /api, middleware, and docs.
 *
 * Keep this module edge-safe: no filesystem-backed content loaders here.
 */

export const PUBLIC_PAGES = [
  {
    path: "/",
    title: "Home",
    description:
      "channel47 homepage for open-source marketing skills, MCP connectors, and workshops.",
    lastModified: "content",
  },
  {
    path: "/browse",
    title: "Browse — the full library, filterable by type",
    description:
      "Browse channel47 skills, MCP connectors, posts, and workshops.",
    lastModified: "content",
  },
  {
    path: "/newsletter",
    title: "Newsletter",
    description: "Subscribe for channel47 updates.",
  },
  {
    path: "/session",
    title: "Agentic Systems Working Session",
    description: "Book a one-to-one working session with Jackson Dean.",
  },
  {
    path: "/privacy",
    title: "Privacy",
    description: "channel47 privacy policy.",
  },
  {
    path: "/terms",
    title: "Terms",
    description: "channel47 terms of use.",
  },
] as const

export const CONTENT_COLLECTION = {
  builds: {
    key: "builds",
    segment: "builds",
    searchType: "build",
    label: "Builds",
    singularLabel: "Build",
    description: "Annotated blueprints for real agentic systems",
    routeDescription: "Builds (annotated system blueprints)",
    basePath: "/builds",
    indexPath: "/browse?type=builds",
    htmlPattern: "/builds/:slug",
    markdownPattern: "/builds/:slug.md",
  },
  posts: {
    key: "posts",
    segment: "posts",
    searchType: "post",
    label: "Posts",
    singularLabel: "Post",
    description: "First-person stories and updates",
    routeDescription: "Posts",
    basePath: "/posts",
    indexPath: "/browse?type=posts",
    htmlPattern: "/posts/:slug",
    markdownPattern: "/posts/:slug.md",
  },
  skills: {
    key: "skills",
    segment: "skills",
    searchType: "skill",
    label: "Skills",
    singularLabel: "Skill",
    description: "Installable agent skills for marketers",
    routeDescription: "Skills (installable agent skills)",
    basePath: "/skills",
    indexPath: "/browse?type=skills",
    htmlPattern: "/skills/:slug",
    markdownPattern: "/skills/:slug.md",
  },
  connectors: {
    key: "connectors",
    segment: "connectors",
    searchType: "connector",
    label: "Connectors",
    singularLabel: "Connector",
    description: "MCP servers for ad platforms",
    routeDescription: "Connectors (MCP servers for ad platforms)",
    basePath: "/connectors",
    indexPath: "/browse?type=connectors",
    htmlPattern: "/connectors/:slug",
    markdownPattern: "/connectors/:slug.md",
  },
  workshops: {
    key: "workshops",
    segment: "workshops",
    searchType: "workshop",
    label: "Workshops",
    singularLabel: "Workshop",
    description: "Recorded and upcoming live build sessions",
    routeDescription: "Workshops (session notes)",
    basePath: "/workshops",
    indexPath: "/browse?type=workshops",
    htmlPattern: "/workshops/:slug",
    markdownPattern: "/workshops/:slug.md",
  },
} as const

export const CONTENT_COLLECTIONS = Object.values(CONTENT_COLLECTION)

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number]
export type ContentCollectionKey = keyof typeof CONTENT_COLLECTION
export type ContentSection = ContentCollection["segment"]
export type SearchResultType = ContentCollection["searchType"]

const CONTENT_SECTION_PATTERN = CONTENT_COLLECTIONS.map((c) => c.segment).join("|")

export const CONTENT_ROUTE_PATTERN = new RegExp(
  `^/(${CONTENT_SECTION_PATTERN})/([a-z0-9-]+)(\\.md)?$`,
)

export const MACHINE_SURFACES = [
  {
    key: "api",
    path: "/api",
    label: "public JSON discovery document",
    description: "formats, route families, and next actions",
  },
  {
    key: "llms",
    path: "/llms.txt",
    label: "llms.txt",
    description: "curated agent map and operator hints",
  },
  {
    key: "sitemapMarkdown",
    path: "/sitemap.md",
    label: "markdown discovery index",
    description: "every public URL grouped by type",
  },
  {
    key: "sitemap",
    path: "/sitemap.xml",
    label: "XML sitemap",
    description: "canonical URLs for crawlers",
  },
  {
    key: "rss",
    path: "/rss.xml",
    label: "full-content RSS feed",
    description: "newest public content for feed readers and agents",
  },
] as const

export function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl}${path}`
}
