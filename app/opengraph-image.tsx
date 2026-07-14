import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image"
import { HOME } from "@/lib/site-content"
import { SITE_NAME } from "@/lib/seo"

export const alt = SITE_NAME
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/**
 * Site-wide default — Next.js falls back to this for any route that doesn't
 * define its own opengraph-image (browse, newsletter, session, privacy, terms).
 */
export default async function Image() {
  return renderOgImage({
    kicker: SITE_NAME,
    title: HOME.headline,
    description: HOME.subhead,
  })
}
