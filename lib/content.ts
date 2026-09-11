import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { marked, Renderer } from "marked";
import { imageSize } from "image-size";
import {
  CONTENT_COLLECTION,
  type ContentFormat,
  type ContentGroup,
} from "./discovery";

/** The canonical two-collection loader. All navigation, feeds, metadata and
 * reading pages use this inventory; cover art is presentation, not content. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
const PUBLIC_DIR = path.join(process.cwd(), "public");
type ImageDimensions = { width: number; height: number };
const imageDimensions = new Map<string, { modified: number; dimensions: ImageDimensions }>();

/** Reserve an image's layout before its lazy request begins. Read only local
 * public assets; remote images never trigger a server-side fetch. */
function localImageDimensions(href: string): ImageDimensions | undefined {
  if (!href.startsWith("/") || href.startsWith("//")) return undefined;
  try {
    const file = path.resolve(PUBLIC_DIR, `.${decodeURIComponent(href.split(/[?#]/)[0])}`);
    if (!file.startsWith(PUBLIC_DIR + path.sep)) return undefined;
    const modified = fs.statSync(file).mtimeMs;
    const cached = imageDimensions.get(file);
    if (cached?.modified === modified) return cached.dimensions;
    const { width, height, orientation } = imageSize(fs.readFileSync(file));
    if (!(width > 0 && height > 0)) return undefined;
    // Browsers apply EXIF rotation; orientations 5–8 exchange the two axes.
    const rotated = orientation !== undefined && orientation >= 5;
    const dimensions = { width: rotated ? height : width, height: rotated ? width : height };
    imageDimensions.set(file, { modified, dimensions });
    return dimensions;
  } catch {
    // Missing/unsupported media retains its alt text and normal browser fallback.
    return undefined;
  }
}
const codeRenderer = new Renderer();
marked.use({
  renderer: {
    code(token) {
      return `<div class="st-code">${codeRenderer.code(token)}<span class="code-copy"></span></div>\n`;
    },
    image({ href, text, title }) {
      const alt = escapeHtml(text);
      const src = escapeHtml(href);
      const dimensions = localImageDimensions(href);
      const portrait = dimensions && dimensions.height > dimensions.width;
      const attributes = dimensions
        ? ` width="${dimensions.width}" height="${dimensions.height}"${portrait ? ' data-orientation="portrait"' : ""}`
        : "";
      // The image and its caption inherit the same portrait width calculation.
      const figureStyle = portrait ? ` style="--media-ratio:${dimensions.width / dimensions.height}"` : "";
      const image = `<img src="${src}" alt="${alt}"${attributes} loading="lazy" decoding="async" />`;
      const caption = text
        ? `<figcaption class="st-shot-cap">${alt}</figcaption>`
        : "";
      return title?.trim().toLowerCase() === "screenshot"
        ? `<figure class="st-shot"${figureStyle}>${image}${caption}</figure>`
        : `<figure class="st-media"${figureStyle}>${image}${caption}</figure>`;
    },
    paragraph({ tokens }) {
      if (tokens.length === 1 && tokens[0].type === "image")
        return this.parser.parseInline(tokens);
      return `<p>${this.parser.parseInline(tokens)}</p>`;
    },
  },
});

export function renderArticleMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false });
}

export interface FaqItem {
  q: string;
  a: string;
}
export interface NoteVideo {
  src: string;
  poster: string;
  captions: string;
  duration: string;
  /** Preserve the video's original date when it moves to another article. */
  uploadDate?: string;
  caption?: string;
}
export interface Note {
  title: string;
  slug: string;
  description: string;
  date: string;
  /** Date of a substantive revision; publication order and RSS identity stay put. */
  updated?: string;
  /** The specific reason to follow this piece, followed by the shared cadence. */
  newsletter?: string;
  tags: string[];
  preview?: { src: string; alt: string };
  video?: NoteVideo;
  faqs?: FaqItem[];
  sanitized?: boolean;
  /** Retain a historical feed identity when a source file moves. */
  rssId?: string;
  html: string;
  markdown: string;
}
export interface Project extends Note {
  status?: "experiment" | "in-progress" | "available" | "archived";
  repo?: string;
  install?: string;
  package?: string;
  pairing?: string;
}

/** A standalone Markdown link chooses the player's place in the reading page.
 * Keep the original link in Markdown/RSS; unplaced videos follow the story. */
export function splitArticleAtVideo(entry: Pick<Note, "html" | "markdown" | "video">) {
  const fallback = { beforeVideo: entry.html, afterVideo: "" };
  if (!entry.video) return fallback;
  const link = marked.lexer(entry.markdown).find((token) =>
    token.type === "paragraph" && token.tokens?.length === 1
    && token.tokens[0].type === "link" && token.tokens[0].href === entry.video?.src,
  );
  if (!link) return fallback;
  const placeholder = renderArticleMarkdown(link.raw);
  const index = entry.html.indexOf(placeholder);
  if (index < 0) return fallback;
  return {
    beforeVideo: entry.html.slice(0, index),
    afterVideo: entry.html.slice(index + placeholder.length),
  };
}

export const PROJECT_STATUS_LABELS = {
  experiment: "Experiment",
  "in-progress": "In progress",
  available: "Available",
  archived: "Archived",
} as const;

const CONTENT_DIR = path.join(process.cwd(), "content");
function loadCollection<T extends Note>(section: ContentGroup): T[] {
  const dir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(dir, file), "utf8"),
      );
      if (
        section === "projects" &&
        data.status &&
        !Object.hasOwn(PROJECT_STATUS_LABELS, data.status)
      ) {
        throw new Error(`Invalid project status in ${file}: ${data.status}`);
      }
      const slug = data.slug ?? file.replace(/\.md$/, "");
      if (!/^[a-z0-9-]+$/.test(slug))
        throw new Error(`Invalid content slug in ${file}`);
      for (const key of ["title", "description", "date"]) {
        if (!data[key]) throw new Error(`Missing ${key} in ${section}/${file}`);
      }
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
      const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : data.updated;
      if (updated !== undefined && (typeof updated !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(updated)
        || !Number.isFinite(Date.parse(updated)) || new Date(updated).toISOString().slice(0, 10) !== updated || updated < date)) {
        throw new Error(`Invalid revision date in ${section}/${file}`);
      }
      return {
        ...data,
        slug,
        tags: data.tags ?? [],
        date,
        updated,
        html: renderArticleMarkdown(content),
        markdown: content.trim(),
      } as T;
    })
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );
}
export const getNotes = cache(() => loadCollection<Note>("notes"));
export const getProjects = cache(() => loadCollection<Project>("projects"));
export const getNoteBySlug = cache((slug: string) =>
  getNotes().find((item) => item.slug === slug),
);
export const getProjectBySlug = cache((slug: string) =>
  getProjects().find((item) => item.slug === slug),
);
export const getContentEntries = cache(() => {
  const entries = [
    ...getProjects().map((item) => ({
      collection: CONTENT_COLLECTION.projects,
      item,
    })),
    ...getNotes().map((item) => ({
      collection: CONTENT_COLLECTION.notes,
      item,
    })),
  ].sort(
    (a, b) =>
      b.item.date.localeCompare(a.item.date) ||
      a.item.title.localeCompare(b.item.title),
  );
  const urls = new Set<string>();
  for (const { collection, item } of entries) {
    const url = `${collection.basePath}/${item.slug}`;
    if (urls.has(url)) throw new Error(`Duplicate content URL: ${url}`);
    urls.add(url);
  }
  return entries;
});

export interface FeedItem {
  title: string;
  description: string;
  href: string;
  /** Format is useful metadata; group is the public navigation section. */
  typeLabel: string;
  type: ContentFormat;
  group: ContentGroup;
  date: string;
  updated?: string;
}

export const getFeedItems = cache((): FeedItem[] =>
  getContentEntries().map(({ collection, item }) => ({
    title: item.title,
    description: item.description,
    href: `${collection.basePath}/${item.slug}`,
    typeLabel: collection.singularLabel,
    type: collection.key,
    group: collection.group,
    date: item.date,
    updated: item.updated,
  })),
);

/** The newest note leads automatically. An optional preview selects a real
 * result; ordinary markdown images and video posters need no extra fields. */
export function getEntryPreview(
  item: Note | Project,
): { src: string; alt: string } | undefined {
  if (item.preview) return item.preview;
  if (item.video)
    return { src: item.video.poster, alt: item.video.caption ?? item.title };
  let preview: { src: string; alt: string } | undefined;
  marked.walkTokens(marked.lexer(item.markdown), (token) => {
    if (
      !preview &&
      token.type === "image" &&
      !token.href.startsWith("placeholder:")
    ) {
      preview = { src: token.href, alt: token.text };
    }
  });
  return preview;
}

/** Related reading uses authored links and shared tags, with recency as a
 * tie-breaker. Prefer a note about the work; never suggest the current page. */
export function getNextRead(href: string): FeedItem | undefined {
  const entries = getContentEntries();
  const current = entries.find(
    ({ collection, item }) => `${collection.basePath}/${item.slug}` === href,
  );
  if (!current) return undefined;
  const candidates = entries
    .flatMap(({ collection, item }) => {
      const candidateHref = `${collection.basePath}/${item.slug}`;
      if (candidateHref === href) return [];
      const score =
        item.tags.filter((tag) => current.item.tags.includes(tag)).length +
        (current.item.markdown.includes(`](${candidateHref})`) ? 4 : 0) +
        (item.markdown.includes(`](${href})`) ? 4 : 0);
      return score
        ? [{ href: candidateHref, group: collection.group, score }]
        : [];
    })
    .sort(
      (a, b) =>
        Number(b.group === "notes") - Number(a.group === "notes") ||
        b.score - a.score,
    );
  return getFeedItems().find((item) => item.href === candidates[0]?.href);
}

/** Word count / 200wpm, rounded up to at least 1 — the post byline's read time. */
export function readTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "2026-07-02" → "Jul 2026" (browse-row date treatment). */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
