"use client"

import { useCallback, useEffect, useState } from "react"
import { CATEGORIES } from "@/lib/landing-content"

const ROTATE_MS = 4400

/**
 * The hero's stacked "shelves" of the library. The four cards fan up behind a
 * front card that auto-advances every few seconds; clicking a card or dot
 * brings it to the front and restarts the timer.
 */
export function CategoryStack() {
  const [active, setActive] = useState(0)
  const count = CATEGORIES.length

  // Auto-advance, restartable so a manual pick resets the dwell time.
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % count), ROTATE_MS)
    return () => clearInterval(id)
  }, [count, tick])

  const pick = useCallback((i: number) => {
    setActive(i)
    setTick((t) => t + 1)
  }, [])

  /** Depth class: d0 is the front card, d1–d3 fan up behind it. */
  const depthClass = (i: number) => {
    const d = (i - active + count) % count
    return `d${d}${d === 0 ? " is-front" : ""}`
  }

  return (
    <header
      style={{ position: "relative", paddingTop: 48, paddingBottom: 24 }}
    >
      <p
        className="serif rise"
        style={{
          fontSize: 41,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          maxWidth: 600,
          textWrap: "balance",
          fontWeight: 400,
        }}
      >
        A living library of agentic systems and tools for performance marketers.
      </p>

      <div
        className="ch47-stack rise"
        style={{
          position: "relative",
          height: 332,
          marginTop: 20,
          marginBottom: 20,
          animationDelay: "0.1s",
        }}
      >
        {CATEGORIES.map((c, i) => (
          <div
            key={c.kicker}
            className={`hstack-card ${c.accent} ${depthClass(i)}`}
            onClick={() => pick(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                pick(i)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Show ${c.title}`}
            aria-current={i === active}
          >
            <span className="hs-blob b1" aria-hidden />
            <span className="hs-blob b2" aria-hidden />
            <span className="hs-blob b3" aria-hidden />
            <span className="hs-grain" aria-hidden />
            <div className="hs-cap">
              <div>
                <span
                  className="mono stk-tag"
                  style={{
                    fontSize: 9,
                    borderRadius: 100,
                    padding: "3px 9px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.tag}
                </span>
              </div>
              <h3
                className="serif stk-title"
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.04,
                  marginTop: "auto",
                }}
              >
                {c.title}
              </h3>
              <p
                className="stk-desc"
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  marginTop: 9,
                  maxWidth: 400,
                }}
              >
                {c.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </header>
  )
}
