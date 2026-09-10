import { notFound } from "next/navigation"
import { getContentEntries } from "@/lib/content"
import { OG_CONTENT_TYPE, OG_SIZE, TYPE_ACCENTS, renderOgImage } from "@/lib/og-image"
import { SITE_NAME } from "@/lib/seo"
export const alt = SITE_NAME
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export function generateStaticParams() {
  return getContentEntries().filter((e) => e.collection.group === "projects").map(({ item }) => ({ slug: item.slug }))
}
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = getContentEntries().find((e) => e.collection.group === "projects" && e.item.slug === slug)
  if (!entry) notFound()
  return renderOgImage({ kicker: "Project", title: entry.item.title, description: entry.item.description, accent: TYPE_ACCENTS.project })
}
