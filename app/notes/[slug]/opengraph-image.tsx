import { notFound } from "next/navigation"
import { getContentEntries } from "@/lib/content"
import { getCollectionItems } from "@/lib/collection"
import { OG_CONTENT_TYPE, OG_SIZE, TYPE_ACCENTS, renderOgImage } from "@/lib/og-image"
import { SITE_NAME } from "@/lib/seo"
export const alt = SITE_NAME
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export function generateStaticParams() {
  return getContentEntries().filter((e) => e.collection.group === "notes").map(({ item }) => ({ slug: item.slug }))
}
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = getContentEntries().find((e) => e.collection.group === "notes" && e.item.slug === slug)
  if (!entry) notFound()
  const artwork = getCollectionItems().find((item) => item.href === `/notes/${slug}`)?.src
  return renderOgImage({ kicker: "Note", title: entry.item.title, description: entry.item.description, accent: TYPE_ACCENTS.note, artwork })
}
