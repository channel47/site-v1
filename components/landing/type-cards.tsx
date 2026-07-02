"use client"

import { useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { SchematicFig } from "./schematic-fig"
import { EA_RAIL } from "@/lib/landing-content"

/**
 * The six type gateways — the primary navigation on Home (PLAN §4/§5). Each
 * card is a vivid riso × schematic tile that routes to Browse pre-filtered to
 * its type. On wide containers the rail lays out as a fitted gallery; on narrow
 * screens it's a mandatory-snap carousel where the centered card plays its
 * schematic once (see the `.in-focus` logic + globals.css).
 */
export function TypeCards() {
  const railRef = useRef<HTMLDivElement | null>(null)
  const focusRaf = useRef(0)

  // Mark the card nearest the rail's centre as `.in-focus` so only it plays its
  // schematic cycle on mobile; neighbours rest. Tracked on scroll (rather than
  // IntersectionObserver) so it stays exact under momentum scrolling.
  const updateFocus = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const cards = rail.querySelectorAll<HTMLElement>(".rfan")
    if (!cards.length) return
    const railRect = rail.getBoundingClientRect()
    const railMid = railRect.left + railRect.width / 2
    let nearest: HTMLElement | null = null
    let nearestDist = Infinity
    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect()
      const dist = Math.abs(cardRect.left + cardRect.width / 2 - railMid)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = card
      }
    })
    cards.forEach((card) => card.classList.toggle("in-focus", card === nearest))
  }, [])

  const scheduleFocus = useCallback(() => {
    if (focusRaf.current) return
    focusRaf.current = requestAnimationFrame(() => {
      focusRaf.current = 0
      updateFocus()
    })
  }, [updateFocus])

  useEffect(() => {
    updateFocus()
    const onResize = () => updateFocus()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      if (focusRaf.current) cancelAnimationFrame(focusRaf.current)
    }
  }, [updateFocus])

  return (
    <div className="ea-stackcol">
      <div className="ea-railscroll" ref={railRef} onScroll={scheduleFocus}>
        {EA_RAIL.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rfan hyb"
            style={{ background: card.bg }}
            aria-label={`${card.title} — ${card.desc}`}
          >
            <span className="riso-flood" style={{ background: card.flood }} aria-hidden />
            <span className="riso-dots" style={{ backgroundImage: card.dots }} aria-hidden />
            <span className="fan-grain" aria-hidden />
            <SchematicFig motif={card.motif} />
            <div className="fan-content">
              <h3 className="fan-title serif">{card.title}</h3>
              <p className="rfan-desc">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
