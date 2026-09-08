import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NotePage } from "@/components/site/note-page"
import WorkshopPage from "@/components/site/workshop-page"
import PostPage from "@/components/site/post-page"
import { getContentEntries, getNoteBySlug, getWorkshopBySlug, getPostBySlug } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

interface Props { params: Promise<{ slug: string }> }
export function generateStaticParams() {
  return getContentEntries().filter((e) => e.collection.group === "notes").map(({ item }) => ({ slug: item.slug }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = getNoteBySlug(slug) ?? getWorkshopBySlug(slug) ?? getPostBySlug(slug)
  if (!item) return {}
  return pageMetadata({ title: item.title, description: item.description, path: `/notes/${item.slug}`, ogType: "article" })
}
export default async function NoteDetail({ params }: Props) {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (note) return <NotePage note={note} />
  if (getWorkshopBySlug(slug)) return <WorkshopPage params={params} />
  if (getPostBySlug(slug)) return <PostPage params={params} />
  notFound()
}
