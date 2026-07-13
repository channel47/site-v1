import Link from "next/link"

/**
 * The end-of-Build newsletter invitation — rendered by the template after
 * every Build's article, never authored in markdown. Quiet box, no fill,
 * no button: an invitation, not a sales block.
 */
export function BuildInvitation() {
  return (
    <div className="bd-invite">
      <p className="bd-invite-title">Want the next build when it ships?</p>
      <p className="bd-invite-body">
        Occasional emails about systems like this one — how they work, and the parts you can
        reuse in your own work.
      </p>
      <Link href="/newsletter" className="bd-invite-link">
        Get emails from the workshop →
      </Link>
    </div>
  )
}
