import { notFound } from "next/navigation";
import { PiecePage } from "@/components/site/piece-page";
import { getProjects, getProjectBySlug } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
interface Props {
  params: Promise<{ slug: string }>;
}
export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const item = getProjectBySlug((await params).slug);
  return item
    ? pageMetadata({
        title: item.title,
        description: item.description,
        path: `/projects/${item.slug}`,
      })
    : {};
}
export default async function ProjectDetail({ params }: Props) {
  const item = getProjectBySlug((await params).slug);
  if (!item) notFound();
  return <PiecePage entry={item} section="projects" />;
}
