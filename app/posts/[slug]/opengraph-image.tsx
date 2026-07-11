import { getAllPosts, getPostBySlug } from "@/lib/content"
import { OG_CONTENT_TYPE, OG_SIZE, TYPE_ACCENTS, renderOgImage } from "@/lib/og-image"
import { SITE_NAME } from "@/lib/seo"

export const alt = SITE_NAME
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return renderOgImage({
    kicker: "Post",
    title: post?.title ?? SITE_NAME,
    description: post?.description,
    accent: TYPE_ACCENTS.post,
  })
}
