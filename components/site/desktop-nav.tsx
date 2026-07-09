import type { CSSProperties } from "react"
import Link from "next/link"
import { TYPE_COLORS } from "@/lib/site-content"

const LINKS = [
  { label: "Posts", href: "/browse?type=posts", type: "posts" },
  { label: "Skills", href: "/browse?type=skills", type: "skills" },
  { label: "Connectors", href: "/browse?type=connectors", type: "connectors" },
  { label: "Workshops", href: "/browse?type=workshops", type: "workshops" },
] as const

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
