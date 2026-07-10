import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AssetPage } from "@/components/site/asset-page"
import { getAssetBySlug, getAssets } from "@/lib/content"
import { assetMetadata } from "@/lib/seo"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAssets("skill").map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const asset = getAssetBySlug("skill", slug)
  return asset ? assetMetadata(asset, "skill") : {}
}

export default async function SkillPage({ params }: Props) {
  const { slug } = await params
  const asset = getAssetBySlug("skill", slug)
  if (!asset) notFound()
  return <AssetPage asset={asset} />
}
