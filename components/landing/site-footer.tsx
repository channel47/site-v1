import Link from "next/link"
import { GlitchLogo } from "./glitch-logo"
import {
  FOOTER_COLUMNS,
  FOOTER_SOCIAL,
  HOME,
} from "@/lib/landing-content"

/**
 * Links-only footer (PLAN §3) — the site's completeness + SEO net. A brand
 * block (the "47" mark + one-line positioning tag + Jackson's signature), three
 * tidy link columns, a social row, and the legal line. No capture here: every
 * page still reaches subscribe via the header Newsletter link and Home's inline
 * capture.
 */
export function SiteFooter() {
  const isExternal = (href: string) => href.startsWith("http")
  return (
    <footer className="ft ea-shell" aria-labelledby="ft-heading">
      <h2 id="ft-heading" className="sr-only">
        Site footer
      </h2>

      <div className="ft-grid">
        <div className="ft-brand">
          <div className="ft-mark">
            <GlitchLogo />
            <span className="serif ft-name">Channel 47</span>
          </div>
          <p className="ft-tag">
            Agentic marketing for ecommerce operators — from the trenches.
          </p>
          <p className="ft-sig mono">{HOME.signature}</p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.heading} className="ft-col" aria-label={col.heading}>
            <h3 className="ft-col-head mono">{col.heading}</h3>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="ft-link"
                    target={isExternal(link.href) ? "_blank" : undefined}
                    rel={isExternal(link.href) ? "noopener" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="ft-base">
        <p className="ft-legal mono">© 2026 Channel 47 · by Jackson Dean</p>
        <ul className="ft-social mono">
          {FOOTER_SOCIAL.map((s) => (
            <li key={s.label}>
              <Link href={s.href} className="ft-link" target="_blank" rel="noopener">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="ft-legal mono">
          <Link href="/privacy" className="ft-link">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="ft-link">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  )
}
