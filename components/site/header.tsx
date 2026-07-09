import { GlitchLogo } from "@/components/landing/glitch-logo"
import { MarkLink } from "./mark-link"
import { NavDrawer } from "./nav-drawer"
import { DesktopNav } from "./desktop-nav"

/**
 * Sitewide header. Mobile: logo + burger→drawer nav (round 12/14 standing
 * rule). Desktop (≥768px): logo + an inline primary nav instead — no burger.
 * Both navs render always; CSS shows exactly one per breakpoint so there's
 * no hydration-sensitive conditional. On Home the mark is the animated
 * GlitchLogo (replay-on-click easter egg); on inner pages its job flips to
 * navigation, so it renders as a static link home.
 */
export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header className="sh st-shell st-shell-full">
      {home ? <GlitchLogo autoPlay /> : <MarkLink />}
      <DesktopNav />
      <NavDrawer />
    </header>
  )
}
