import { notFound } from "next/navigation";
import { PiecePage } from "@/components/site/piece-page";
import { getNotes, getNoteBySlug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
interface Props {
  params: Promise<{ slug: string }>;
}
export function generateStaticParams() {
  return getNotes().map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const item = getNoteBySlug((await params).slug);
  return item
    ? pageMetadata({
        title: item.title,
        description: item.description,
        path: `/notes/${item.slug}`,
        ogType: "article",
      })
    : {};
}
export default async function NoteDetail({ params }: Props) {
  const item = getNoteBySlug((await params).slug);
  if (!item) notFound();
  return <PiecePage entry={item} />;
}
