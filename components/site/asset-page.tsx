import { Fragment, type CSSProperties } from "react"
import { marked } from "marked"
import { SiteHeader } from "./header"
import { SiteFooter } from "./footer"
import { BackToBrowse } from "./browse-navigation"
import { ReadingEnd } from "./reading-end"
import { CopyButton } from "@/components/site/copy-button"
import { Faq } from "@/components/site/faq"
import { ShareRow } from "@/components/site/share-row"
import { SourceRow } from "@/components/site/source-row"
import { JsonLd } from "@/components/site/json-ld"
import { assetGraph, SITE_URL, AUTHOR_NAME } from "@/lib/seo"
import { ASSET_DIRS, shortDate, type Asset } from "@/lib/content"
import { HOME, TYPE_COLORS } from "@/lib/site-content"

/** Project documentation starts with its purpose and installation, followed
 * by the authored explanation, real examples, and related reading. */
export function AssetPage({ asset }: { asset: Asset }) {
  const section = ASSET_DIRS[asset.type]
  const typeColor = TYPE_COLORS[section]
  const href = `/projects/${asset.slug}`

  return (
    <div className="st-page">
      <SiteHeader />

      <main className="st-shell st-shell-article" style={{ "--type-color": typeColor } as CSSProperties}>
        <article>
          <JsonLd data={assetGraph(asset)} />
          <header className="st-head">
            <BackToBrowse href="/browse?type=projects" className="reading-back">← All projects</BackToBrowse>
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

          <section className="as-grab project-install" aria-label="Install">
            <div className="as-install">
              <div className="as-install-head">
                <span className="as-install-label">Install</span>
                <CopyButton event="install_copy" title="Copy command" text={asset.install} />
              </div>
              <pre className="as-install-cmd">
                <code>{asset.install}</code>
              </pre>
            </div>
            {asset.repo ? <SourceRow href={asset.repo} /> : null}
            {asset.pairing ? (
              <p
                className="as-pairing"
                dangerouslySetInnerHTML={{
                  __html: marked.parseInline(asset.pairing, { async: false }),
                }}
              />
            ) : null}
          </section>

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
          ) : null}

          <div
            className="st-prose"
            // First-party markdown from content/ — rendered at build time.
            dangerouslySetInnerHTML={{ __html: asset.html }}
          />

          {asset.askAnswer ? (
            <div className="dt-qa" style={{ "--type-color": typeColor } as CSSProperties}>
              <div className="dt-qa-q">
                <p className="dt-qa-kicker">You ask</p>
                <p className="dt-qa-question">{asset.askAnswer.question}</p>
              </div>
              <div className="dt-qa-a">
                <p className="dt-qa-kicker">It answers</p>
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



          {asset.faqs?.length ? <Faq items={asset.faqs} /> : null}

          <ShareRow
            mdPath={`${href}.md`}
            url={`${SITE_URL}${href}`}
            title={asset.title}
          />

        </article>
        <ReadingEnd href={href} section="projects" />
      </main>

      <SiteFooter />
    </div>
  )
}
