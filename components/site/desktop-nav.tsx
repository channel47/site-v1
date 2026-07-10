import type { CSSProperties } from "react"
import Link from "next/link"
import { CATEGORIES, TYPE_COLORS } from "@/lib/site-content"

const LINKS = CATEGORIES.map(({ title, href, key }) => ({
  label: title,
  href,
  type: key,
}))

/**
 * Desktop-only inline primary nav (≥768px) — the burger/drawer stays mobile
 * (nav-drawer.tsx). Each link hovers to its own content-type colour; "Browse
 * all" and the rest sit at reduced opacity so the four types read first.
 */
export function DesktopNav() {
  return (
    <nav className="sh-nav" aria-label="Primary">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="sh-nav-link"
          style={{ "--type-color": TYPE_COLORS[link.type] } as CSSProperties}
        >
          {link.label}
        </Link>
      ))}
      <Link href="/browse" className="sh-nav-link sh-nav-browse">
        Browse all →
      </Link>
    </nav>
  )
}
