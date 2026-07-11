import { getBuildBySlug, getBuilds } from "@/lib/content"
import { OG_CONTENT_TYPE, OG_SIZE, TYPE_ACCENTS, renderOgImage } from "@/lib/og-image"
import { SITE_NAME } from "@/lib/seo"

export const alt = SITE_NAME
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return getBuilds().map((b) => ({ slug: b.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const build = getBuildBySlug(slug)
  return renderOgImage({
    kicker: "Build",
    title: build?.title ?? SITE_NAME,
    description: build?.description,
    accent: TYPE_ACCENTS.build,
  })
}
