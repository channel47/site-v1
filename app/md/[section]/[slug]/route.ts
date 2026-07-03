import {
  getAllPosts,
  getAssetBySlug,
  getAssets,
  getPostBySlug,
} from "@/lib/content"
import { assetTwin, postTwin } from "@/lib/markdown-twin"

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
    ...getAllPosts().map((p) => ({ section: "posts", slug: p.slug })),
    ...getAssets("skill").map((a) => ({ section: "skills", slug: a.slug })),
    ...getAssets("connector").map((a) => ({
      section: "connectors",
      slug: a.slug,
    })),
  ]
}

export async function GET(_req: Request, { params }: Params) {
  const { section, slug } = await params

  let twin: string | undefined
  if (section === "posts") {
    const post = getPostBySlug(slug)
    twin = post && postTwin(post)
  } else if (section === "skills" || section === "connectors") {
    const asset = getAssetBySlug(section === "skills" ? "skill" : "connector", slug)
    twin = asset && assetTwin(asset)
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
