"use client"

import { useState, type CSSProperties } from "react"
import Link from "next/link"
import { CATEGORIES, TYPE_COLORS } from "@/lib/site-content"
import { TypeIcon } from "./type-icon"

const ROWS = CATEGORIES.map(({ title, href, key }) => ({
  label: title,
  href,
  type: key,
}))

/**
 * Mobile-only burger → full-screen drawer (round 12/14 standing rule, desktop
 * carries an inline nav instead — see header.tsx). Bars morph into an X while
 * open; rows stagger in on open, drop instantly on close since the panel
 * itself is already sliding off-screen.
 *
 * The category rows (Notes/Skills/Connectors/Workshops)
 * are shortcuts into the Home rows, not additional nav destinations; the
 * drawer's actual destination set is home (logo) + the utility links below
 * (Browse all, Newsletter). The session offer was demoted out of the
 * drawer and is reachable via the footer.
 */
export function NavDrawer() {
  const [open, setOpen] = useState(false)
  // Bumped on every open so the row icons' blocks rebuild each time the
  // drawer slides in — parity picks the keyframe, so it always replays.
  const [menuPulse, setMenuPulse] = useState(0)

  const toggle = () => {
    setOpen((o) => !o)
    if (!open) setMenuPulse((p) => p + 1)
  }

  return (
    <>
      <button
        type="button"
        className="nd-burger"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={toggle}
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
                    animationDelay: `${0.14 + i * 0.05}s`,
                  } as CSSProperties
                }
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                <TypeIcon
                  type={row.type}
                  className="nd-row-icon"
                  pulse={open ? menuPulse : undefined}
                  delay={0.2 + i * 0.05}
                />
                {row.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nd-utility">
          <Link
            href="/browse"
            className="nd-browse-all"
            style={{ animationDelay: "0.32s" } as CSSProperties}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            Browse all →
          </Link>
          <Link
            href="/newsletter"
            className="nd-browse-all"
            style={{ animationDelay: "0.32s" } as CSSProperties}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            Newsletter →
          </Link>
        </div>
      </nav>
    </>
  )
}
