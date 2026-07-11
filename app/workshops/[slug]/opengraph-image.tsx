import { getWorkshopBySlug, getWorkshops } from "@/lib/content"
import { OG_CONTENT_TYPE, OG_SIZE, TYPE_ACCENTS, renderOgImage } from "@/lib/og-image"
import { SITE_NAME } from "@/lib/seo"

export const alt = SITE_NAME
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return getWorkshops().map((w) => ({ slug: w.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshopBySlug(slug)
  return renderOgImage({
    kicker: "Workshop",
    title: workshop?.title ?? SITE_NAME,
    description: workshop?.description,
    accent: TYPE_ACCENTS.workshop,
  })
}
