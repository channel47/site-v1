import { CopyMarkdown } from "./copy-markdown"
import { CopyLink } from "./copy-link"

/** The share block closing every detail page (round 13a): copy actions on
 * the left, share-intent links on the right — real, functional URLs. */
export function ShareRow({
  mdPath,
  url,
  title,
}: {
  mdPath: string
  url: string
  title: string
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
