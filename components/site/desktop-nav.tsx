import Link from "next/link"

/**
 * Desktop-only inline primary nav (≥768px) — the burger/drawer stays mobile
 * (nav-drawer.tsx). v2.1 locks the nav to exactly three destinations: home
 * (the logo), Browse all, and Subscribe. The Subscribe ghost button fills
 * on hover like any ghost CTA — the working-session offer is demoted out
 * of the nav and lives on /session, linked from the footer's "Live" group.
 */
export function DesktopNav() {
  return (
    <nav className="sh-nav" aria-label="Primary">
      <Link href="/browse" className="sh-nav-link">
        Browse all
      </Link>
      <Link href="/newsletter" className="sh-nav-ghost">
        Subscribe
      </Link>
    </nav>
  )
}
