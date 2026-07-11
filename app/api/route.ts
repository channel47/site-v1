import { CONTENT_COLLECTIONS, MACHINE_SURFACES } from "@/lib/discovery"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"

/**
 * /api — the machine discovery document (docs/AI-SEO.md, Layer 3): a stable,
 * versioned JSON declaration of what surfaces exist, in which formats, and
 * what an agent should do next. Bump `version` only on breaking shape
 * changes; additive fields are fine.
 */

export const dynamic = "force-static"

export function GET() {
  return Response.json(
    {
      version: 1,
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
      resources: CONTENT_COLLECTIONS.map((collection) => ({
        name: collection.key,
        description: collection.description,
        htmlPattern: collection.htmlPattern,
        markdownPattern: collection.markdownPattern,
        visibility: "public",
      })),
      search: {
        endpoint: "/api/search",
        params: { q: "keyword query, required" },
        returns: "{ version, query, count, results: [{title, url, markdownUrl, type, description, date}] }",
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
