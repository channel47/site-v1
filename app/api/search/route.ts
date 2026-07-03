import { getAllPosts, getAssets } from "@/lib/content"
import { SITE_URL } from "@/lib/seo"

/**
 * /api/search — public, unauthenticated keyword search over all published
 * content, so agents can query the site as a tool and answer with our URLs
 * attached as sources. Response shape is versioned and stable (documented in
 * /api); content is loaded from the same build-time source as the pages.
 */

interface Doc {
  title: string
  url: string
  markdownUrl: string
  type: "post" | "skill" | "connector"
  description: string
  date: string
  haystack: { title: string; tags: string; description: string; body: string }
}

function doc(
  type: Doc["type"],
  path: string,
  item: {
    title: string
    slug: string
    description: string
    date: string
    tags: string[]
    markdown: string
  },
): Doc {
  const url = `${SITE_URL}/${path}/${item.slug}`
  return {
    title: item.title,
    url,
    markdownUrl: `${url}.md`,
    type,
    description: item.description,
    date: item.date,
    haystack: {
      title: `${item.title} ${item.slug}`.toLowerCase(),
      tags: item.tags.join(" ").toLowerCase(),
      description: item.description.toLowerCase(),
      body: item.markdown.toLowerCase(),
    },
  }
}

function corpus(): Doc[] {
  return [
    ...getAllPosts().map((p) => doc("post", "posts", p)),
    ...getAssets("skill").map((a) => doc("skill", "skills", a)),
    ...getAssets("connector").map((a) => doc("connector", "connectors", a)),
  ]
}

/** Per-term field scoring; a doc must match every term somewhere to rank. */
function score(d: Doc, terms: string[]): number {
  let total = 0
  for (const term of terms) {
    let s = 0
    if (d.haystack.title.includes(term)) s += 4
    if (d.haystack.tags.includes(term)) s += 3
    if (d.haystack.description.includes(term)) s += 2
    if (d.haystack.body.includes(term)) s += 1
    if (s === 0) return 0
    total += s
  }
  return total
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? ""
  if (!q) {
    return Response.json(
      { version: 1, error: "Missing required query parameter: q" },
      { status: 400 },
    )
  }

  const terms = q.toLowerCase().split(/\s+/).slice(0, 8)
  const results = corpus()
    .map((d) => ({ d, s: score(d, terms) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || b.d.date.localeCompare(a.d.date))
    .slice(0, 20)
    .map(({ d }) => ({
      title: d.title,
      url: d.url,
      markdownUrl: d.markdownUrl,
      type: d.type,
      description: d.description,
      date: d.date,
    }))

  return Response.json(
    { version: 1, query: q, count: results.length, results },
    { headers: { "Cache-Control": "public, max-age=300" } },
  )
}
