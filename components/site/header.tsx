import { GlitchLogo } from "@/components/landing/glitch-logo"
import { MarkLink } from "./mark-link"
import { NavDrawer } from "./nav-drawer"

/**
 * Sitewide header — logo-only + burger→drawer nav (round 12/14 standing
 * rule). On Home the mark is the animated GlitchLogo (replay-on-click easter
 * egg); on inner pages its job flips to navigation, so it renders as a
 * static link home.
 */
export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header className="sh st-shell">
      {home ? <GlitchLogo autoPlay /> : <MarkLink />}
      <NavDrawer />
    </header>
  )
}
