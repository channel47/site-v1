import { notFound } from "next/navigation";
import { PiecePage } from "@/components/site/piece-page";
import { getEditorialPreview } from "@/lib/editorial-preview";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const draft = getEditorialPreview((await params).slug);
  if (!draft) notFound();
  return {
    ...pageMetadata({
      title: draft.entry.title,
      description: draft.entry.description,
      path: draft.cover.href,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function DraftPreview({ params }: Props) {
  const draft = getEditorialPreview((await params).slug);
  if (!draft) notFound();
  return <PiecePage entry={draft.entry} section="projects" preview />;
}
