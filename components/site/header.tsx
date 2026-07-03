import Link from "next/link"
import { GlitchLogo } from "@/components/landing/glitch-logo"
import { MarkLink } from "./mark-link"

/**
 * Sitewide header — the "47" mark plus plain text links (PLAN §3: the
 * icon-with-reveal nav was dropped under the strip-down doctrine). On Home the
 * mark is the animated GlitchLogo (replay-on-click easter egg); on inner pages
 * its job flips to navigation, so it renders as a static link home.
 */
export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header className="sh ea-shell">
      {home ? <GlitchLogo autoPlay /> : <MarkLink />}
      <nav className="sh-links" aria-label="Site">
        <Link href="/browse" className="sh-link mono">
          Browse
        </Link>
        <Link href="/workshops" className="sh-link mono">
          Live
        </Link>
        <Link href="/newsletter" className="sh-link mono">
          Newsletter
        </Link>
      </nav>
    </header>
  )
}
