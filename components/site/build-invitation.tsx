import Link from "next/link"

/**
 * The end-of-Build working-session invitation (spec 05) — rendered by the
 * template after every Build's article, never authored in markdown. Quiet
 * box, no fill, no button: an invitation, not a sales block.
 */
export function BuildInvitation() {
  return (
    <div className="bd-invite">
      <p className="bd-invite-title">Have a workflow you&apos;ve been thinking about?</p>
      <p className="bd-invite-body">
        Bring it to a working session and we&apos;ll explore how I&apos;d approach it using the
        tools you already work with.
      </p>
      <Link href="/session" className="bd-invite-link">
        Learn about working sessions →
      </Link>
    </div>
  )
}
