import Link from "next/link"
import { NEXT_LIVE } from "@/lib/landing-content"

/**
 * The quiet "next live" strip (PLAN §5). A single low-key row announcing the
 * next workshop with a Join CTA. Collapses entirely when there's nothing
 * scheduled (NEXT_LIVE is null), so Home never shows a dead placeholder.
 */
export function NextLive() {
  if (!NEXT_LIVE) return null
  return (
    <Link
      href={NEXT_LIVE.href}
      className="nl-strip mono"
      target={NEXT_LIVE.href.startsWith("http") ? "_blank" : undefined}
      rel={NEXT_LIVE.href.startsWith("http") ? "noopener" : undefined}
    >
      <span className="nl-dot" aria-hidden />
      <span className="nl-label">Next live</span>
      <span className="nl-title">{NEXT_LIVE.title}</span>
      <span className="nl-date">{NEXT_LIVE.date}</span>
      <span className="nl-join">Join →</span>
    </Link>
  )
}
