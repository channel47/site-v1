import { getAllPosts, getAssets, getWorkshops } from "@/lib/content"
import {
  CONTENT_COLLECTION,
  CONTENT_COLLECTIONS,
  MACHINE_SURFACES,
  PUBLIC_PAGES,
  absoluteUrl,
} from "@/lib/discovery"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"

/**
 * llms.txt — a curated markdown map for agents (llmstxt.org, extended with
 * operator hints: not just what exists, but what to fetch next). Generated
 * from the same content source as everything else, so it can't go stale.
 *
 * Honest calibration: no major answer engine has confirmed consuming this
 * file — but agentic tools fetch it today, it costs nothing to maintain, and
 * it documents every machine surface in one place.
 */

export const dynamic = "force-static"

export function GET() {
  const posts = getAllPosts()
  const skills = getAssets("skill")
  const connectors = getAssets("connector")
  const workshops = getWorkshops()

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Start here:",
    ...MACHINE_SURFACES.filter((surface) => surface.path !== "/llms.txt").map(
      (surface) =>
        `- ${absoluteUrl(SITE_URL, surface.path)} : ${surface.label} (${surface.description})`,
    ),
    "",
    "Route families:",
    ...CONTENT_COLLECTIONS.map(
      (collection) =>
        `- ${collection.routeDescription}: \`${absoluteUrl(SITE_URL, collection.basePath)}/<slug>\``,
    ),
    "",
    "Markdown twins:",
    "- Every content route above also serves clean markdown at the same URL + `.md`",
    "- `Accept: text/markdown` on the canonical URL returns the same markdown",
    "",
    "Public JSON APIs:",
    `- ${SITE_URL}/api/search?q=<query> : keyword search over all public content`,
    "",
    "## Skills",
    ...skills.map(
      (a) => `- [${a.title}](${SITE_URL}/skills/${a.slug}.md): ${a.description}`,
    ),
    "",
    "## Connectors",
    ...connectors.map(
      (a) =>
        `- [${a.title}](${SITE_URL}/connectors/${a.slug}.md): ${a.description}`,
    ),
    "",
    ...(posts.length > 0
      ? [
          "## Posts",
          ...posts.map((p) => `- [${p.title}](${SITE_URL}/posts/${p.slug}.md)`),
          "",
        ]
      : []),
    "## Workshops",
    ...workshops.map(
      (w) => `- [${w.title}](${SITE_URL}/workshops/${w.slug}.md): ${w.description}`,
    ),
    "",
    "## Optional",
    ...PUBLIC_PAGES.filter((page) => page.path === "/session").map(
      (page) => `- [${page.title}](${absoluteUrl(SITE_URL, page.path)}): ${page.description}`,
    ),
    `- [Workshop archive](${absoluteUrl(SITE_URL, CONTENT_COLLECTION.workshops.indexPath)}): sessions hosted inside Vibe Marketers`,
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
