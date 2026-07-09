"use client"

import { useState, type CSSProperties } from "react"
import Link from "next/link"
import { TYPE_COLORS } from "@/lib/site-content"
import { TypeIcon } from "./type-icon"

const ROWS = [
  { label: "Posts", href: "/browse?type=posts", type: "posts" },
  { label: "Skills", href: "/browse?type=skills", type: "skills" },
  { label: "Connectors", href: "/browse?type=connectors", type: "connectors" },
  { label: "Workshops", href: "/browse?type=workshops", type: "workshops" },
] as const

/**
 * Mobile-only burger → full-screen drawer (round 12/14 standing rule, desktop
 * carries an inline nav instead — see header.tsx). Bars morph into an X while
 * open; rows stagger in on open, drop instantly on close since the panel
 * itself is already sliding off-screen.
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

      <nav className="nd-panel" data-open={open} aria-label="Site" aria-hidden={!open}>
        <ul className="nd-rows">
          {ROWS.map((row, i) => (
            <li key={row.href}>
              <Link
                href={row.href}
                className="nd-row"
                style={
                  {
                    "--type-color": TYPE_COLORS[row.type],
                    animationDelay: `${0.16 + i * 0.055}s`,
                  } as CSSProperties
                }
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                <TypeIcon type={row.type} className="nd-row-icon" />
                {row.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/browse"
          className="nd-browse-all"
          style={{ animationDelay: "0.38s" } as CSSProperties}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          Browse all →
        </Link>
      </nav>
    </>
  )
}
