import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AssetPage } from "@/components/site/asset-page"
import { getAssetBySlug, getAssets } from "@/lib/content"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAssets("skill").map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const asset = getAssetBySlug("skill", slug)
  if (!asset) return {}
  return {
    title: `${asset.title} — a Channel 47 skill`,
    description: asset.description,
    alternates: { canonical: `/skills/${asset.slug}` },
    openGraph: {
      title: asset.title,
      description: asset.description,
      url: `https://channel47.dev/skills/${asset.slug}`,
      siteName: "Channel 47",
      type: "website",
    },
  }
}

export default async function SkillPage({ params }: Props) {
  const { slug } = await params
  const asset = getAssetBySlug("skill", slug)
  if (!asset) notFound()
  return <AssetPage asset={asset} />
}
