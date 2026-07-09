import { getAssetBySlug, getAssets } from "@/lib/content"
import { OG_CONTENT_TYPE, OG_SIZE, TYPE_ACCENTS, renderOgImage } from "@/lib/og-image"

export const alt = "Channel 47"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return getAssets("connector").map((a) => ({ slug: a.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const asset = getAssetBySlug("connector", slug)
  return renderOgImage({
    kicker: "Connector",
    title: asset?.title ?? "Channel 47",
    description: asset?.description,
    accent: TYPE_ACCENTS.connector,
  })
}
