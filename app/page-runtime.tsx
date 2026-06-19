"use client"

import { useEffect } from "react"

/**
 * Client-side behaviors ported 1:1 from the Claude Design "support.js" (DCLogic):
 *  - style-hover  : applies the hover style declarations on mouseenter/leave
 *  - brandmark    : SVG bar-scramble on load + on hover (nav + footer marks)
 *  - scroll reveal: IntersectionObserver fades sections/cards up (matches CSS .r-in)
 *  - gallery      : click a phone thumbnail -> full scrollable lightbox
 *  - date         : fills "first advertorial by {date}" with the next 5 business days
 *
 * The markup is static (server-rendered) and never re-renders, so wiring the DOM
 * directly here is safe. Everything is torn down on unmount.
 */
export function PageRuntime() {
  useEffect(() => {
    const reduceMotion = (() => {
      try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      } catch {
        return false
      }
    })()
    const cleanups: Array<() => void> = []

    // ── style-hover ──────────────────────────────────────────────────────────
    document.querySelectorAll<HTMLElement>("[style-hover]").forEach((el) => {
      const hov = el.getAttribute("style-hover")
      if (!hov) return
      const base = el.getAttribute("style") || ""
      const onEnter = () => el.setAttribute("style", base + ";" + hov)
      const onLeave = () => el.setAttribute("style", base)
      el.addEventListener("mouseenter", onEnter)
      el.addEventListener("mouseleave", onLeave)
      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter)
        el.removeEventListener("mouseleave", onLeave)
        el.setAttribute("style", base)
      })
    })

    // ── brandmark scramble ───────────────────────────────────────────────────
    const origRects = new WeakMap<SVGRectElement, { x: number; y: number; w: number; h: number }>()
    const cancelers = new WeakMap<SVGSVGElement, () => void>()

    const scramble = (svg: SVGSVGElement) => {
      const rects = Array.from(svg.querySelectorAll("rect"))
      if (!rects.length) return
      cancelers.get(svg)?.()
      const VW = 46
      const VH = 24
      const reseed = (s: { rh: number; ry: number; rw: number; rx: number }) => {
        s.rh = 3 + Math.random() * (VH - 3)
        s.ry = Math.random() * (VH - s.rh)
        s.rw = 3 + Math.random() * 11
        s.rx = Math.random() * (VW - s.rw)
      }
      const specs = rects.map((r, i) => {
        let o = origRects.get(r)
        if (!o) {
          o = {
            x: +(r.getAttribute("x") || 0),
            y: +(r.getAttribute("y") || 0),
            w: +(r.getAttribute("width") || 0),
            h: +(r.getAttribute("height") || 0),
          }
          origRects.set(r, o)
        }
        const s = { r, o, reseedAt: 0, dur: 760 + i * 150 + Math.random() * 220, rh: 0, ry: 0, rw: 0, rx: 0 }
        reseed(s)
        return s
      })
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)
      const restore = () =>
        specs.forEach((s) => {
          s.r.setAttribute("x", String(s.o.x))
          s.r.setAttribute("y", String(s.o.y))
          s.r.setAttribute("width", String(s.o.w))
          s.r.setAttribute("height", String(s.o.h))
        })
      const t0 = performance.now()
      let raf = 0
      let running = true
      const cancel = () => {
        running = false
        cancelAnimationFrame(raf)
        restore()
        cancelers.delete(svg)
      }
      cancelers.set(svg, cancel)
      const tick = (now: number) => {
        if (!running) return
        let done = 0
        for (const s of specs) {
          const t = now - t0
          if (t >= s.dur) {
            s.r.setAttribute("x", String(s.o.x))
            s.r.setAttribute("y", String(s.o.y))
            s.r.setAttribute("width", String(s.o.w))
            s.r.setAttribute("height", String(s.o.h))
            done++
            continue
          }
          const p = easeOut(t / s.dur)
          if (now - s.reseedAt > 48 + Math.random() * 34) {
            s.reseedAt = now
            reseed(s)
          }
          s.r.setAttribute("width", (s.rw + (s.o.w - s.rw) * p).toFixed(2))
          s.r.setAttribute("height", (s.rh + (s.o.h - s.rh) * p).toFixed(2))
          s.r.setAttribute("x", (s.rx + (s.o.x - s.rx) * p).toFixed(2))
          s.r.setAttribute("y", (s.ry + (s.o.y - s.ry) * p).toFixed(2))
        }
        if (done === specs.length) {
          restore()
          running = false
          cancelers.delete(svg)
          return
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const wireBrand = (wrapSel: string, svgSel: string): (() => void) | null => {
      const wrap = document.querySelector<HTMLElement>(wrapSel)
      const svg = document.querySelector<SVGSVGElement>(svgSel)
      if (!wrap || !svg) return null
      const run = () => scramble(svg)
      if (!reduceMotion) {
        wrap.addEventListener("mouseenter", run)
        cleanups.push(() => {
          wrap.removeEventListener("mouseenter", run)
          cancelers.get(svg)?.()
        })
      }
      return run
    }
    const runNav = wireBrand("#brand", "#brandmark")
    wireBrand("#brand2", "#brandmark2")
    let introTimer: ReturnType<typeof setTimeout> | undefined
    if (!reduceMotion && runNav) {
      introTimer = setTimeout(runNav, 280)
    }

    // ── scroll reveal ────────────────────────────────────────────────────────
    let failsafe: ReturnType<typeof setTimeout> | undefined
    if (!reduceMotion) {
      const sel = "section, footer, #whatsin > div:nth-of-type(2) > div, #pricing > div:nth-of-type(2) > div"
      const els = Array.from(document.querySelectorAll<HTMLElement>(sel))
      const show = (el: HTMLElement) => {
        el.classList.add("r-in")
        el.style.opacity = "1"
        el.style.transform = "none"
      }
      if (!("IntersectionObserver" in window)) {
        els.forEach(show)
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            let i = 0
            entries.forEach((en) => {
              if (!en.isIntersecting) return
              const el = en.target as HTMLElement
              const delay = Math.min(i, 8) * 75
              i++
              setTimeout(() => show(el), delay)
              io.unobserve(el)
            })
          },
          { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
        )
        els.forEach((el) => io.observe(el))
        cleanups.push(() => io.disconnect())
        failsafe = setTimeout(() => {
          els.forEach((el) => {
            if (!el.classList.contains("r-in")) show(el)
          })
        }, 6000)
      }
    }

    // ── gallery lightbox (built with safe DOM methods, no innerHTML) ──────────
    let escHandler: ((e: KeyboardEvent) => void) | null = null
    let prevOverflow: string | undefined
    const closeLightbox = () => {
      document.getElementById("__shotLightbox")?.remove()
      if (escHandler) {
        document.removeEventListener("keydown", escHandler)
        escHandler = null
      }
      if (prevOverflow !== undefined) {
        document.body.style.overflow = prevOverflow
        prevOverflow = undefined
      }
    }
    const mk = (tag: string, css: string) => {
      const n = document.createElement(tag)
      n.style.cssText = css
      return n
    }
    const openLightbox = (src: string, cap: string) => {
      if (!src) return
      closeLightbox()
      const ov = mk(
        "div",
        "position:fixed;inset:0;z-index:99999;background:rgba(6,6,7,0.88);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:28px;opacity:0;transition:opacity .25s ease",
      )
      ov.id = "__shotLightbox"

      const closeBtn = mk(
        "button",
        "position:absolute;top:22px;right:26px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#f4f4ef;font-size:19px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1",
      )
      closeBtn.setAttribute("aria-label", "Close")
      closeBtn.textContent = "✕"

      const stop = mk("div", "display:flex;flex-direction:column;align-items:center;gap:14px;max-height:100%")
      stop.setAttribute("data-stop", "")

      const frame = mk(
        "div",
        "position:relative;width:336px;max-width:86vw;height:84vh;background:#0b0b0c;border:1px solid rgba(255,255,255,0.16);border-radius:44px;padding:10px;box-shadow:0 50px 100px -30px rgba(0,0,0,0.85)",
      )
      const notch = mk(
        "div",
        "position:absolute;top:18px;left:50%;transform:translateX(-50%);width:110px;height:26px;background:#0b0b0c;border-radius:0 0 16px 16px;z-index:3",
      )
      const scroll = mk(
        "div",
        "width:100%;height:100%;overflow-y:auto;overflow-x:hidden;border-radius:36px;background:#fff;-webkit-overflow-scrolling:touch",
      )
      const img = mk("img", "width:100%;display:block") as HTMLImageElement
      img.src = src
      img.alt = ""
      scroll.appendChild(img)
      frame.appendChild(notch)
      frame.appendChild(scroll)

      const caption = mk(
        "div",
        "font-family:var(--font-mono),monospace;font-size:12px;color:#9d9d97;letter-spacing:0.04em",
      )
      caption.textContent = (cap ? cap + " · " : "") + "scroll to read · esc or tap outside to close"

      stop.appendChild(frame)
      stop.appendChild(caption)
      ov.appendChild(closeBtn)
      ov.appendChild(stop)
      document.body.appendChild(ov)
      requestAnimationFrame(() => {
        ov.style.opacity = "1"
      })
      ov.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        if (!target.closest("[data-stop]") || target.closest("button")) closeLightbox()
      })
      escHandler = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeLightbox()
      }
      document.addEventListener("keydown", escHandler)
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
    }
    document.querySelectorAll<HTMLElement>("[data-shot]").forEach((el) => {
      const onClick = () => openLightbox(el.getAttribute("data-shot") || "", el.getAttribute("data-cap") || "")
      el.addEventListener("click", onClick)
      cleanups.push(() => el.removeEventListener("click", onClick))
    })
    cleanups.push(closeLightbox)

    // ── computed "first advertorial by {date}" ───────────────────────────────
    const firstAdvertorialDate = () => {
      const d = new Date()
      let added = 0
      while (added < 5) {
        d.setDate(d.getDate() + 1)
        const day = d.getDay()
        if (day !== 0 && day !== 6) added++
      }
      return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    }
    document.querySelectorAll<HTMLElement>("[data-first-advertorial-date]").forEach((el) => {
      el.textContent = firstAdvertorialDate()
    })

    return () => {
      if (introTimer) clearTimeout(introTimer)
      if (failsafe) clearTimeout(failsafe)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return null
}
