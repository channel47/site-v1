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
import { postGraph, SITE_URL } from "@/lib/seo"
import {
  getAllPosts,
  getAssetForPost,
  getPostBySlug,
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
  return {
    title: `${post.title} — Channel 47`,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://channel47.dev/posts/${post.slug}`,
      siteName: "Channel 47",
      type: "article",
    },
  }
}

const ASSET_TYPE_LABEL = { skill: "Skill", mcp: "MCP connector" } as const

/**
 * Post detail (round 13a, the Post variant): crumb → headline-length title →
 * one-liner → byline (author · date · read time) → an "introduces" strip
 * pointing at the asset the post is about → body (the first blockquote reads
 * as the pull-quote) → share → newsletter → back link.
 */
export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  const asset = getAssetForPost(post)
  const assetType = post.asset.type === "skill" ? "skills" : "connectors"
  const assetHref = asset ? `/${assetType}/${asset.slug}` : post.asset.repo
  const href = `/posts/${post.slug}`

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell">
        <JsonLd data={postGraph(post)} />
        <header className="st-head">
          <Crumb
            typeLabel="Posts"
            typeHref="/browse?type=posts"
            typeColor={TYPE_COLORS.posts}
            leaf={post.slug}
          />
          <h1 className="serif st-h1 h1-post an-blur">{post.title}</h1>
          <p className="dt-oneliner an-up" style={{ animationDelay: ".3s" }}>
            {post.description}
          </p>
          <p className="dt-byline an-up" style={{ animationDelay: ".45s" }}>
            {post.author} · {shortDate(post.date)} · {readTime(post.markdown)} min
          </p>
          {asset ? (
            <Link
              href={assetHref}
              className="st-asset an-up"
              style={{ "--type-color": TYPE_COLORS[assetType], animationDelay: ".55s" } as CSSProperties}
            >
              <span className="st-asset-label mono">Introduces</span>
              <span className="st-asset-name mono">{post.asset.name}</span>
              <span className="st-asset-type mono">
                {ASSET_TYPE_LABEL[post.asset.type]} →
              </span>
            </Link>
          ) : (
            <a
              href={post.asset.repo}
              target="_blank"
              rel="noopener"
              className="st-asset an-up"
              style={{ animationDelay: ".55s" }}
            >
              <span className="st-asset-label mono">Introduces</span>
              <span className="st-asset-name mono">{post.asset.name}</span>
              <span className="st-asset-type mono">
                {ASSET_TYPE_LABEL[post.asset.type]} · GitHub →
              </span>
            </a>
          )}
        </header>

        <div
          className="st-prose"
          // First-party markdown from content/posts — rendered at build time.
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <ShareRow
          mdPath={`/posts/${post.slug}.md`}
          url={`${SITE_URL}${href}`}
          title={post.title}
        />

        <div className="st-post-capture">
          <Capture />
        </div>

        <p className="dt-back">
          <Link href="/browse?type=posts">← More posts</Link>
        </p>
      </article>

      <SiteFooter />
    </div>
  )
}
