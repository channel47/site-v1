import {
  getAllPosts,
  getAssetBySlug,
  getAssets,
  getBuildBySlug,
  getBuilds,
  getPostBySlug,
  getWorkshopBySlug,
  getWorkshops,
} from "@/lib/content"
import { CONTENT_COLLECTION } from "@/lib/discovery"
import { assetTwin, buildTwin, postTwin, workshopTwin } from "@/lib/markdown-twin"

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
  return [
    ...getBuilds().map((b) => ({
      section: CONTENT_COLLECTION.builds.segment,
      slug: b.slug,
    })),
    ...getAllPosts().map((p) => ({
      section: CONTENT_COLLECTION.posts.segment,
      slug: p.slug,
    })),
    ...getAssets("skill").map((a) => ({
      section: CONTENT_COLLECTION.skills.segment,
      slug: a.slug,
    })),
    ...getAssets("connector").map((a) => ({
      section: CONTENT_COLLECTION.connectors.segment,
      slug: a.slug,
    })),
    ...getWorkshops().map((w) => ({
      section: CONTENT_COLLECTION.workshops.segment,
      slug: w.slug,
    })),
  ]
}

export async function GET(_req: Request, { params }: Params) {
  const { section, slug } = await params

  let twin: string | undefined
  if (section === CONTENT_COLLECTION.builds.segment) {
    const build = getBuildBySlug(slug)
    twin = build && buildTwin(build)
  } else if (section === CONTENT_COLLECTION.posts.segment) {
    const post = getPostBySlug(slug)
    twin = post && postTwin(post)
  } else if (
    section === CONTENT_COLLECTION.skills.segment ||
    section === CONTENT_COLLECTION.connectors.segment
  ) {
    const asset = getAssetBySlug(
      section === CONTENT_COLLECTION.skills.segment ? "skill" : "connector",
      slug,
    )
    twin = asset && assetTwin(asset)
  } else if (section === CONTENT_COLLECTION.workshops.segment) {
    const workshop = getWorkshopBySlug(slug)
    twin = workshop && workshopTwin(workshop)
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
