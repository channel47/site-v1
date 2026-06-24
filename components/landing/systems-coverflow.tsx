"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { PART_DOT_CLASS, SYSTEMS } from "@/lib/landing-content"

/**
 * Full-bleed line icons drawn on each system card, keyed by `System.icon`.
 * Stroke-only on a 24-unit grid so they scale cleanly to the ~210px crop.
 */
const ICONS: Record<string, ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  article: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 2.5v19" />
      <path d="M16.5 6.8c0-1.9-2-3-4.5-3s-4.5 1.2-4.5 3.2c0 4.6 9 2.2 9 6.8 0 2-2 3.2-4.5 3.2s-4.5-1.1-4.5-3" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9z" />
      <path d="M18 13.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.2" />
      <path d="M3.5 7.5l8.5 5.5 8.5-5.5" />
    </>
  ),
}

/**
 * The systems shelf: a full-bleed coverflow whose cards scale and fade by
 * distance from centre, with pointer-drag scrolling on desktop and snap on
 * release. Clicking a card opens its detail modal.
 *
 * The scroll/scale maths are ported from the design's standalone coverflow
 * engine; here they live in one effect that styles the cards imperatively
 * (React owns layout, the effect owns the motion).
 */
export function SystemsCoverflow() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  // `closing` plays the exit animation for one beat before the modal unmounts.
  const [closing, setClosing] = useState(false)

  const close = useCallback(() => {
    setClosing(true)
    window.setTimeout(() => {
      setOpen(null)
      setClosing(false)
    }, 190)
  }, [])

  // ---- coverflow motion ----
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    track.style.scrollSnapType = "x mandatory"
    const cards = () =>
      track.querySelectorAll<HTMLElement>(".cf-card")
    const spacerEls = () =>
      track.querySelectorAll<HTMLElement>(".cf-spacer")

    let act = 0

    const sizeSpacers = () => {
      const first = track.querySelector<HTMLElement>(".cf-card")
      const w = first ? first.offsetWidth : 300
      const sp = Math.max(16, (track.clientWidth - w) / 2)
      spacerEls().forEach((s) => (s.style.width = `${sp}px`))
    }

    const update = () => {
      const center = track.scrollLeft + track.clientWidth / 2
      const cs = cards()
      const cw = cs[0] ? cs[0].offsetWidth : 300
      let min = Infinity
      cs.forEach((c, i) => {
        c.style.scrollSnapAlign = "center"
        const cc = c.offsetLeft + c.offsetWidth / 2
        const d = Math.abs(cc - center) / cw
        c.style.transform = `scale(${Math.max(0.9, 1 - d * 0.07)})`
        c.style.opacity = String(Math.max(0.5, 1 - d * 0.34))
        c.style.transition =
          "transform .32s cubic-bezier(.2,.7,.2,1), opacity .32s ease, box-shadow .3s"
        c.style.zIndex = String(100 - Math.round(d * 10))
        if (d < min) {
          min = d
          act = i
        }
      })
    }

    const go = (i: number) => {
      const cs = cards()
      i = Math.max(0, Math.min(cs.length - 1, i))
      const c = cs[i]
      if (!c) return
      track.scrollTo({
        left: c.offsetLeft + c.offsetWidth / 2 - track.clientWidth / 2,
        behavior: "smooth",
      })
    }

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    const onResize = () => {
      sizeSpacers()
      update()
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)

    // pointer-drag scrolling (desktop); native touch scroll handles mobile
    let down = false
    let startX = 0
    let startLeft = 0
    let moved = false
    let settle: ReturnType<typeof setTimeout>

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      down = true
      moved = false
      startX = e.clientX
      startLeft = track.scrollLeft
      track.style.scrollSnapType = "none"
      track.style.cursor = "grabbing"
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 3) moved = true
      track.scrollLeft = startLeft - dx
    }
    const onUp = () => {
      if (!down) return
      down = false
      track.style.cursor = "grab"
      if (moved) go(act)
      clearTimeout(settle)
      settle = setTimeout(() => {
        track.style.scrollSnapType = "x mandatory"
      }, 60)
    }
    track.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)

    // a card click opens its modal; a drag-release does not
    const onClick = (e: MouseEvent) => {
      if (moved) return
      const card = (e.target as HTMLElement).closest(".cf-cell")
      if (!card) return
      const idx = Number(card.getAttribute("data-idx"))
      if (!Number.isNaN(idx)) {
        go(idx)
        setClosing(false)
        setOpen(idx)
      }
    }
    track.addEventListener("click", onClick)

    const timers = [120, 320, 700].map((ms) =>
      setTimeout(() => {
        sizeSpacers()
        go(0)
        update()
      }, ms),
    )
    const start = requestAnimationFrame(() => {
      sizeSpacers()
      update()
      go(0)
    })

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(start)
      timers.forEach(clearTimeout)
      track.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      track.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      track.removeEventListener("click", onClick)
    }
  }, [])

  // ---- modal: lock scroll + close on escape ----
  useEffect(() => {
    if (open == null) return
    const root = document.scrollingElement || document.documentElement
    const prev = (root as HTMLElement).style.overflow
    ;(root as HTMLElement).style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      ;(root as HTMLElement).style.overflow = prev
      document.removeEventListener("keydown", onKey)
    }
  }, [open, close])

  const sys = open == null ? null : SYSTEMS[open]

  return (
    <>
      <section style={{ padding: "34px 0 0" }}>
        <div
          className="cf-wrap"
          style={{
            position: "relative",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
          }}
        >
          <div
            ref={trackRef}
            className="cf-track"
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: 30,
              overflowX: "auto",
              overflowY: "visible",
              padding: "34px 0 40px",
              cursor: "grab",
            }}
          >
            <div className="cf-spacer" style={{ flex: "none", width: 140 }} />

            {SYSTEMS.map((s, i) => (
              <div
                key={s.slug}
                className="cf-cell"
                data-idx={i}
                style={{
                  flex: "none",
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  gap: 15,
                  cursor: "pointer",
                }}
              >
                <div
                  className={`cf-card lift ${
                    s.image ? "cf-img" : `cf-${s.accent.replace("cat-", "")}`
                  }`}
                  style={{
                    width: 300,
                    height: 300,
                    border: "1px solid oklch(0.215 0.007 78 / 0.1)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 26px 50px -28px oklch(0.215 0.007 78 / 0.45)",
                    willChange: "transform, filter",
                  }}
                >
                  {s.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image}
                      alt={s.name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <span className="cf-ic" aria-hidden>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {ICONS[s.icon]}
                        </svg>
                      </span>
                      <span className="cf-grain" aria-hidden />
                    </>
                  )}
                  <h3 className="serif cf-name">{s.name}</h3>
                </div>
              </div>
            ))}

            <div className="cf-spacer" style={{ flex: "none", width: 140 }} />
          </div>
        </div>
      </section>

      {sys ? (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "oklch(0.18 0.009 75 / 0.55)",
            animation: `${closing ? "fadeOut" : "fadeIn"} 0.2s ease both`,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={sys.name}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 480,
              background: "var(--paper)",
              border: "1px solid oklch(0.215 0.007 78 / 0.13)",
              borderRadius: 20,
              boxShadow: "0 40px 90px -30px oklch(0.18 0.009 75 / 0.6)",
              padding: "32px 34px 30px",
              maxHeight: "86vh",
              overflowY: "auto",
              animation: `${closing ? "modalOut" : "modalIn"} ${
                closing ? "0.18s" : "0.3s"
              } cubic-bezier(0.2, 0.7, 0.2, 1) both`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: "var(--text-3xs)",
                  letterSpacing: "0.16em",
                  color: "var(--muted)",
                }}
              >
                {sys.kicker}
              </span>
              <button
                aria-label="Close"
                className="mono press"
                onClick={close}
                style={{
                  cursor: "pointer",
                  fontSize: "var(--text-base)",
                  lineHeight: 1,
                  color: "var(--muted)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  width: 40,
                  marginTop: -8,
                  marginRight: -10,
                  padding: 0,
                  background: "none",
                  border: "none",
                }}
              >
                ✕
              </button>
            </div>
            <h3
              className="serif"
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 500,
                letterSpacing: "-0.015em",
                lineHeight: 1.04,
                marginTop: 13,
                color: "var(--ink-strong)",
              }}
            >
              {sys.name}
            </h3>
            <p
              style={{
                fontSize: "var(--text-base)",
                lineHeight: 1.6,
                color: "var(--ink-soft)",
                marginTop: 13,
              }}
            >
              {sys.blurb}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 11,
                marginTop: 22,
              }}
            >
              {sys.bullets.map((b) => (
                <div
                  key={b}
                  style={{ display: "flex", gap: 11, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flex: "none",
                      marginTop: 8,
                    }}
                  />
                  <span
                    style={{ fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--ink-soft)" }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 22,
              }}
            >
              {sys.parts.map((p) => (
                <span
                  key={p.label}
                  className="mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: "var(--text-3xs)",
                    letterSpacing: "0.08em",
                    padding: "6px 11px",
                    borderRadius: 999,
                    border: "1px solid oklch(0.215 0.007 78 / 0.18)",
                    color: "var(--ink-faint)",
                  }}
                >
                  <span
                    className={`ptdot ${PART_DOT_CLASS[p.kind]}`}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      flex: "none",
                    }}
                  />
                  {p.kind.toUpperCase()} · {p.label}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                marginTop: 26,
                paddingTop: 22,
                borderTop: "1px solid oklch(0.215 0.007 78 / 0.12)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  className="mono"
                  style={{
                    fontSize: "var(--text-3xs)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  Price
                </span>
                <span
                  className="serif"
                  style={{ fontSize: "var(--text-lg)", fontWeight: 500, color: "var(--ink-strong)" }}
                >
                  {sys.price}
                </span>
              </div>
              <a
                href="#access"
                onClick={close}
                className="mono btn-invert"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--near-black)",
                  color: "var(--cream)",
                  borderRadius: 12,
                  padding: "15px 24px",
                  fontWeight: 700,
                  fontSize: "var(--text-sm)",
                }}
              >
                Get lifetime access{" "}
                <span className="serif" style={{ fontSize: "var(--text-base)", lineHeight: 1 }}>
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
