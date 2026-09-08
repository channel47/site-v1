import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AssetPage } from "@/components/site/asset-page"
import { NotePage } from "@/components/site/note-page"
import { getAssets, getProjects, getContentEntries } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

interface Props { params: Promise<{ slug: string }> }
function findProject(slug: string) {
  return [...getProjects(), ...getAssets("skill"), ...getAssets("connector")].find((p) => p.slug === slug)
}
export function generateStaticParams() {
  return getContentEntries().filter((e) => e.collection.group === "projects").map(({ item }) => ({ slug: item.slug }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = findProject((await params).slug)
  if (!item) return {}
  return pageMetadata({ title: item.title, description: item.description, path: `/projects/${item.slug}` })
}
export default async function ProjectDetail({ params }: Props) {
  const item = findProject((await params).slug)
  if (!item) notFound()
  return "type" in item ? <AssetPage asset={item} /> : <NotePage note={item} section="projects" />
}
