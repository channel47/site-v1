import { NextResponse, type NextRequest } from "next/server"
import { CONTENT_ROUTE_PATTERN } from "@/lib/discovery"

/**
 * Machine-format routing for content URLs (docs/AI-SEO.md, Layer 3).
 *
 * Two ways for an agent to get a page as markdown, both landing on the same
 * pre-rendered twin under /md/ (see app/md/[section]/[slug]/route.ts):
 *
 *   1. `<url>.md`                      /posts/foo.md → rewrite → /md/posts/foo
 *   2. `Accept: text/markdown` on the canonical URL itself
 *
 * Content routes answer with `Vary: Accept` so caches never hand markdown to
 * a browser or HTML to an agent that negotiated.
 */

export function proxy(req: NextRequest) {
  const match = CONTENT_ROUTE_PATTERN.exec(req.nextUrl.pathname)
  if (!match) return NextResponse.next()

  const [, section, slug, mdSuffix] = match
  const negotiated = (req.headers.get("accept") ?? "").includes("text/markdown")

  let res: NextResponse
  if (mdSuffix || negotiated) {
    const url = req.nextUrl.clone()
    url.pathname = `/md/${section}/${slug}`
    res = NextResponse.rewrite(url)
  } else {
    res = NextResponse.next()
  }
  res.headers.set("Vary", "Accept")
  return res
}

export const config = {
  matcher: [
    "/builds/:slug*",
    "/posts/:slug*",
    "/skills/:slug*",
    "/connectors/:slug*",
    "/workshops/:slug*",
  ],
}
