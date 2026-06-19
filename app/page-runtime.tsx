"use client"

import { useEffect } from "react"

/**
 * Client-side behaviors ported 1:1 from the Claude Design "support.js" (DCLogic):
 *  - style-hover  : applies the hover style declarations on mouseenter/leave
 *  - brandmark    : SVG bar-scramble on load + on hover (nav + footer marks)
 *  - scroll reveal: IntersectionObserver fades sections/cards up (matches CSS .r-in)
 *  - carousel     : full-bleed coverflow live-work slider — cloned card sets for
 *                   seamless infinite loop, drag/swipe, arrows, dots, counter
 *  - gallery      : click a phone card -> full scrollable lightbox
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
    cleanups.push(closeLightbox)

    // Wire click-to-open on every [data-shot] card (originals + carousel clones).
    // Guarded so re-running after cloning never double-wires the originals.
    const galleryWired = new WeakSet<Element>()
    const setupGallery = () => {
      document.querySelectorAll<HTMLElement>("[data-shot]").forEach((el) => {
        if (galleryWired.has(el)) return
        galleryWired.add(el)
        const onClick = () => openLightbox(el.getAttribute("data-shot") || "", el.getAttribute("data-cap") || "")
        el.addEventListener("click", onClick)
        cleanups.push(() => el.removeEventListener("click", onClick))
      })
    }

    // ── live-work coverflow carousel ─────────────────────────────────────────
    const setupCarousel = () => {
      const track = document.getElementById("liveTrack")
      if (!track) return
      // Idempotent (StrictMode / HMR): clear any prior clones + dots first.
      track.querySelectorAll(".live-card[data-clone]").forEach((n) => n.remove())
      const dotsWrap = document.getElementById("liveDots")
      dotsWrap?.replaceChildren()
      const counter = document.getElementById("liveCounter")

      const orig = Array.from(track.querySelectorAll<HTMLElement>(".live-card"))
      const N = orig.length
      if (!N) return
      const GAP = 30
      let active = 0
      const pad = (n: number) => String(n + 1).padStart(2, "0")

      // Clone the full set fore & aft so scroll loops seamlessly.
      const cloneSet = () =>
        orig.map((c) => {
          const n = c.cloneNode(true) as HTMLElement
          n.setAttribute("data-clone", "1")
          n.removeAttribute("data-comment-anchor")
          n.querySelectorAll("[data-comment-anchor]").forEach((e) => e.removeAttribute("data-comment-anchor"))
          return n
        })
      cloneSet().forEach((n) => track.insertBefore(n, orig[0]))
      cloneSet().forEach((n) => track.appendChild(n))
      const all = Array.from(track.querySelectorAll<HTMLElement>(".live-card"))
      setupGallery() // wire click-to-open on the clones too
      const stride = orig[0].offsetWidth + GAP
      const period = N * stride

      const centerLeftFor = (idx: number) => all[idx].offsetLeft - (track.clientWidth - all[idx].offsetWidth) / 2

      if (dotsWrap) {
        orig.forEach((_, i) => {
          const b = document.createElement("button")
          b.type = "button"
          b.setAttribute("aria-label", "Go to page " + (i + 1))
          b.style.cssText =
            "width:7px;height:7px;border-radius:100px;border:none;padding:0;cursor:pointer;background:rgba(255,255,255,0.2);transition:width .4s cubic-bezier(.2,.7,.2,1),background .25s"
          b.addEventListener("click", () => goToLogical(i))
          dotsWrap.appendChild(b)
        })
      }

      const syncUI = () => {
        if (counter) counter.textContent = pad(active) + " / " + pad(N - 1)
        if (dotsWrap)
          Array.from(dotsWrap.children).forEach((d, i) => {
            const el = d as HTMLElement
            el.style.width = i === active ? "24px" : "7px"
            el.style.background = i === active ? "#cdfb45" : "rgba(255,255,255,0.2)"
          })
      }

      const update = () => {
        const tc = track.scrollLeft + track.clientWidth / 2
        let best = 0
        let bestD = Infinity
        all.forEach((c, i) => {
          const cc = c.offsetLeft + c.offsetWidth / 2
          const dd = Math.abs(cc - tc)
          const norm = Math.min(dd / (c.offsetWidth + GAP), 1.25)
          c.style.transform = "scale(" + (1 - norm * 0.17).toFixed(3) + ")"
          c.style.opacity = (1 - norm * 0.52).toFixed(3)
          c.style.zIndex = String(100 - Math.round(norm * 100))
          const shell = c.querySelector<HTMLElement>(".phone-shell")
          if (shell)
            shell.style.boxShadow = "0 28px 56px -22px rgba(0,0,0," + (0.62 * (1 - Math.min(norm, 1))).toFixed(2) + ")"
          if (dd < bestD) {
            bestD = dd
            best = i
          }
        })
        const logical = ((best % N) + N) % N
        if (logical !== active) {
          active = logical
          syncUI()
        }
      }

      // Keep scrollLeft inside the middle copy — jumping by one period is invisible.
      const wrapScroll = () => {
        const a = all[0].offsetLeft
        const lo = a + period * 0.5
        const hi = a + period * 1.5
        if (track.scrollLeft < lo) track.scrollLeft += period
        else if (track.scrollLeft >= hi) track.scrollLeft -= period
      }

      let tweenRaf: number | null = null
      const tweenTo = (target: number) => {
        if (reduceMotion) {
          track.scrollLeft = target
          update()
          return
        }
        if (tweenRaf) cancelAnimationFrame(tweenRaf)
        const start = track.scrollLeft
        const delta = target - start
        if (Math.abs(delta) < 1) return
        const dur = Math.min(620, 260 + Math.abs(delta) * 0.5)
        const t0 = performance.now()
        const ease = (p: number) => 1 - Math.pow(1 - p, 3)
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / dur)
          track.scrollLeft = start + delta * ease(p)
          if (p < 1) tweenRaf = requestAnimationFrame(step)
          else {
            tweenRaf = null
            wrapScroll()
            update()
          }
        }
        tweenRaf = requestAnimationFrame(step)
      }

      const currentBest = () => {
        const tc = track.scrollLeft + track.clientWidth / 2
        let b = 0
        let bd = Infinity
        all.forEach((c, i) => {
          const dd = Math.abs(c.offsetLeft + c.offsetWidth / 2 - tc)
          if (dd < bd) {
            bd = dd
            b = i
          }
        })
        return b
      }
      const stepBy = (dir: number) => {
        const t = currentBest() + dir
        if (t < 0 || t >= all.length) return
        tweenTo(centerLeftFor(t))
      }
      function goToLogical(logical: number) {
        const tc = track!.scrollLeft + track!.clientWidth / 2
        let idx = -1
        let bd = Infinity
        all.forEach((c, i) => {
          if (i % N !== logical) return
          const dd = Math.abs(c.offsetLeft + c.offsetWidth / 2 - tc)
          if (dd < bd) {
            bd = dd
            idx = i
          }
        })
        if (idx >= 0) tweenTo(centerLeftFor(idx))
      }

      let rafScroll: number | null = null
      const onScroll = () => {
        if (rafScroll) return
        rafScroll = requestAnimationFrame(() => {
          rafScroll = null
          if (!tweenRaf) wrapScroll()
          update()
        })
      }
      track.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)

      // Mouse drag-to-scroll (touch uses native scroll + native click).
      let down = false
      let sx = 0
      let sl = 0
      let moved = false
      let downCard: HTMLElement | null = null
      let dragMoved = false
      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return
        down = true
        moved = false
        sx = e.clientX
        sl = track.scrollLeft
        downCard = (e.target as HTMLElement).closest?.(".live-card") as HTMLElement | null
        track.classList.add("dragging")
        try {
          track.setPointerCapture(e.pointerId)
        } catch {}
      }
      const onPointerMove = (e: PointerEvent) => {
        if (!down) return
        const dx = e.clientX - sx
        if (Math.abs(dx) > 5) moved = true
        track.scrollLeft = sl - dx
      }
      const endDrag = (e: PointerEvent) => {
        if (!down) return
        down = false
        track.classList.remove("dragging")
        try {
          track.releasePointerCapture(e.pointerId)
        } catch {}
        // Pointer capture eats the native click, so drive the lightbox on a clean click.
        dragMoved = true
        setTimeout(() => {
          dragMoved = false
        }, 120)
        if (!moved && downCard) openLightbox(downCard.getAttribute("data-shot") || "", downCard.getAttribute("data-cap") || "")
        downCard = null
      }
      const onClickCapture = (e: MouseEvent) => {
        if (dragMoved) {
          e.stopPropagation()
          e.preventDefault()
        }
      }
      track.addEventListener("pointerdown", onPointerDown)
      track.addEventListener("pointermove", onPointerMove)
      track.addEventListener("pointerup", endDrag)
      track.addEventListener("pointercancel", endDrag)
      track.addEventListener("click", onClickCapture, true)

      const prevBtn = document.getElementById("livePrev")
      const nextBtn = document.getElementById("liveNext")
      const onPrev = () => stepBy(-1)
      const onNext = () => stepBy(1)
      prevBtn?.addEventListener("click", onPrev)
      nextBtn?.addEventListener("click", onNext)

      // Start centered on the first real card (the middle copy).
      track.scrollLeft = centerLeftFor(N)
      requestAnimationFrame(() => {
        update()
        syncUI()
      })

      cleanups.push(() => {
        track.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onScroll)
        track.removeEventListener("pointerdown", onPointerDown)
        track.removeEventListener("pointermove", onPointerMove)
        track.removeEventListener("pointerup", endDrag)
        track.removeEventListener("pointercancel", endDrag)
        track.removeEventListener("click", onClickCapture, true)
        prevBtn?.removeEventListener("click", onPrev)
        nextBtn?.removeEventListener("click", onNext)
        if (rafScroll) cancelAnimationFrame(rafScroll)
        if (tweenRaf) cancelAnimationFrame(tweenRaf)
        track.querySelectorAll(".live-card[data-clone]").forEach((n) => n.remove())
        dotsWrap?.replaceChildren()
      })
    }

    setupGallery()
    setupCarousel()

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
