import { getFeedItems } from "@/lib/content"
import {
  CONTENT_GROUPS,
  MACHINE_SURFACES,
  PUBLIC_PAGES,
  absoluteUrl,
} from "@/lib/discovery"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"

/**
 * sitemap.md — the exhaustive, agent-readable discovery index. llms.txt is
 * the curated map; this is every public URL, grouped by type, with the
 * machine-surface documentation (twins, negotiation, search API) repeated at
 * the bottom so an agent landing here needs no second fetch to orient.
 */

export const dynamic = "force-static"

export function GET() {
  const items = getFeedItems()

  const row = (url: string, title: string, date?: string) =>
    `- [${title}](${url})${date ? ` — updated ${date}` : ""}`

  const lines = [
    `# ${SITE_NAME} — site index`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Pages",
    ...PUBLIC_PAGES.map((page) => row(absoluteUrl(SITE_URL, page.path), page.title)),
    "",
    ...CONTENT_GROUPS.flatMap((group) => [
      `## ${group.title}`,
      ...items.filter((item) => item.group === group.key).map((item) => row(`${SITE_URL}${item.href}`, item.title, item.date)),
      "",
    ]),
    "## Machine access",
    "",
    "Every project and note URL also serves clean markdown",
    "with YAML frontmatter — append `.md`, or send `Accept: text/markdown`",
    "to the canonical URL. JSON discovery and search are public and unauthenticated.",
    "",
    "```sh",
    `curl ${SITE_URL}/projects/creative-strategist.md`,
    `curl -H 'Accept: text/markdown' ${SITE_URL}/projects/creative-strategist`,
    `curl ${SITE_URL}/api`,
    `curl '${SITE_URL}/api/search?q=google%20ads'`,
    "```",
    "",
    `Other machine surfaces: ${MACHINE_SURFACES.filter((surface) => surface.path !== "/sitemap.md")
      .map((surface) => `[${surface.label}](${absoluteUrl(SITE_URL, surface.path)})`)
      .join(", ")}.`,
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
