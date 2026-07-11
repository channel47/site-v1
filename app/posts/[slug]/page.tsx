import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import { Crumb } from "@/components/site/crumb"
import { ShareRow } from "@/components/site/share-row"
import { JsonLd } from "@/components/site/json-ld"
import { pageMetadata, postGraph, SITE_URL } from "@/lib/seo"
import {
  ASSET_DIRS,
  ASSET_LABELS,
  getAllPosts,
  getAssetForPost,
  getPostBySlug,
  postAssetKind,
  readTime,
  shortDate,
} from "@/lib/content"
import { TYPE_COLORS } from "@/lib/site-content"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/posts/${post.slug}`,
    ogType: "article",
  })
}

/**
 * Post detail (round 14, confirmed): crumb → headline-length title →
 * one-liner → byline (author · date · read time) → body (the first
 * blockquote reads as the pull-quote) → a cross-link card to the asset this
 * story ships with → share → newsletter → back link.
 */
export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  const asset = getAssetForPost(post)
  const assetKind = postAssetKind(post.asset.type)
  const assetType = ASSET_DIRS[assetKind]
  const assetHref = asset ? `/${assetType}/${asset.slug}` : post.asset.repo
  const crossTitle =
    post.asset.cardTitle ??
    `${post.asset.name} — the ${assetKind} this story ships with`
  const crossStyle = { "--type-color": TYPE_COLORS[assetType] } as CSSProperties
  const crossContent = (
    <>
      <span>
        <span className="dt-cross-kicker mono">{ASSET_LABELS[assetKind]}</span>
        <p className="dt-cross-title">{crossTitle}</p>
      </span>
      <span aria-hidden>→</span>
    </>
  )
  const href = `/posts/${post.slug}`

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell" style={{ "--type-color": TYPE_COLORS.posts } as CSSProperties}>
        <JsonLd data={postGraph(post)} />
        <header className="st-head">
          <Crumb
            typeLabel="Posts"
            typeHref="/browse?type=posts"
            typeColor={TYPE_COLORS.posts}
            leaf={post.slug}
          />
          <h1 className="serif st-h1 h1-post an-blur">{post.title}</h1>
          <p className="dt-oneliner an-up" style={{ animationDelay: ".2s" }}>
            {post.description}
          </p>
          <p className="dt-byline an-up" style={{ animationDelay: ".32s" }}>
            {post.author} · {shortDate(post.date)} · {readTime(post.markdown)} min
          </p>
        </header>

        <div
          className="st-prose"
          // First-party markdown from content/posts — rendered at build time.
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {asset ? (
          <Link href={assetHref} className="dt-cross" style={crossStyle}>
            {crossContent}
          </Link>
        ) : (
          <a
            href={assetHref}
            target="_blank"
            rel="noopener"
            className="dt-cross"
            style={crossStyle}
          >
            {crossContent}
          </a>
        )}

        <ShareRow
          mdPath={`/posts/${post.slug}.md`}
          url={`${SITE_URL}${href}`}
          title={post.title}
        />

        <div className="st-post-capture">
          <Capture />
        </div>

        <p className="dt-back">
          <Link href="/browse?type=posts">← All posts</Link>
        </p>
      </article>

      <SiteFooter />
    </div>
  )
}
