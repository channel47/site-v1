import Link from "next/link"

/**
 * The end-of-Note newsletter invitation — rendered by the template after
 * every Note's article, never authored in markdown. Quiet box, no fill,
 * no button: an invitation, not a sales block.
 */
export function NoteInvitation() {
  return (
    <div className="nt-invite">
      <p className="nt-invite-title">Want the next build when it ships?</p>
      <p className="nt-invite-body">
        Occasional emails about systems like this one — how they work, and the parts you can
        reuse in your own work.
      </p>
      <Link href="/newsletter" className="nt-invite-link">
        Get emails from the workshop →
      </Link>
    </div>
  )
}
