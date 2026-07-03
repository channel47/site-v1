import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AssetPage } from "@/components/site/asset-page"
import { getAssetBySlug, getAssets } from "@/lib/content"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAssets("connector").map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const asset = getAssetBySlug("connector", slug)
  if (!asset) return {}
  return {
    title: `${asset.title} — a Channel 47 MCP connector`,
    description: asset.description,
    alternates: { canonical: `/connectors/${asset.slug}` },
    openGraph: {
      title: asset.title,
      description: asset.description,
      url: `https://channel47.dev/connectors/${asset.slug}`,
      siteName: "Channel 47",
      type: "website",
    },
  }
}

export default async function ConnectorPage({ params }: Props) {
  const { slug } = await params
  const asset = getAssetBySlug("connector", slug)
  if (!asset) notFound()
  return <AssetPage asset={asset} />
}
