import { CopyButton } from "./copy-button"
import { LinkedinLogo, XLogo } from "@phosphor-icons/react/dist/ssr"
import { taggedShareUrl } from "@/lib/measurement"

/** One compact group of sharing actions at the end of a piece. */
export function ShareRow({
  mdPath,
  url,
  title,
}: {
  mdPath: string
  url: string
  title: string
}) {
  const path = new URL(url).pathname
  const tweetHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    taggedShareUrl(path, "x"),
  )}&text=${encodeURIComponent(title)}`
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    taggedShareUrl(path, "linkedin"),
  )}`

  return (
    <div className="dt-share">
      <span className="dt-share-label">Share</span>
      <div className="dt-share-actions">
        <CopyButton event="page_copy" label="Copy page" title="Copy page as Markdown" fetchPath={mdPath} />
        <CopyButton event="link_copy" glyph="link" title="Copy link" text={url} />
        <a
          href={tweetHref}
          target="_blank"
          rel="noopener"
          className="icon-btn"
          title="Share on X"
          aria-label="Share on X"
        >
          <XLogo size={18} aria-hidden="true" />
        </a>
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener"
          className="icon-btn"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <LinkedinLogo size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
