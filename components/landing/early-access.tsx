"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GlitchLogo } from "./glitch-logo"
import { SchematicFig } from "./schematic-fig"
import { EARLY_ACCESS, EA_RAIL, LINKS } from "@/lib/landing-content"

type Status = "idle" | "sending" | "subscribed" | "dormant" | "error"

/**
 * The early-access landing page — the "headline-top" layout of the CH47 Early
 * Access Claude Design file: the animated mark, a standalone headline, a
 * full-bleed rail of the library's building blocks (Skills / Agents /
 * Connectors) drawn in the riso × schematic treatment, the narrative copy, and
 * the one job — capturing an email.
 *
 * The page chrome runs on a greige OKLCH palette that flips to its dark ladder
 * via `prefers-color-scheme` (see globals.css), so light/dark follows the
 * visitor's system setting with no toggle. The cards stay vivid in both.
 *
 * The form posts to `/api/subscribe` (env-gated Kit). On a real success we show
 * the design's confirmation; if the backend is unconfigured we say *that*,
 * honestly — we never fake a "you're on the list" (STRATEGY.md §4).
 */
export function EarlyAccess() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  // Mobile rail behavior: the cards become a mandatory-snap carousel (one card
  // centered per swipe — see globals.css). The card sitting nearest the rail's
  // center is marked `.in-focus`, and that's the only one whose schematic plays
  // its animation cycle; neighbors rest. We track the centered card here rather
  // than with IntersectionObserver so it stays exact under momentum scrolling.
  // Toggling the class on every screen is harmless — only the mobile container
  // query has rules that key off `.in-focus`.
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/.+@.+\..+/.test(email.trim())) {
      setStatus("error")
      return
    }
    setStatus("sending")
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), intent: "warm" }),
      })
      const data = (await r.json().catch(() => ({}))) as {
        ok?: boolean
        code?: string
      }
      if (r.ok && data.ok) setStatus("subscribed")
      else if (data.code === "unconfigured") setStatus("dormant")
      else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="ea-page">
      <nav className="ea-nav ea-shell">
        <GlitchLogo autoPlay />
      </nav>

      <div className="ea-body">
        {/* Headline (standalone, top) */}
        <h1 className="serif ea-h1 ea-shell">{EARLY_ACCESS.headline}</h1>

        {/* Pillar rail — the library's building blocks */}
        <div className="ea-stackcol">
          <div
            className="ea-railscroll"
            ref={railRef}
            onScroll={scheduleFocus}
          >
            {EA_RAIL.map((card) => (
              <div key={card.title} className="rfan hyb" style={{ background: card.bg }}>
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
              </div>
            ))}
          </div>
        </div>

        {/* Copy + capture */}
        <div className="ea-copycol ea-shell">
          <div className="ea-copy">
            <p>{EARLY_ACCESS.p1}</p>
            <p>{EARLY_ACCESS.p2}</p>
            <p className="ea-lead">{EARLY_ACCESS.p3}</p>
          </div>

          <div className="ea-formwrap">
            {status === "subscribed" ? (
              <>
                <div className="ea-ok">
                  <svg
                    className="ok-check"
                    width="20"
                    height="20"
                    viewBox="0 0 26 26"
                    fill="none"
                    style={{ flex: "none" }}
                    aria-hidden
                  >
                    <path
                      d="M4.5 13.8 L10.5 19.4 L21.5 6.2"
                      stroke="var(--accent)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="serif"
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      lineHeight: 1,
                      color: "var(--ink)",
                      position: "relative",
                      top: 1,
                    }}
                  >
                    You&apos;re on the list.
                  </span>
                </div>
                <p className="ea-helper">
                  I&apos;ll email you the moment the first systems ship.
                </p>
              </>
            ) : status === "dormant" ? (
              <p
                style={{
                  fontSize: "var(--body-size)",
                  lineHeight: 1.55,
                  color: "var(--body)",
                }}
              >
                Email signup isn&apos;t wired up on this page yet. For now,{" "}
                <a
                  href={LINKS.join}
                  target="_blank"
                  rel="noopener"
                  className="ul"
                  style={{ color: "var(--accent)" }}
                >
                  come build with me live →
                </a>
              </p>
            ) : (
              <>
                <form className="ea-formrow" onSubmit={submit}>
                  <input
                    className="ea-in"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status === "error") setStatus("idle")
                    }}
                    placeholder="you@company.com"
                    aria-label="Email address"
                    style={{ flex: 1, minWidth: 0 }}
                  />
                  <button
                    type="submit"
                    className="ea-btn"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "…" : "Get early access"}
                  </button>
                </form>
                {status === "error" ? (
                  <p
                    className="mono"
                    style={{
                      fontSize: 12,
                      color: "var(--accent)",
                      marginTop: 9,
                    }}
                  >
                    That didn&apos;t go through — check the address and try again.
                  </p>
                ) : (
                  <p className="ea-helper">{EARLY_ACCESS.helper}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
