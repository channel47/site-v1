"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"
import { CATEGORIES, TYPE_COLORS } from "@/lib/site-content"
import { TypeIcon } from "./type-icon"

const ROWS = CATEGORIES.map(({ title, href, icon }) => ({
  label: title,
  href,
  type: icon,
}))

/**
 * Mobile-only burger → full-screen drawer (round 12/14 standing rule, desktop
 * carries an inline nav instead — see header.tsx). Bars morph into an X while
 * open; rows stagger in on open, drop instantly on close since the panel
 * itself is already sliding off-screen.
 *
 * The category rows (Projects/Notes)
 * are shortcuts into the Home rows, not additional nav destinations; the
 * drawer's actual destination set is home (logo) + the utility links below
 * (Browse all, Newsletter). The session offer was demoted out of the
 * drawer and is reachable via the footer.
 */
export function NavDrawer() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.documentElement.style.overflowY
    document.documentElement.style.overflowY = "hidden"
    const links = () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [])
    links()[0]?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
      }
      if (event.key === "Tab") {
        const controls = [toggleRef.current, ...links()].filter((el): el is HTMLButtonElement | HTMLAnchorElement => !!el)
        const current = controls.indexOf(document.activeElement as HTMLAnchorElement)
        const next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length
        event.preventDefault()
        controls[next]?.focus()
      }
    }
    const desktop = window.matchMedia("(min-width: 768px)")
    const onResize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener("keydown", onKey)
    desktop.addEventListener("change", onResize)
    return () => {
      document.documentElement.style.overflowY = previousOverflow
      document.removeEventListener("keydown", onKey)
      desktop.removeEventListener("change", onResize)
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [open])
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
        ref={toggleRef}
        className="nd-burger"
        aria-controls="site-mobile-menu"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={toggle}
      >
        <span aria-hidden />
        <span aria-hidden />
      </button>

      <nav ref={panelRef} id="site-mobile-menu" inert={!open} className="nd-panel" data-open={open} aria-label="Site" aria-hidden={!open}>
        <ul className="nd-rows">
          {ROWS.map((row, i) => (
            <li key={row.href}>
              <Link
                href={row.href}
                className="nd-row"
                style={
                  {
                    "--type-color": TYPE_COLORS[row.type],
                    animationDelay: `${0.06 + i * 0.035}s`,
                  } as CSSProperties
                }
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                <TypeIcon
                  type={row.type}
                  className="nd-row-icon"
                  pulse={open ? menuPulse : undefined}
                  delay={0.06 + i * 0.035}
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
            style={{ animationDelay: "0.12s" } as CSSProperties}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            Browse all →
          </Link>
          <Link
            href="/newsletter"
            className="nd-browse-all"
            style={{ animationDelay: "0.12s" } as CSSProperties}
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
