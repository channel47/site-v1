import { getAllPosts, getAssets } from "@/lib/content"
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
    `- Posts (first-person stories behind each tool): \`${SITE_URL}/posts/<slug>\``,
    `- Skills (installable agent skills): \`${SITE_URL}/skills/<slug>\``,
    `- Connectors (MCP servers for ad platforms): \`${SITE_URL}/connectors/<slug>\``,
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
    // Title-only rows keep the file map-sized (~4KB); descriptions live in
    // sitemap.md and each twin's frontmatter.
    "## Posts",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/posts/${p.slug}.md)`),
    "",
    "## Optional",
    `- [About](${SITE_URL}/about): who runs this (Jackson Dean) and why it exists`,
    `- [Live sessions](${SITE_URL}/workshops): monthly build-alongs, replays inside Vibe Marketers`,
    `- [Skills index](${SITE_URL}/skills): flat HTML list of every skill`,
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
