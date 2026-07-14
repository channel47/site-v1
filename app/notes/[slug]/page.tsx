import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NotePage } from "@/components/site/note-page"
import { getNoteBySlug, getNotes } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getNotes().map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) return {}
  return pageMetadata({
    title: note.title,
    description: note.description,
    path: `/notes/${note.slug}`,
    ogType: "article",
  })
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) notFound()
  return <NotePage note={note} />
}
