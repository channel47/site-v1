import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BuildPage } from "@/components/site/build-page"
import { getBuildBySlug, getBuilds } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getBuilds().map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const build = getBuildBySlug(slug)
  if (!build) return {}
  return pageMetadata({
    title: build.title,
    description: build.description,
    path: `/builds/${build.slug}`,
    ogType: "article",
  })
}

export default async function BuildDetailPage({ params }: Props) {
  const { slug } = await params
  const build = getBuildBySlug(slug)
  if (!build) notFound()
  return <BuildPage build={build} />
}
