import fs from "node:fs"
import path from "node:path"
import { cache } from "react"
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

/** Minimal HTML-attribute/text escape for values interpolated into the
 * renderer overrides below (alt text, captions) — markdown content is
 * trusted, but alt text can still contain `<`, `&`, or `"`. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Matches `placeholder:visual-01` (or any slug) — the Build-content
 * convention for a not-yet-shot figure. See content/README.md. */
const PLACEHOLDER_SCHEME = /^placeholder:(.+)$/

/** Matches a RESULTS-strip paragraph: `RESULTS · 243 · candidates, first run
 * | ~5 min · to surface them | ~1 hr · total setup`. Cells are `|`-separated,
 * each cell's big number and small label split on the first `·`. See
 * content/README.md. */
const RESULTS_STRIP = /^RESULTS\s*·\s*(.+)$/
/** Matches a STATUS-strip paragraph: `STATUS · Sourcing complete / human
 * review pending / outreach pending / interview results pending`. Steps are
 * `/`-separated. See content/README.md. */
const STATUS_STRIP = /^STATUS\s*·\s*(.+)$/

/** Matches the "Ships with this build" heading convention: an H2/H3 whose
 * text starts with "Ships with this build" (optionally "· sanitized" etc.) —
 * the immediately-following list renders as the bordered artifact box
 * instead of a normal prose list (`.bd-ships-h2 + ul` in globals.css). See
 * content/README.md. */
const SHIPS_HEADING = /^Ships with this build\b/

/** `243 · candidates, first run` → number/label cell of a RESULTS strip;
 * cells without a `·` render as a bare number with no label. */
function renderResultsStrip(body: string): string {
  const cells = body
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean)
    .map((cell) => {
      const [num, ...rest] = cell.split("·").map((part) => part.trim())
      const label = rest.join("·")
      return `<div class="bd-results-cell"><span class="bd-results-num">${escapeHtml(
        num,
      )}</span>${label ? `<span class="bd-results-label mono">${escapeHtml(label)}</span>` : ""}</div>`
    })
    .join("")
  return `<div class="bd-results">${cells}</div>`
}

/** `Sourcing complete / human review pending / …` → the STATUS strip's
 * slash-separated steps. */
function renderStatusStrip(body: string): string {
  const steps = body
    .split("/")
    .map((step) => step.trim())
    .filter(Boolean)
    .map((step) => `<span class="bd-status-step">${escapeHtml(step)}</span>`)
    .join("")
  return `<div class="bd-status mono"><span class="bd-status-label">Status</span>${steps}</div>`
}

/** "Framed still" image treatment — every `![alt](src)` in content markdown
 * renders as a hard-edged figure (see `.st-shot` in globals.css) instead of
 * a bare `<img>`, with the alt text doubling as a small mono figcaption.
 *
 * One exception: `![caption](placeholder:tag)` — used by Builds that haven't
 * captured real art yet — renders the striped accent placeholder slot
 * (`.st-placeholder-shot`) instead. Every other image src is untouched, so
 * this stays additive/inert for posts, skills, connectors, and workshops. */
marked.use({
  renderer: {
    image({ href, text }) {
      const alt = escapeHtml(text)
      const placeholderTag = PLACEHOLDER_SCHEME.exec(href)?.[1]
      if (placeholderTag) {
        const tag = escapeHtml(placeholderTag)
        const caption = text
          ? `<figcaption class="st-shot-cap">${alt}</figcaption>`
          : ""
        return `<figure class="st-shot"><div class="st-placeholder-shot"><span class="st-placeholder-tag mono">${tag}</span></div>${caption}</figure>`
      }
      const caption = text
        ? `<figcaption class="st-shot-cap">${alt}</figcaption>`
        : ""
      return `<figure class="st-shot"><div class="st-shot-field"><img src="${href}" alt="${alt}" loading="lazy" /></div>${caption}</figure>`
    },
    // An image on its own line parses as a paragraph containing a single
    // image token — unwrap it so the figure isn't nested inside a <p>,
    // which browsers treat as invalid and auto-close in weird places.
    //
    // A plain-text paragraph matching the RESULTS/STATUS strip convention
    // (Build-specific, see content/README.md) renders as its structured
    // strip instead of a <p> — inert for every other content type, since
    // ordinary prose never starts a line with "RESULTS ·" or "STATUS ·".
    paragraph({ tokens }) {
      if (tokens.length === 1 && tokens[0].type === "image") {
        return this.parser.parseInline(tokens)
      }
      if (tokens.length === 1 && tokens[0].type === "text") {
        const raw = (tokens[0] as { text: string }).text
        const results = RESULTS_STRIP.exec(raw)
        if (results) return renderResultsStrip(results[1])
        const status = STATUS_STRIP.exec(raw)
        if (status) return renderStatusStrip(status[1])
      }
      return `<p>${this.parser.parseInline(tokens)}</p>`
    },
    // The "Ships with this build" heading convention (Build-specific) tags
    // itself with a class so the following list can pick up the artifact-box
    // treatment via a `.bd-ships-h2 + ul` CSS sibling rule — every other
    // heading renders exactly as marked's default, just with an empty class.
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      const raw = tokens.map((t) => ("text" in t ? (t as { text: string }).text : "")).join("")
      const cls = SHIPS_HEADING.test(raw) ? ` class="bd-ships-h2"` : ""
      return `<h${depth}${cls}>${text}</h${depth}>`
    },
  },
})

// ---------------------------------------------------------------- posts

export type PostCategory = "skills" | "connectors"

export interface PostAsset {
  name: string
  type: "skill" | "mcp"
  repo: string
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

/** Canonical AssetType → URL path segment / display label — the one place
 * this mapping lives. Everything that needs "skill or connector, as a path
 * or a word" imports these rather than re-deriving them with a ternary. */
export const ASSET_DIRS: Record<AssetType, "skills" | "connectors"> = {
  skill: "skills",
  connector: "connectors",
}
export const ASSET_LABELS: Record<AssetType, string> = {
  skill: "Skill",
  connector: "Connector",
}

/** A post's `asset.type` uses the frontmatter spelling ("mcp" for
 * connectors); normalize it to the shared `AssetType` vocabulary. */
export function postAssetKind(type: PostAsset["type"]): AssetType {
  return type === "skill" ? "skill" : "connector"
}

/**
 * Curated display order — flagship first for skills, platforms by account
 * ubiquity for connectors. Anything not listed (future content) sorts after,
 * alphabetically, rather than breaking. Shared by posts and assets since the
 * two libraries mirror each other one-to-one today.
 */
const ORDER: string[] = [
  "creative-strategist",
  "brief-me",
  "ad-recon",
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

/** All posts, curated order — skills stories first, then connectors.
 * Cached: this reads and re-parses (incl. markdown→HTML) every post file, and
 * Next.js calls generateStaticParams/generateMetadata/the page separately for
 * the same route, so an uncached version repeats that work several times per
 * page during static generation. */
export const getAllPosts = cache((): Post[] => {
  return POST_CATEGORIES.flatMap((category) =>
    markdownFiles("posts", category)
      .map((f) => loadPost(category, f))
      .sort(byRank),
  )
})

export const getPostBySlug = cache((slug: string): Post | undefined => {
  return getAllPosts().find((p) => p.slug === slug)
})

/** All assets of one type, curated order. See getAllPosts re: caching. */
export const getAssets = cache((type: AssetType): Asset[] => {
  return markdownFiles(ASSET_DIRS[type])
    .map((f) => loadAsset(type, f))
    .sort(byRank)
})

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

export const getWorkshops = cache((): Workshop[] => {
  return markdownFiles("workshops")
    .map((f) => loadWorkshop(f))
    .sort((a, b) => b.date.localeCompare(a.date))
})

export const getWorkshopBySlug = cache((slug: string): Workshop | undefined => {
  return getWorkshops().find((w) => w.slug === slug)
})

// ---------------------------------------------------------------- builds

/** A Build — a long-form, single-page writeup of a real agentic system
 * Jackson has built and run, with results/status strips instead of the
 * install-facts frontmatter an Asset carries. Own shape (not an AssetType)
 * since Builds aren't installable code — see content/README.md. */
export interface BuildMeta {
  title: string
  slug: string
  description: string
  date: string
  tags: string[]
  /** Shown in the byline as "sanitized example" when true (the Build
   * convention for real-but-anonymized production systems). */
  sanitized?: boolean
}

export interface Build extends BuildMeta {
  html: string
  markdown: string
}

function loadBuild(file: string): Build {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "builds", file), "utf8")
  const { data, content } = matter(raw)
  const meta = data as Omit<BuildMeta, "date"> & { date: string | Date }
  return {
    ...meta,
    tags: meta.tags ?? [],
    date: isoDate(meta.date),
    html: marked.parse(content, { async: false }),
    markdown: content.trim(),
  }
}

export const getBuilds = cache((): Build[] => {
  return markdownFiles("builds")
    .map((f) => loadBuild(f))
    .sort((a, b) => b.date.localeCompare(a.date))
})

export const getBuildBySlug = cache((slug: string): Build | undefined => {
  return getBuilds().find((b) => b.slug === slug)
})

export const getAssetBySlug = cache(
  (type: AssetType, slug: string): Asset | undefined => {
    return getAssets(type).find((a) => a.slug === slug)
  },
)

/** The asset a post introduces, if that asset has a page here. */
export const getAssetForPost = cache((post: Post): Asset | undefined => {
  return getAssetBySlug(postAssetKind(post.asset.type), post.asset.name)
})

// ---------------------------------------------------------------- feed

/** One row in Browse / the Home "latest" feed — any content type. */
export interface FeedItem {
  title: string
  description: string
  href: string
  /** Row meta label, e.g. "Post", "Skill", "Connector". */
  typeLabel: string
  /** Browse filter key. */
  type: "posts" | "skills" | "connectors" | "workshops" | "builds"
  date: string
}

export const getFeedItems = cache((): FeedItem[] => {
  const builds: FeedItem[] = getBuilds().map((b) => ({
    title: b.title,
    description: b.description,
    href: `/builds/${b.slug}`,
    typeLabel: "Build",
    type: "builds",
    date: b.date,
  }))
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
  return [...builds, ...posts, ...skills, ...connectors, ...workshops]
})

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
