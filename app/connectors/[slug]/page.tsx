import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AssetPage } from "@/components/site/asset-page"
import { getAssetBySlug, getAssets } from "@/lib/content"
import { assetMetadata } from "@/lib/seo"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAssets("connector").map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const asset = getAssetBySlug("connector", slug)
  return asset ? assetMetadata(asset, "MCP connector") : {}
}

export default async function ConnectorPage({ params }: Props) {
  const { slug } = await params
  const asset = getAssetBySlug("connector", slug)
  if (!asset) notFound()
  return <AssetPage asset={asset} />
}
