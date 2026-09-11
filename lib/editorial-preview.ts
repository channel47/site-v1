import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { imageSize } from "image-size";
import { renderArticleMarkdown, type Project } from "./content";
import type { CollectionItem } from "./collection";

const SLUG = "vellum";
const HREF = `/preview/${SLUG}`;
const SOURCE = path.join(process.cwd(), "docs/content/2026-09-10-vellum-draft.md");
const MEDIA_DIR = path.join(path.dirname(SOURCE), "assets/vellum/2026-09-10");
const IMAGES = new Set([
  "x-all-grid.webp",
  "x-all-grid-detail.webp",
  "x-all-agent.webp",
  "x-all-disposal-viewer.webp",
]);

function isLocalPreview(slug: string): boolean {
  return process.env.NODE_ENV === "development" && slug === SLUG;
}

/** Only the local preview can read these explicitly allowed editorial assets. */
export function getEditorialPreviewImage(slug: string, file: string) {
  if (!isLocalPreview(slug) || !IMAGES.has(file)) return undefined;
  return fs.readFileSync(path.join(MEDIA_DIR, file));
}

/** One draft supplies both the article preview and its local collection card. */
export const getEditorialPreview = cache((slug: string) => {
  if (!isLocalPreview(slug)) return undefined;

  const source = fs.readFileSync(SOURCE, "utf8");
  const title = source.match(/^# (.+)$/m)?.[1];
  if (!title) throw new Error("The Vellum draft needs a title.");

  const markdown = source
    .split(/\n---\s*\n/)[0]
    .replace(/^# .+\n+/, "")
    .replace(/^> Unpublished working draft[^\n]*\n+/, "")
    .replaceAll("assets/vellum/2026-09-10/", `${HREF}/media/`)
    .trim();
  const html = renderArticleMarkdown(markdown).replace(
    /<img src="\/preview\/vellum\/media\/([a-z0-9-]+\.webp)"/g,
    (tag, filename: string) => {
      const image = getEditorialPreviewImage(slug, filename);
      if (!image) throw new Error(`Unknown draft image: ${filename}`);
      const { width, height } = imageSize(image);
      return `${tag} width="${width}" height="${height}"`;
    },
  );

  const entry: Project = {
    title,
    slug,
    description: "I'm building Vellum while making product images for the Shopify site I just rebuilt.",
    date: "2026-09-10", // Working date; the preview omits publication metadata.
    tags: [],
    status: "in-progress",
    html,
    markdown,
  };
  const cover: CollectionItem = {
    id: "vellum-draft",
    href: HREF,
    title,
    label: "Vellum · Unpublished draft",
    src: "/collection/vellum-contact-sheet.webp",
    srcSet: "/collection/vellum-contact-sheet-480.webp 480w, /collection/vellum-contact-sheet.webp 960w",
    angle: -2,
    silhouette: "inset(8.8% 8.7% 8.8% 8.8% round 0.6%)",
  };
  return { entry, cover };
});
