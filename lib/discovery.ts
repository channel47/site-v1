/**
 * Shared discovery registry for public routes and machine-readable surfaces.
 *
 * Content pages still come from `content/`; this file is the smaller source of
 * truth for route families, static pages, and machine endpoints that otherwise
 * tend to drift across llms.txt, sitemaps, /api, middleware, and docs.
 *
 * Keep this registry independent of filesystem-backed content loaders.
 */

export const PUBLIC_PAGES = [
  {
    path: "/",
    title: "Home",
    description:
      "Projects and notes by Jackson Dean: software, experiments, and things learned along the way.",
    lastModified: "content",
  },
  {
    path: "/browse",
    title: "Index",
    description: "All published projects and notes.",
    lastModified: "content",
  },
  {
    path: "/about",
    title: "About",
    description: "About Jackson Dean and the collection.",
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
] as const;

/** Public sections are independent of the formats retained at existing URLs. */
export const CONTENT_GROUPS = [
  {
    key: "projects",
    title: "Projects",
    icon: "projects",
    href: "/browse?type=projects",
    desc: "Software, tools, and experiments. Things I’m making for myself and sharing along the way.",
    linkText: "Browse all projects →",
  },
  {
    key: "notes",
    title: "Notes",
    icon: "notes",
    href: "/browse?type=notes",
    desc: "What I’m trying, learning, and figuring out. Short observations and longer write-ups about the work.",
    linkText: "Browse all notes →",
  },
] as const;
export type ContentGroup = (typeof CONTENT_GROUPS)[number]["key"];

export const CONTENT_COLLECTION = {
  projects: {
    key: "projects",
    group: "projects",
    segment: "projects",
    searchType: "project",
    label: "Projects",
    singularLabel: "Project",
    description: "Software, tools, and experiments",
    routeDescription: "Projects",
    basePath: "/projects",
    indexPath: "/browse?type=projects",
    htmlPattern: "/projects/:slug",
    markdownPattern: "/projects/:slug.md",
  },
  notes: {
    key: "notes",
    group: "notes",
    segment: "notes",
    searchType: "note",
    label: "Notes",
    singularLabel: "Note",
    description: "Observations, experiments, and write-ups",
    routeDescription: "Notes (observations, experiments, and write-ups)",
    basePath: "/notes",
    indexPath: "/browse?type=notes",
    htmlPattern: "/notes/:slug",
    markdownPattern: "/notes/:slug.md",
  },
} as const;

export const CONTENT_COLLECTIONS = Object.values(CONTENT_COLLECTION);

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];
export type SearchResultType = ContentCollection["searchType"];
export type ContentFormat = ContentCollection["key"];

export function contentGroup(format: ContentFormat): ContentGroup {
  return CONTENT_COLLECTION[format].group;
}

export function isContentFormat(value: string): value is ContentFormat {
  return Object.hasOwn(CONTENT_COLLECTION, value);
}

const CONTENT_SECTION_PATTERN = CONTENT_COLLECTIONS.map((c) => c.segment).join(
  "|",
);

export const CONTENT_ROUTE_PATTERN = new RegExp(
  `^/(${CONTENT_SECTION_PATTERN})/([a-z0-9-]+)(\\.md)?$`,
);

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
] as const;

export function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl}${path}`;
}
