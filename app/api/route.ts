import { CONTENT_GROUPS, CONTENT_COLLECTIONS, MACHINE_SURFACES } from "@/lib/discovery"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"

/**
 * /api — the machine discovery document (docs/AI-SEO.md): a stable,
 * versioned JSON declaration of what surfaces exist, in which formats, and
 * what an agent should do next. Resource patterns now describe the two canonical public sections.
 */

export const dynamic = "force-static"

export function GET() {
  return Response.json(
    {
      version: 2,
      name: `${SITE_NAME} Public API Discovery`,
      description: SITE_DESCRIPTION,
      baseUrl: SITE_URL,
      formats: {
        html: "text/html",
        markdown: "text/markdown",
        json: "application/json",
      },
      discovery: Object.fromEntries(
        MACHINE_SURFACES.map((surface) => [surface.key, surface.path]),
      ),
      resources: CONTENT_GROUPS.map((group) => ({
        name: group.key,
        description: group.desc,
        htmlPattern: `/${group.key}/:slug`,
        markdownPattern: `/${group.key}/:slug.md`,
        formats: CONTENT_COLLECTIONS.filter((collection) => collection.group === group.key).map((collection) => collection.searchType),
        visibility: "public",
      })),
      search: {
        endpoint: "/api/search",
        params: { q: "keyword query, required" },
        returns: "{ version, query, count, results: [{title, url, markdownUrl, type, group, description, date, storyDate?}] }",
        dates: "date is the publication date. Optional storyDate is the story's point in time (YYYY-MM or YYYY-MM-DD), used for the article byline and browsing order.",
      },
      nextActions: [
        "Read /sitemap.md for a markdown-oriented index of every public URL.",
        "Fetch any content URL with `.md` appended (or Accept: text/markdown) for low-token retrieval.",
        "Use /api/search?q=<query> for structured public JSON reads.",
      ],
    },
    {
      headers: { "Cache-Control": "public, max-age=3600" },
    },
  )
}
