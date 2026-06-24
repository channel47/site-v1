"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GlitchLogo } from "./glitch-logo"
import { EARLY_ACCESS, EA_STACK, LINKS } from "@/lib/landing-content"

type Status = "idle" | "sending" | "subscribed" | "dormant" | "error"

const ROTATE_MS = 4400
const SWIPE_PX = 40

/**
 * The early-access landing page (transcribed from the "CH47 Early Access"
 * Claude Design file): the animated mark, the headline, a fan-stack of the
 * library's four building blocks that auto-rotates, the narrative copy, and the
 * one job — capturing an email.
 *
 * The form posts to `/api/subscribe` (env-gated Kit). On a real success we show
 * the design's confirmation; if the backend is unconfigured we say *that*,
 * honestly — we never fake a "you're on the list" (STRATEGY.md §4).
 */
export function EarlyAccess() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  // ---- auto-rotating fan stack ----
  const [active, setActive] = useState(0)
  const [tick, setTick] = useState(0)
  const count = EA_STACK.length

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % count), ROTATE_MS)
    return () => clearInterval(id)
  }, [count, tick])

  const pick = useCallback((i: number) => {
    setActive(i)
    setTick((t) => t + 1)
  }, [])

  /** Depth class: d0 is the front card, d1–d3 fan up behind it. */
  const depthClass = (i: number) => `d${(i - active + count) % count}`

  // Swipe to advance/rewind on touch.
  const touchX = useRef(0)
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? 0
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current
    if (dx < -SWIPE_PX) pick((active + 1) % count)
    else if (dx > SWIPE_PX) pick((active + count - 1) % count)
  }

  // ---- email capture ----
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
      <nav style={{ display: "flex", alignItems: "center", padding: "22px 0 0" }}>
        <GlitchLogo autoPlay />
      </nav>

      <div className="ea-body">
        <h1 className="serif ea-h1">{EARLY_ACCESS.headline}</h1>

        {/* Fan stack of the library's building blocks */}
        <div
          className="ea-stack"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {EA_STACK.map((card, i) => (
            <div
              key={card.title}
              className={`fan-card ${depthClass(i)}`}
              style={{ background: card.bg }}
              onClick={() => pick(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  pick(i)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Show ${card.title}`}
              aria-current={i === active}
            >
              <span
                className="fan-blob b1"
                style={{ background: card.blobs[0] }}
                aria-hidden
              />
              <span
                className="fan-blob b2"
                style={{ background: card.blobs[1] }}
                aria-hidden
              />
              <span
                className="fan-blob b3"
                style={{ background: card.blobs[2] }}
                aria-hidden
              />
              <span className="fan-grain" aria-hidden />
              <div className="fan-content">
                <h3 className="fan-title serif">{card.title}</h3>
                <p className="fan-desc">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Copy + capture */}
        <div className="ea-copycol">
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
                      fontSize: 17,
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
                  fontSize: 15.5,
                  lineHeight: 1.55,
                  color: "var(--ink-soft)",
                }}
              >
                Email signup isn&apos;t wired up on this page yet. For now,{" "}
                <a
                  href={LINKS.join}
                  target="_blank"
                  rel="noopener"
                  className="ul"
                  style={{ color: "var(--accent-ink)" }}
                >
                  come build with me live →
                </a>
              </p>
            ) : (
              <>
                <form className="ea-formrow" onSubmit={submit}>
                  <input
                    className="ufield mono"
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
                    className="btn-invert mono"
                    disabled={status === "sending"}
                    style={{
                      flex: "none",
                      background: "var(--near-black)",
                      color: "var(--cream)",
                      border: "1px solid transparent",
                      borderRadius: 12,
                      padding: "0 20px",
                      fontSize: 13.5,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      cursor: status === "sending" ? "default" : "pointer",
                      opacity: status === "sending" ? 0.65 : 1,
                    }}
                  >
                    {status === "sending" ? "…" : "Get early access"}
                  </button>
                </form>
                {status === "error" ? (
                  <p
                    className="mono"
                    style={{
                      fontSize: 12,
                      color: "var(--accent-ink)",
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
