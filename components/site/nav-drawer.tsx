"use client"

import { useState } from "react"
import Link from "next/link"

const ROWS = [
  { label: "Skills", href: "/browse?type=skills" },
  { label: "Connectors", href: "/browse?type=connectors" },
  { label: "Posts", href: "/browse?type=posts" },
  { label: "Workshops", href: "/browse?type=workshops" },
] as const

/**
 * The sitewide burger → drawer nav (round 12/14 standing rule: "logo-only
 * header, burger → drawer nav"). Replaces the old always-visible text links.
 * Bars morph into an X while open; clicking a row navigates and closes.
 */
export function NavDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="nd-burger"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden />
        <span aria-hidden />
      </button>

      <div
        className="nd-backdrop"
        data-open={open}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <nav className="nd-panel" data-open={open} aria-label="Site" aria-hidden={!open}>
        <div className="st-shell">
          <ul className="nd-rows">
            {ROWS.map((row) => (
              <li key={row.href}>
                <Link
                  href={row.href}
                  className="nd-row"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  {row.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/browse"
            className="nd-browse-all"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            Browse all →
          </Link>
        </div>
      </nav>
    </>
  )
}
