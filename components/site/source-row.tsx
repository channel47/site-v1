import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr"
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
        <GithubLogo size={18} aria-hidden="true" />
        Source on GitHub
      </span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </MeasuredLink>
  )
}
