import { Fragment, type CSSProperties } from "react"
import Link from "next/link"
import { marked } from "marked"
import { SiteHeader } from "./header"
import { SiteFooter } from "./footer"
import { Capture } from "@/components/site/capture"
import { Crumb } from "@/components/site/crumb"
import { ShareRow } from "@/components/site/share-row"
import { JsonLd } from "@/components/site/json-ld"
import { assetGraph, SITE_URL, AUTHOR_NAME } from "@/lib/seo"
import { ASSET_DIRS, shortDate, type Asset } from "@/lib/content"
import { HOME, TYPE_COLORS } from "@/lib/site-content"

/**
 * The shared Skill/Connector detail fold (round 14, confirmed): crumb →
 * title → one-liner → byline (specs collapsed into one line) → figure (real
 * screenshot, or a riso placeholder when there's a caption but no image yet)
 * → body → ask/answer (only when a real worked example exists) → grab it →
 * pairing note → share → newsletter → back link. Agents inherit this
 * template when the type launches.
 */
export function AssetPage({ asset }: { asset: Asset }) {
  const typeLabel = asset.type === "skill" ? "Skills" : "Connectors"
  const section = ASSET_DIRS[asset.type]
  const typeColor = TYPE_COLORS[section]
  const href = `/${section}/${asset.slug}`

  return (
    <div className="st-page">
      <SiteHeader />

      <article className="st-shell st-shell-article" style={{ "--type-color": typeColor } as CSSProperties}>
        <JsonLd data={assetGraph(asset)} />
        <header className="st-head">
          <Crumb
            typeLabel={typeLabel}
            typeHref={`/browse?type=${section}`}
            typeColor={typeColor}
            leaf={asset.slug}
          />
          <h1 className="serif st-h1 as-h1 an-blur">{asset.title}</h1>
          <p className="dt-oneliner an-up" style={{ animationDelay: ".2s" }}>
            {asset.description}
          </p>
          <p
            className="dt-byline dt-byline-author an-up"
            style={{ animationDelay: ".32s" }}
          >
            <img
              src={HOME.avatar}
              alt=""
              width={24}
              height={24}
              className="dt-byline-avatar"
            />
            <span>
              <span className="dt-byline-name">{AUTHOR_NAME}</span> ·{" "}
              {shortDate(asset.date)}
            </span>
          </p>
        </header>

        {asset.screenshot ? (
          <figure className="st-shot an-up" style={{ animationDelay: ".4s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="st-shot-field">
              <img
                src={asset.screenshot}
                alt={asset.screenshotCaption ?? ""}
                loading="lazy"
              />
            </div>
            {asset.screenshotCaption ? (
              <figcaption className="st-shot-cap">
                {asset.screenshotCaption}
              </figcaption>
            ) : null}
          </figure>
        ) : asset.screenshotCaption ? (
          <figure className="dt-figure an-up" style={{ animationDelay: ".4s" }}>
            <div className="dt-figure-hatch" aria-hidden>
              <span className="dt-figure-tag mono">FIG. 01</span>
            </div>
            <figcaption className="dt-figcaption">
              {asset.screenshotCaption}
            </figcaption>
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
                {asset.askAnswer.columns ? (
                  <>
                    {asset.askAnswer.columns.map((label, i) => (
                      <div key={i} className="dt-qa-head">
                        {label}
                      </div>
                    ))}
                  </>
                ) : null}
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
          <h2 className="st-section-h2">Grab it</h2>
          <pre className="as-install">
            <code>{asset.install}</code>
          </pre>
          {asset.pairing ? (
            <p
              className="as-pairing"
              dangerouslySetInnerHTML={{
                __html: marked.parseInline(asset.pairing, { async: false }),
              }}
            />
          ) : null}
        </section>

        <ShareRow
          mdPath={`/${section}/${asset.slug}.md`}
          url={`${SITE_URL}${href}`}
          title={asset.title}
          sourceHref={asset.repo}
        />

        <div className="st-post-capture">
          <Capture />
        </div>

        <p className="dt-back">
          <Link href={`/browse?type=${section}`}>← All {section}</Link>
        </p>
      </article>

      <SiteFooter />
    </div>
  )
}
