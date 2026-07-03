import Link from "next/link"
import { LINKS, HOME } from "@/lib/site-content"

/**
 * Sitewide footer — links-only, the site's completeness + SEO layer (PLAN §3).
 * The Learn column lists populated types only; rows appear as types launch.
 * Glossary/FAQ links return when those pages exist. Social row grows as
 * profile URLs are confirmed — currently Skool only.
 */
export function SiteFooter() {
  return (
    <footer className="sf">
      <div className="sf-inner ea-shell">
        <div className="sf-brand">
          <svg
            viewBox="0 0 46 24"
            width={34}
            height={18}
            fill="currentColor"
            aria-hidden
          >
            <rect x="0" y="0" width="7" height="18" />
            <rect x="7" y="12" width="7" height="6" />
            <rect x="14" y="0" width="7" height="24" />
            <rect x="25" y="0" width="14" height="6" />
            <rect x="39" y="0" width="7" height="12" />
            <rect x="32" y="12" width="7" height="12" />
          </svg>
          <p className="sf-tag">{HOME.headline}</p>
          <p className="sf-by mono">by Jackson Dean</p>
        </div>

        <div className="sf-cols">
          <div className="sf-col">
            <h2 className="sf-col-title mono">Learn</h2>
            <Link href="/browse?type=posts" className="sf-link">
              Posts
            </Link>
            <Link href="/browse?type=skills" className="sf-link">
              Skills
            </Link>
            <Link href="/browse?type=connectors" className="sf-link">
              Connectors
            </Link>
          </div>
          <div className="sf-col">
            <h2 className="sf-col-title mono">Live</h2>
            <Link href="/workshops" className="sf-link">
              Workshops
            </Link>
            <a href={LINKS.join} target="_blank" rel="noopener" className="sf-link">
              Vibe Marketers →
            </a>
          </div>
          <div className="sf-col">
            <h2 className="sf-col-title mono">More</h2>
            <Link href="/about" className="sf-link">
              About
            </Link>
            <Link href="/browse" className="sf-link">
              Browse all
            </Link>
            <Link href="/newsletter" className="sf-link">
              Newsletter
            </Link>
            <Link href="/skills" className="sf-link">
              Skills index
            </Link>
          </div>
        </div>

        <div className="sf-legal">
          <p className="mono">© 2026 Channel47 · by Jackson Dean</p>
          <p className="mono">
            <a href={LINKS.join} target="_blank" rel="noopener" className="sf-link">
              Skool
            </a>
            <span className="sf-dot" aria-hidden>
              ·
            </span>
            <Link href="/privacy" className="sf-link">
              Privacy
            </Link>
            <span className="sf-dot" aria-hidden>
              ·
            </span>
            <Link href="/terms" className="sf-link">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
