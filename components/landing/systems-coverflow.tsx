"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { PART_DOT_CLASS, SYSTEMS } from "@/lib/landing-content"

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
                  className="cf-card lift"
                  style={{
                    width: 300,
                    height: 300,
                    border: "1px solid rgba(27,25,22,0.1)",
                    borderRadius: 18,
                    background: "#e7e1d3",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 26px 50px -28px rgba(27,25,22,0.45)",
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
                  ) : null}
                </div>
                <div
                  className="cf-cap"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <h3
                    className="serif cf-title"
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.12,
                      color: "#1b1916",
                      transition: "color .2s ease",
                    }}
                  >
                    {s.name}
                  </h3>
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
            background: "rgba(20,17,13,0.55)",
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
              background: "#faf8f1",
              border: "1px solid rgba(27,25,22,0.13)",
              borderRadius: 20,
              boxShadow: "0 40px 90px -30px rgba(20,17,13,0.6)",
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
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  color: "#9a9485",
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
                  fontSize: 17,
                  lineHeight: 1,
                  color: "#9a9485",
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
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.015em",
                lineHeight: 1.04,
                marginTop: 13,
                color: "#1b1916",
              }}
            >
              {sys.name}
            </h3>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "#37332b",
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
                      background: "#cc4b1e",
                      flex: "none",
                      marginTop: 8,
                    }}
                  />
                  <span
                    style={{ fontSize: 15, lineHeight: 1.5, color: "#37332b" }}
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
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    padding: "6px 11px",
                    borderRadius: 999,
                    border: "1px solid rgba(27,25,22,0.18)",
                    color: "#6f6a5f",
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
                borderTop: "1px solid rgba(27,25,22,0.12)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#9a9485",
                  }}
                >
                  Price
                </span>
                <span
                  className="serif"
                  style={{ fontSize: 26, fontWeight: 500, color: "#1b1916" }}
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
                  background: "#14110d",
                  color: "#f1ede4",
                  borderRadius: 12,
                  padding: "15px 24px",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Get lifetime access{" "}
                <span className="serif" style={{ fontSize: 18, lineHeight: 1 }}>
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
