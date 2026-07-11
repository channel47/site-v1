"use client"

import { useState } from "react"
import Link from "next/link"
import { LINKS } from "@/lib/site-content"
import { ThemeToggle } from "./theme-toggle"
import { XIcon, GitHubIcon, LinkedInIcon, SkoolIcon } from "./social-icons"

const SOCIALS = [
  { href: LINKS.x, label: "X", Icon: XIcon },
  { href: LINKS.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: LINKS.github, label: "GitHub", Icon: GitHubIcon },
  { href: LINKS.join, label: "Skool", Icon: SkoolIcon },
] as const

const GROUPS = [
  {
    key: "learn",
    label: "Learn",
    links: [
      { href: "/browse?type=skills", label: "Skills" },
      { href: "/browse?type=connectors", label: "Connectors" },
    ],
  },
  {
    key: "live",
    label: "Live",
    links: [
      { href: "/browse?type=workshops", label: "Workshops" },
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
    ],
  },
  {
    key: "formats",
    label: "Formats",
    links: [
      // Machine-readable surfaces (docs/AI-SEO.md Layer 3) — non-HTML route
      // handlers, not app pages, so these render as plain anchors, filenames
      // only (no "API"/"RSS" labels — an agent recognizes the path).
      { href: "/llms.txt", label: "llms.txt", plain: true },
      { href: "/rss.xml", label: "rss.xml", plain: true },
      { href: "/sitemap.md", label: "sitemap.md", plain: true },
    ],
  },
] as const

/**
 * Sitewide footer — one horizontal row of group toggles over one panel per
 * group (exclusive: opening a group closes whichever was open). Every panel
 * stays mounted so closing collapses through the same grid-rows transition
 * it opened with, instead of unmounting and snapping shut.
 */
export function SiteFooter() {
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  return (
    <footer className="sf">
      <div className="sf-inner st-shell st-shell-full">
        <div className="sf-nav">
          <div className="sf-toggles">
            {GROUPS.map((group) => (
              <button
                key={group.key}
                type="button"
                className="sf-group-toggle"
                aria-expanded={openGroup === group.key}
                onClick={() =>
                  setOpenGroup((k) => (k === group.key ? null : group.key))
                }
              >
                {group.label}
                <span className="sf-group-plus" aria-hidden>
                  +
                </span>
              </button>
            ))}
          </div>

          {GROUPS.map((group) => (
            <div
              key={group.key}
              className="uf-body"
              data-open={openGroup === group.key}
            >
              <div>
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
                    ) : "plain" in link && link.plain ? (
                      <a
                        key={link.href}
                        href={link.href}
                        className="sf-link mono"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="sf-link"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sf-social">
          <div className="sf-social-icons">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                className="sf-icon"
                aria-label={label}
                title={label}
              >
                <Icon />
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>

        <div className="sf-legal">
          <p>© 2026 Channel47 · by Jackson Dean</p>
          <p>
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
