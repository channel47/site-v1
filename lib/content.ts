import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { marked } from "marked"

/**
 * Content loader — the single bridge between the markdown in `content/` and
 * the pages that render it. Everything is read at build time (all content
 * routes are statically generated), so the markdown folders stay the source
 * of truth and publishing is just adding a file.
 *
 *   content/posts/{skills,connectors}/   Posts — first-person stories, one per asset
 *   content/skills/                      Skill asset pages (hand-authored web copy;
 *   content/connectors/                  technical facts live in frontmatter)
 *
 * Frontmatter schemas are documented in `content/README.md`.
 */

// ---------------------------------------------------------------- posts

export type PostCategory = "skills" | "connectors"

export interface PostAsset {
  name: string
  type: "skill" | "mcp"
  repo: string
  install: string
  package?: string
  /** Override for the end-of-post cross-link card title — defaults to
   * "{name} — the {skill|connector} this story ships with". */
  cardTitle?: string
}

export interface PostMeta {
  title: string
  slug: string
  description: string
  category: PostCategory
  asset: PostAsset
  author: string
  date: string
  tags: string[]
}

export interface Post extends PostMeta {
  /** Markdown body rendered to HTML (trusted, first-party content). */
  html: string
  /** Raw markdown body — the source for machine surfaces (.md twins, RSS, search). */
  markdown: string
}

// ---------------------------------------------------------------- assets

export type AssetType = "skill" | "connector"

/** One row of the "ask/answer" example card on a Skill/Connector page. */
export interface AskAnswerRow {
  label: string
  value: string
  value2?: string
}

/** The optional ask/answer exchange (round 13a) — only renders when a page
 * has a real worked example; nothing here is invented from a template. */
export interface AskAnswer {
  question: string
  rows: AskAnswerRow[]
  caption: string
  /** Column header labels shown above the rows, e.g. ["Keyword", "QS",
   * "Impr"] — omitted when a plain label/value/value2 table needs no header. */
  columns?: [string, string, string]
}

export interface AssetMeta {
  title: string
  slug: string
  description: string
  type: AssetType
  repo: string
  install: string
  package?: string
  date: string
  tags: string[]
  /** Real screenshot path (public/) — when present, renders as the figure.
   * When absent but `screenshotCaption` is set, the figure still renders as
   * a riso-hatch placeholder captioned with what a screenshot would show;
   * when both are absent the figure is skipped entirely. */
  screenshot?: string
  screenshotCaption?: string
  askAnswer?: AskAnswer
  /** One sentence on what this asset pairs with and why — e.g. the
   * connector a skill needs, or the skill a connector's queries come from.
   * May contain a single markdown link. Replaces the old repo/package row. */
  pairing?: string
}

export interface Asset extends AssetMeta {
  html: string
  /** Raw markdown body — the source for machine surfaces (.md twins, RSS, search). */
  markdown: string
}

// ---------------------------------------------------------------- loading

const CONTENT_DIR = path.join(process.cwd(), "content")
const POST_CATEGORIES: PostCategory[] = ["skills", "connectors"]
const ASSET_DIRS: Record<AssetType, string> = {
  skill: "skills",
  connector: "connectors",
}

/**
 * Curated display order — flagship first for skills, platforms by account
 * ubiquity for connectors. Anything not listed (future content) sorts after,
 * alphabetically, rather than breaking. Shared by posts and assets since the
 * two libraries mirror each other one-to-one today.
 */
const ORDER: string[] = [
  "creative-strategist",
  "media-buyer",
  "gaql",
  "content-miner",
  "kit-newsletter",
  "twitter-algorithm-optimizer",
  "google-ads",
  "google-ads-mcp",
  "meta-ads",
  "meta-ads-mcp",
  "bing-ads",
  "bing-ads-mcp",
  "linkedin-ads",
  "linkedin-ads-mcp",
  "tiktok-ads",
  "tiktok-ads-mcp",
  "pinterest-ads",
  "pinterest-ads-mcp",
]

function rank(slug: string): number {
  const i = ORDER.indexOf(slug)
  return i === -1 ? ORDER.length : i
}

function byRank<T extends { slug: string; title: string }>(a: T, b: T): number {
  return rank(a.slug) - rank(b.slug) || a.title.localeCompare(b.title)
}

/** YAML parses an unquoted `date:` as a Date object — normalize to ISO day. */
function isoDate(value: string | Date): string {
  return value instanceof Date
    ? value.toISOString().slice(0, 10)
    : String(value)
}

function markdownFiles(...segments: string[]): string[] {
  const dir = path.join(CONTENT_DIR, ...segments)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"))
}

function loadPost(category: PostCategory, file: string): Post {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "posts", category, file),
    "utf8",
  )
  const { data, content } = matter(raw)
  const meta = data as Omit<PostMeta, "date"> & { date: string | Date }
  return {
    ...meta,
    category,
    tags: meta.tags ?? [],
    date: isoDate(meta.date),
    html: marked.parse(content, { async: false }),
    markdown: content.trim(),
  }
}

function loadAsset(type: AssetType, file: string): Asset {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, ASSET_DIRS[type], file),
    "utf8",
  )
  const { data, content } = matter(raw)
  const meta = data as Omit<AssetMeta, "date" | "type"> & {
    date: string | Date
  }
  return {
    ...meta,
    type,
    tags: meta.tags ?? [],
    date: isoDate(meta.date),
    html: marked.parse(content, { async: false }),
    markdown: content.trim(),
  }
}

/** All posts, curated order — skills stories first, then connectors. */
export function getAllPosts(): Post[] {
  return POST_CATEGORIES.flatMap((category) =>
    markdownFiles("posts", category)
      .map((f) => loadPost(category, f))
      .sort(byRank),
  )
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

/** All assets of one type, curated order. */
export function getAssets(type: AssetType): Asset[] {
  return markdownFiles(ASSET_DIRS[type])
    .map((f) => loadAsset(type, f))
    .sort(byRank)
}

// ---------------------------------------------------------------- workshops

/** A dated workshop session — upcoming until it airs, past once recorded
 * (round 15). No sessions are pinned yet, so `content/workshops/` is empty
 * and these all return `[]`; nothing here is invented ahead of a real date. */
export interface WorkshopMeta {
  title: string
  slug: string
  description: string
  status: "upcoming" | "past"
  /** Session date — the day it runs (upcoming) or was recorded (past). */
  date: string
  /** Start time, e.g. "12:00 PM ET" — upcoming only. */
  time?: string
  duration: string
  author: string
  tags: string[]
  /** The asset (skill/connector) this session builds with, if any. */
  relatedAsset?: { type: AssetType; slug: string }
  /** Real replay-still image path (public/), past sessions only — omitted
   * pages skip the figure rather than showing a placeholder. */
  screenshot?: string
  screenshotCaption?: string
}

export interface Workshop extends WorkshopMeta {
  html: string
  markdown: string
}

function loadWorkshop(file: string): Workshop {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "workshops", file), "utf8")
  const { data, content } = matter(raw)
  const meta = data as Omit<WorkshopMeta, "date"> & { date: string | Date }
  return {
    ...meta,
    tags: meta.tags ?? [],
    date: isoDate(meta.date),
    html: marked.parse(content, { async: false }),
    markdown: content.trim(),
  }
}

export function getWorkshops(): Workshop[] {
  return markdownFiles("workshops")
    .map((f) => loadWorkshop(f))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getWorkshopBySlug(slug: string): Workshop | undefined {
  return getWorkshops().find((w) => w.slug === slug)
}

export function getAssetBySlug(
  type: AssetType,
  slug: string,
): Asset | undefined {
  return getAssets(type).find((a) => a.slug === slug)
}

/** The asset a post introduces, if that asset has a page here. */
export function getAssetForPost(post: Post): Asset | undefined {
  const type: AssetType = post.asset.type === "skill" ? "skill" : "connector"
  return getAssetBySlug(type, post.asset.name)
}

/** Posts that introduce/use a given asset (matched on `asset.name`). */
export function getPostsForAsset(asset: Asset): Post[] {
  return getAllPosts().filter((p) => p.asset.name === asset.slug)
}

// ---------------------------------------------------------------- feed

/** One row in Browse / the Home "latest" feed — any content type. */
export interface FeedItem {
  title: string
  description: string
  href: string
  /** Row meta label, e.g. "Post", "Skill", "Connector". */
  typeLabel: string
  /** Browse filter key. */
  type: "posts" | "skills" | "connectors" | "workshops"
  date: string
}

export function getFeedItems(): FeedItem[] {
  const posts: FeedItem[] = getAllPosts().map((p) => ({
    title: p.title,
    description: p.description,
    href: `/posts/${p.slug}`,
    typeLabel: "Post",
    type: "posts",
    date: p.date,
  }))
  const skills: FeedItem[] = getAssets("skill").map((a) => ({
    title: a.title,
    description: a.description,
    href: `/skills/${a.slug}`,
    typeLabel: "Skill",
    type: "skills",
    date: a.date,
  }))
  const connectors: FeedItem[] = getAssets("connector").map((a) => ({
    title: a.title,
    description: a.description,
    href: `/connectors/${a.slug}`,
    typeLabel: "Connector",
    type: "connectors",
    date: a.date,
  }))
  const workshops: FeedItem[] = getWorkshops().map((w) => ({
    title: w.title,
    description: w.description,
    href: `/workshops/${w.slug}`,
    typeLabel: "Workshop",
    type: "workshops",
    date: w.date,
  }))
  return [...posts, ...skills, ...connectors, ...workshops]
}

/** Most recent items across every type — the Home feed. */
export function getLatest(n: number): FeedItem[] {
  return getFeedItems()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, n)
}

/** Word count / 200wpm, rounded up to at least 1 — the post byline's read time. */
export function readTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
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
