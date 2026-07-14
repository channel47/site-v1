import { GitHubIcon } from "./social-icons"

/** "Source on GitHub" as its own hairline row (readability pass) — it used
 * to trail the share links; now it sits with the install/grab section on
 * pages whose content ships from a repo. */
export function SourceRow({ href }: { href: string }) {
  return (
    <a
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
    </a>
  )
}
