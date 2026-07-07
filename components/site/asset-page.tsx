import { Fragment, type CSSProperties } from "react"
import Link from "next/link"
import { SiteHeader } from "./header"
import { SiteFooter } from "./footer"
import { Capture } from "@/components/site/capture"
import { Crumb } from "@/components/site/crumb"
import { ShareRow } from "@/components/site/share-row"
import { JsonLd } from "@/components/site/json-ld"
import { assetGraph, SITE_URL, AUTHOR_NAME } from "@/lib/seo"
import { getPostsForAsset, shortDate, type Asset } from "@/lib/content"
import { TYPE_COLORS } from "@/lib/site-content"

/**
 * The shared Skill/Connector detail fold (round 13a, adopted): crumb → title
 * → one-liner → byline (specs collapsed into one line) → figure (only when a
 * real screenshot exists) → body → ask/answer (only when a real worked
 * example exists) → grab it → related posts → share → newsletter → back
 * link. Agents inherit this template when the type launches.
 */
export function AssetPage({ asset }: { asset: Asset }) {
  const related = getPostsForAsset(asset)
  const typeLabel = asset.type === "skill" ? "Skills" : "Connectors"
  const section = asset.type === "skill" ? "skills" : "connectors"
  const typeColor = asset.type === "skill" ? TYPE_COLORS.skills : TYPE_COLORS.connectors
  const href = `/${section}/${asset.slug}`

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell">
        <JsonLd data={assetGraph(asset)} />
        <header className="st-head">
          <Crumb
            typeLabel={typeLabel}
            typeHref={`/browse?type=${section}`}
            typeColor={typeColor}
            leaf={asset.slug}
          />
          <h1 className="serif st-h1 as-h1 an-blur">{asset.title}</h1>
          <p className="dt-oneliner an-up" style={{ animationDelay: ".3s" }}>
            {asset.description}
          </p>
          <p className="dt-byline an-up" style={{ animationDelay: ".45s" }}>
            {AUTHOR_NAME} · Shipped {shortDate(asset.date)} ·{" "}
            <a href={asset.repo} target="_blank" rel="noopener">
              Source on GitHub →
            </a>
          </p>
        </header>

        {asset.screenshot ? (
          <figure className="dt-figure an-up" style={{ animationDelay: ".55s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.screenshot} alt="" />
            {asset.screenshotCaption ? (
              <figcaption className="dt-figcaption">
                {asset.screenshotCaption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div
          className="st-prose"
          // First-party markdown from content/ — rendered at build time.
          dangerouslySetInnerHTML={{ __html: asset.html }}
        />

        {asset.askAnswer ? (
          <div className="dt-qa" style={{ "--type-color": typeColor } as CSSProperties}>
            <div className="dt-qa-q">
              <p className="dt-qa-kicker mono">You ask</p>
              <p className="dt-qa-question">{asset.askAnswer.question}</p>
            </div>
            <div className="dt-qa-a">
              <p className="dt-qa-kicker mono">It answers</p>
              <div className="dt-qa-table">
                {asset.askAnswer.rows.map((row, i) => (
                  <Fragment key={i}>
                    <div>{row.label}</div>
                    <div>{row.value}</div>
                    <div>{row.value2 ?? ""}</div>
                  </Fragment>
                ))}
              </div>
              <p className="dt-qa-caption">{asset.askAnswer.caption}</p>
            </div>
          </div>
        ) : null}

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

        <ShareRow
          mdPath={`/${section}/${asset.slug}.md`}
          url={`${SITE_URL}${href}`}
          title={asset.title}
        />

        <div className="st-post-capture">
          <Capture />
        </div>

        <p className="dt-back">
          <Link href={`/${section}`}>← All {section}</Link>
        </p>
      </article>

      <SiteFooter />
    </div>
  )
}
