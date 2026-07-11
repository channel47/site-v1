import Link from "next/link"

/**
 * Desktop-only inline primary nav (≥768px) — the burger/drawer stays mobile
 * (nav-drawer.tsx). v2 locks the nav to exactly four destinations: home (the
 * logo), Browse all, Newsletter, and Book a session. "Newsletter" hovers to
 * the gold accent (the only nav link with a content-type hover); "Book a
 * session" is a hairline-bordered ghost button — filled is reserved for the
 * Cal.com action on /session.
 */
export function DesktopNav() {
  return (
    <nav className="sh-nav" aria-label="Primary">
      <Link href="/browse" className="sh-nav-link">
        Browse all
      </Link>
      <Link href="/newsletter" className="sh-nav-link sh-nav-link-accent">
        Newsletter
      </Link>
      <Link href="/session" className="sh-nav-ghost">
        Book a session
      </Link>
    </nav>
  )
}
