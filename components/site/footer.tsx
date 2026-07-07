import Link from "next/link"
import { LINKS, HOME } from "@/lib/site-content"
import { Unfold } from "./unfold"
import { ThemeToggle } from "./theme-toggle"

const GROUPS = [
  {
    key: "learn",
    label: "Learn",
    links: [
      { href: "/browse?type=posts", label: "Posts" },
      { href: "/browse?type=skills", label: "Skills" },
      { href: "/browse?type=connectors", label: "Connectors" },
    ],
  },
  {
    key: "live",
    label: "Live",
    links: [
      { href: "/workshops", label: "Workshops" },
      { href: LINKS.join, label: "Vibe Marketers →", external: true },
    ],
  },
  {
    key: "more",
    label: "More",
    links: [
      { href: "/about", label: "About" },
      { href: "/browse", label: "Browse all" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/skills", label: "Skills index" },
    ],
  },
] as const

/**
 * Sitewide footer — the completeness + SEO layer (PLAN §3), now with
 * unfold link groups and the one shared sun toggle (round 12/14). The
 * social row grows past Skool as other profile URLs are confirmed — never
 * guess one.
 */
export function SiteFooter() {
  return (
    <footer className="sf">
      <div className="sf-inner st-shell">
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

        <div className="sf-groups">
          {GROUPS.map((group) => (
            <Unfold
              key={group.key}
              triggerClassName="sf-group-toggle"
              trigger={
                <>
                  {group.label}
                  <span className="sf-group-plus" aria-hidden>
                    +
                  </span>
                </>
              }
            >
              <div className="sf-group-links">
                {group.links.map((link) =>
                  "external" in link && link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener"
                      className="sf-link"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href} className="sf-link">
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </Unfold>
          ))}
        </div>

        <div className="sf-social">
          <div className="sf-social-icons">
            <a
              href={LINKS.join}
              target="_blank"
              rel="noopener"
              className="sf-link mono"
            >
              Skool
            </a>
          </div>
          <ThemeToggle />
        </div>

        <div className="sf-legal">
          <p className="mono">© 2026 Channel47 · by Jackson Dean</p>
          <p className="mono">
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
