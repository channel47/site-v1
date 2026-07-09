import { getWorkshopBySlug, getWorkshops } from "@/lib/content"
import { OG_CONTENT_TYPE, OG_SIZE, TYPE_ACCENTS, renderOgImage } from "@/lib/og-image"

export const alt = "Channel 47"
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
    title: workshop?.title ?? "Channel 47",
    description: workshop?.description,
    accent: TYPE_ACCENTS.workshop,
  })
}
