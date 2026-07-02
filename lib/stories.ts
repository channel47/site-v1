import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { marked } from "marked"

/**
 * Story content loader.
 *
 * Stories live as markdown in `content/stories/{skills,connectors}/` — one file
 * per asset, frontmatter schema documented in `content/README.md`. This module
 * is the single bridge between those files and the pages that render them:
 * everything is read at build time (the story routes are statically generated),
 * so the markdown folder stays the source of truth and adding a story is just
 * adding a file.
 */

export type StoryCategory = "skills" | "connectors"

export interface StoryAsset {
  name: string
  type: "skill" | "mcp"
  repo: string
  install: string
  package?: string
}

export interface StoryMeta {
  title: string
  slug: string
  description: string
  category: StoryCategory
  asset: StoryAsset
  author: string
  date: string
  tags: string[]
}

export interface Story extends StoryMeta {
  /** Markdown body rendered to HTML (trusted, first-party content). */
  html: string
}

const CONTENT_DIR = path.join(process.cwd(), "content", "stories")
const CATEGORIES: StoryCategory[] = ["skills", "connectors"]

/**
 * Curated display order within each category — flagship first for skills,
 * platforms by account ubiquity for connectors. Anything not listed (a future
 * story) sorts after, alphabetically, rather than breaking.
 */
const ORDER: string[] = [
  "creative-strategist",
  "media-buyer",
  "gaql",
  "content-miner",
  "kit-newsletter",
  "twitter-algorithm-optimizer",
  "google-ads-mcp",
  "meta-ads-mcp",
  "bing-ads-mcp",
  "linkedin-ads-mcp",
  "tiktok-ads-mcp",
  "pinterest-ads-mcp",
]

function rank(slug: string): number {
  const i = ORDER.indexOf(slug)
  return i === -1 ? ORDER.length : i
}

function loadStory(category: StoryCategory, file: string): Story {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, category, file), "utf8")
  const { data, content } = matter(raw)
  const meta = data as Omit<StoryMeta, "date"> & { date: string | Date }
  return {
    ...meta,
    category,
    tags: meta.tags ?? [],
    // YAML parses an unquoted `date:` as a Date object — normalize to ISO day.
    date:
      meta.date instanceof Date
        ? meta.date.toISOString().slice(0, 10)
        : String(meta.date),
    html: marked.parse(content, { async: false }),
  }
}

/** All stories, curated order — skills first, then connectors. */
export function getAllStories(): Story[] {
  return CATEGORIES.flatMap((category) =>
    fs
      .readdirSync(path.join(CONTENT_DIR, category))
      .filter((f) => f.endsWith(".md"))
      .map((f) => loadStory(category, f))
      .sort(
        (a, b) => rank(a.slug) - rank(b.slug) || a.title.localeCompare(b.title),
      ),
  )
}

export function getStoryBySlug(slug: string): Story | undefined {
  return getAllStories().find((s) => s.slug === slug)
}

/** "2026-07-02" → "Jul 2026" (browse-row date treatment). */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
}
