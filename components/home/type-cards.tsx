"use client"

import { useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { SchematicFig } from "@/components/landing/schematic-fig"
import { TYPE_CARDS } from "@/lib/site-content"

/**
 * The riso type-card gallery — Home's primary navigation (PLAN §4). One card
 * per populated content type, each routing to Browse pre-filtered (Workshops
 * routes to its evergreen page). 2×2 fitted grid on wide screens; a
 * mandatory-snap, one-card-per-swipe carousel on mobile.
 *
 * Mobile rail behavior: the card sitting nearest the rail's center is marked
 * `.in-focus`, and that's the only one whose schematic plays its (run-once)
 * animation cycle; neighbors rest. Tracked here rather than with
 * IntersectionObserver so it stays exact under momentum scrolling. Toggling
 * the class on every screen is harmless — only the mobile container query has
 * rules that key off `.in-focus`.
 */
export function TypeCards() {
  const railRef = useRef<HTMLDivElement | null>(null)
  const focusRaf = useRef(0)

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

  // rAF-coalesce scroll events so we mark focus at most once per frame.
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
    <div className="ea-railscroll" ref={railRef} onScroll={scheduleFocus}>
      {TYPE_CARDS.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="rfan hyb"
          style={{ background: card.bg }}
        >
          <span
            className="riso-flood"
            style={{ background: card.flood }}
            aria-hidden
          />
          <span
            className="riso-dots"
            style={{ backgroundImage: card.dots }}
            aria-hidden
          />
          <span className="fan-grain" aria-hidden />
          <SchematicFig motif={card.motif} />
          <div className="fan-content">
            <h3 className="fan-title serif">{card.title}</h3>
            <p className="rfan-desc">{card.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
