import Link from "next/link"
import { SiteHeader } from "./header"
import { SiteFooter } from "./footer"
import { Capture } from "@/components/site/capture"
import { getPostsForAsset, shortDate, type Asset } from "@/lib/content"

/**
 * The shared Skill/Connector detail shell (PLAN §5): what it does → how to
 * install → the asset itself (repo + install command) → related posts that
 * use it → email capture. Agents inherit this template when the type launches.
 */
export function AssetPage({ asset }: { asset: Asset }) {
  const related = getPostsForAsset(asset)
  const typeLabel = asset.type === "skill" ? "Skill" : "MCP connector"

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell">
        <header className="st-head">
          <p className="st-group-title mono">{typeLabel}</p>
          <h1 className="serif st-h1 as-h1">{asset.title}</h1>
          <p className="st-intro">{asset.description}</p>
        </header>

        <div
          className="st-prose"
          // First-party markdown from content/ — rendered at build time.
          dangerouslySetInnerHTML={{ __html: asset.html }}
        />

        <section className="as-grab" aria-label="Install">
          <h2 className="st-group-title mono">Grab it</h2>
          <pre className="as-install">
            <code>{asset.install}</code>
          </pre>
          <p className="as-repo">
            <a
              href={asset.repo}
              target="_blank"
              rel="noopener"
              className="st-accent-link"
            >
              Source on GitHub →
            </a>
            {asset.package ? (
              <span className="mono as-pkg">{asset.package}</span>
            ) : null}
          </p>
        </section>

        {related.length > 0 ? (
          <section className="as-related" aria-label="Related posts">
            <h2 className="st-group-title mono">The story behind it</h2>
            <ul className="st-rows">
              {related.map((post) => (
                <li key={post.slug}>
                  <Link href={`/posts/${post.slug}`} className="st-row">
                    <span className="st-row-main">
                      <span className="st-row-title serif">{post.title}</span>
                      <span className="st-row-desc">{post.description}</span>
                    </span>
                    <span className="st-row-meta mono">
                      Post · {shortDate(post.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="st-post-capture">
          <Capture />
        </div>
      </article>

      <SiteFooter />
    </div>
  )
}
