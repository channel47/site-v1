import { getAllPosts, getAssets } from "@/lib/content"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"

/**
 * sitemap.md — the exhaustive, agent-readable discovery index. llms.txt is
 * the curated map; this is every public URL, grouped by type, with the
 * machine-surface documentation (twins, negotiation, search API) repeated at
 * the bottom so an agent landing here needs no second fetch to orient.
 */

export const dynamic = "force-static"

export function GET() {
  const posts = getAllPosts()
  const skills = getAssets("skill")
  const connectors = getAssets("connector")

  const row = (url: string, title: string, date?: string) =>
    `- [${title}](${url})${date ? ` — updated ${date}` : ""}`

  const lines = [
    `# ${SITE_NAME} — site index`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Pages",
    row(`${SITE_URL}/`, "Home"),
    row(`${SITE_URL}/browse`, "Browse — the full library, filterable by type"),
    row(`${SITE_URL}/skills`, "Skills index"),
    row(`${SITE_URL}/workshops`, "Live sessions — monthly build-alongs"),
    row(`${SITE_URL}/newsletter`, "Newsletter"),
    row(`${SITE_URL}/about`, "About Channel 47 / Jackson Dean"),
    row(`${SITE_URL}/privacy`, "Privacy"),
    row(`${SITE_URL}/terms`, "Terms"),
    "",
    "## Skills",
    ...skills.map((a) => row(`${SITE_URL}/skills/${a.slug}`, a.title, a.date)),
    "",
    "## Connectors",
    ...connectors.map((a) =>
      row(`${SITE_URL}/connectors/${a.slug}`, a.title, a.date),
    ),
    "",
    "## Posts",
    ...posts.map((p) => row(`${SITE_URL}/posts/${p.slug}`, p.title, p.date)),
    "",
    "## Machine access",
    "",
    "Every post, skill, and connector URL also serves clean markdown with YAML",
    "frontmatter — append `.md`, or send `Accept: text/markdown` to the",
    "canonical URL. JSON discovery and search are public and unauthenticated.",
    "",
    "```sh",
    `curl ${SITE_URL}/skills/creative-strategist.md`,
    `curl -H 'Accept: text/markdown' ${SITE_URL}/skills/creative-strategist`,
    `curl ${SITE_URL}/api`,
    `curl '${SITE_URL}/api/search?q=google%20ads'`,
    "```",
    "",
    `Other machine surfaces: [llms.txt](${SITE_URL}/llms.txt),`,
    `[sitemap.xml](${SITE_URL}/sitemap.xml), [rss.xml](${SITE_URL}/rss.xml).`,
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
