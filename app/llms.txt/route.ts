import { getAllPosts, getAssets, getWorkshops } from "@/lib/content"
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
    `- ${SITE_URL}/api : public JSON discovery document (formats, route families, next actions)`,
    `- ${SITE_URL}/sitemap.md : markdown discovery index of every public URL`,
    `- ${SITE_URL}/sitemap.xml : XML sitemap for crawlers`,
    `- ${SITE_URL}/rss.xml : full-content RSS feed`,
    "",
    "Route families:",
    `- Skills (installable agent skills): \`${SITE_URL}/skills/<slug>\``,
    `- Connectors (MCP servers for ad platforms): \`${SITE_URL}/connectors/<slug>\``,
    `- Workshops (session notes): \`${SITE_URL}/workshops/<slug>\``,
    ...(posts.length > 0
      ? [`- Posts: \`${SITE_URL}/posts/<slug>\``]
      : []),
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
      (w) => `- [${w.title}](${SITE_URL}/workshops/${w.slug}): ${w.description}`,
    ),
    "",
    "## Optional",
    `- [About](${SITE_URL}/about): who maintains Channel47`,
    `- [Workshops](${SITE_URL}/browse?type=workshops): sessions hosted inside Vibe Marketers`,
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
