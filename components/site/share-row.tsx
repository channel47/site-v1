import { CopyMarkdown } from "./copy-markdown"
import { CopyLink } from "./copy-link"

/** The share block closing every detail page (round 13a, v2 byline pass):
 * copy actions on the left, the source repo (when the page has one) and
 * share-intent links on the right — real, functional URLs. */
export function ShareRow({
  mdPath,
  url,
  title,
  sourceHref,
}: {
  mdPath: string
  url: string
  title: string
  /** Repo link — moved here from the byline (v2). Asset pages only. */
  sourceHref?: string
}) {
  const tweetHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url,
  )}&text=${encodeURIComponent(title)}`
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url,
  )}`

  return (
    <div className="dt-share">
      <div className="dt-share-left">
        <span className="dt-share-label mono">Share</span>
        <CopyMarkdown path={mdPath} />
        <CopyLink url={url} />
      </div>
      <div className="dt-share-right">
        {sourceHref ? (
          <a
            href={sourceHref}
            target="_blank"
            rel="noopener"
            className="dt-share-link dt-share-source"
          >
            Source on GitHub →
          </a>
        ) : null}
        <a
          href={tweetHref}
          target="_blank"
          rel="noopener"
          className="dt-share-link"
        >
          X
        </a>
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener"
          className="dt-share-link"
        >
          LinkedIn
        </a>
      </div>
    </div>
  )
}
