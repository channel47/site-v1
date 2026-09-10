import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image"
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
    title: "Things I’m making and figuring out.",
    description: "I’m Jackson. I build software, experiment with AI, and write about what I learn along the way. channel47 is where I share the work.",
  })
}
