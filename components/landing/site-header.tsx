import Link from "next/link"
import { GlitchLogo } from "./glitch-logo"
import { NAV_LINKS } from "@/lib/landing-content"

/**
 * Compact icon nav (PLAN §3): the "47" mark on the left, Browse · Live ·
 * Newsletter on the right. Each item is a real text link (not a tooltip) so it
 * stays crawlable and accessible; the label sits beside a small glyph and the
 * whole control keeps a 44px touch target. The six type-cards on Home are the
 * primary navigation, so the header deliberately doesn't repeat the six types.
 */

const ICONS: Record<string, React.ReactElement> = {
  Browse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="4.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="14.5" width="7" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="14.5" width="7" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  Live: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M6.5 6.5a7.8 7.8 0 0 0 0 11M17.5 6.5a7.8 7.8 0 0 1 0 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  Newsletter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 7 12 12.5 19.5 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

export function SiteHeader() {
  return (
    <nav className="ea-nav ea-shell" aria-label="Primary">
      <Link href="/" aria-label="Channel 47 — home" className="hdr-home">
        <GlitchLogo autoPlay />
      </Link>
      <ul className="hdr-links">
        {NAV_LINKS.map((item) => (
          <li key={item.label}>
            <Link className="hdr-link mono" href={item.href}>
              <span className="hdr-ico" aria-hidden>
                {ICONS[item.label]}
              </span>
              <span className="hdr-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
