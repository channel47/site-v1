import { getNoteBySlug, getNotes } from "@/lib/content"
import { OG_CONTENT_TYPE, OG_SIZE, TYPE_ACCENTS, renderOgImage } from "@/lib/og-image"
import { SITE_NAME } from "@/lib/seo"

export const alt = SITE_NAME
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return getNotes().map((b) => ({ slug: b.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  return renderOgImage({
    kicker: "Note",
    title: note?.title ?? SITE_NAME,
    description: note?.description,
    accent: TYPE_ACCENTS.note,
  })
}
