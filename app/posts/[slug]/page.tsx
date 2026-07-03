import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site/header"
import { SiteFooter } from "@/components/site/footer"
import { Capture } from "@/components/site/capture"
import {
  getAllPosts,
  getAssetForPost,
  getPostBySlug,
  shortDate,
} from "@/lib/content"

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
 * Post detail — the editorial single-column treatment from PLAN §5: title,
 * quiet byline, body, with a compact "introduces" strip up top linking the
 * asset the post is about. The strip points at the asset's page here (the
 * body carries the install walkthrough, so the strip stays a pointer).
 */
export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  const asset = getAssetForPost(post)
  const assetHref = asset
    ? `/${asset.type === "skill" ? "skills" : "connectors"}/${asset.slug}`
    : post.asset.repo

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell">
        <header className="st-head">
          <h1 className="serif st-h1">{post.title}</h1>
          <p className="st-byline mono">
            {post.author} · {shortDate(post.date)}
          </p>
          {asset ? (
            <Link href={assetHref} className="st-asset">
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
              className="st-asset"
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
      </article>

      <div className="st-shell st-post-capture">
        <Capture />
      </div>

      <div className="st-shell st-foot">
        <p className="st-foot-note">
          <Link href="/browse?type=posts" className="st-accent-link">
            ← More posts
          </Link>
        </p>
      </div>

      <SiteFooter />
    </div>
  )
}
