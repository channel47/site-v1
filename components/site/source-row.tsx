import { GitHubIcon } from "./social-icons"
import { MeasuredLink } from "./measured-link"

/** A measured repository link beside the project's installation details. */
export function SourceRow({ href }: { href: string }) {
  return (
    <MeasuredLink
      event="repository_click"
      href={href}
      target="_blank"
      rel="noopener"
      className="dt-source"
      title="View source on GitHub"
    >
      <span className="dt-source-lead">
        <GitHubIcon size={15} />
        Source on GitHub
      </span>
      <span className="dt-source-arrow" aria-hidden>
        →
      </span>
    </MeasuredLink>
  )
}
