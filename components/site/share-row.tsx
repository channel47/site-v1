import { CopyButton } from "./copy-button"
import { XIcon, LinkedInIcon } from "./social-icons"

/** The share block closing every detail page — collapsed to one hairline
 * row in the readability pass: sentence-case "Share" label left; Copy page,
 * Copy link, and the share-intent icons right, all 36px boxed actions.
 * The source repo moved out to its own row (see source-row.tsx). */
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
      <span className="dt-share-label">Share</span>
      <div className="dt-share-actions">
        <CopyButton label="Copy page" title="Copy page as Markdown" fetchPath={mdPath} />
        <CopyButton boxed glyph="link" title="Copy link" text={url} />
        <a
          href={tweetHref}
          target="_blank"
          rel="noopener"
          className="icon-btn dt-share-btn"
          title="Share on X"
          aria-label="Share on X"
        >
          <XIcon size={13} />
        </a>
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener"
          className="icon-btn dt-share-btn"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <LinkedInIcon size={13} />
        </a>
      </div>
    </div>
  )
}
