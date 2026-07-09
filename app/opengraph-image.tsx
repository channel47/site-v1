import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image"
import { HOME } from "@/lib/site-content"

export const alt = "Channel 47"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

/**
 * Site-wide default — Next.js falls back to this for any route that doesn't
 * define its own opengraph-image (about, browse, newsletter, privacy, terms).
 */
export default async function Image() {
  return renderOgImage({
    kicker: "Channel 47",
    title: HOME.headline,
    description: HOME.subhead,
  })
}
