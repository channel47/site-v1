import { getContentEntries } from "@/lib/content"
import { CONTENT_GROUPS } from "@/lib/discovery"
import { assetTwin, noteTwin, postTwin, workshopTwin } from "@/lib/markdown-twin"

/**
 * The markdown-twin endpoint. Agents reach it as `/posts/<slug>.md` (or via
 * `Accept: text/markdown` on the canonical URL) — middleware rewrites both
 * here. Twins are built from the same loaded content as the HTML pages and
 * pre-rendered at build time, so they can never drift.
 *
 * The internal /md/* path is robots-disallowed; the .md URLs are the public
 * surface (documented in llms.txt, sitemap.md, and /api).
 */

interface Params {
  params: Promise<{ section: string; slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getContentEntries().map(({ collection, item }) => ({ section: collection.group, slug: item.slug }))
}

export async function GET(_req: Request, { params }: Params) {
  const { section, slug } = await params
  if (!CONTENT_GROUPS.some((group) => group.key === section)) return new Response("Not found", { status: 404 })
  const entry = getContentEntries().find((e) => e.collection.group === section && e.item.slug === slug)
  let twin: string | undefined
  if (entry) {
    const item = entry.item
    if ("type" in item) twin = assetTwin(item)
    else if ("asset" in item) twin = postTwin(item)
    else if ("duration" in item) twin = workshopTwin(item)
    else twin = noteTwin(item, section as "notes" | "projects")
  }
  if (!twin) return new Response("Not found", { status: 404 })

  return new Response(twin, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Cheap to crawl: public + an hour is plenty for build-time content.
      "Cache-Control": "public, max-age=3600",
    },
  })
}
