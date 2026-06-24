"use client"

import { useEffect } from "react"

/**
 * Client-side behaviors ported 1:1 from the Claude Design "support.js" (DCLogic):
 *  - style-hover  : applies the hover style declarations on mouseenter/leave
 *  - brandmark    : SVG "build up" bar-scramble on load + on hover (nav + footer marks)
 *  - scroll reveal: IntersectionObserver fades sections/cards up (matches CSS .r-in)
 *  - carousel     : full-bleed coverflow live-work slider — cloned card sets for
 *                   seamless infinite loop, drag/swipe, arrows, dots, counter
 *  - gallery      : click a phone card -> full scrollable lightbox
 *  - booking      : [data-open-booking] CTAs open the cal.com modal (lazy-loaded)
 *  - date         : fills "first advertorial by {date}" with the next 5 business days
 *
 * The markup is static (server-rendered) and never re-renders, so wiring the DOM
 * directly here is safe. Everything is torn down on unmount.
 */
export function AdvertorialRuntime() {
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

    // "Build up" scramble (the design's default scrambleStyle): each bar grows
    // up from its baseline, staggered left-to-right by the bar's x position, so
    // the mark assembles itself one column at a time.
    const scramble = (svg: SVGSVGElement) => {
      const rects = Array.from(svg.querySelectorAll("rect"))
      if (!rects.length) return
      cancelers.get(svg)?.()
      const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
      const ANIM = 420 // per-bar growth time (ms)
      const STAGGER = 260 // spread of start delays across the mark's width (ms)
      const specs = rects.map((r) => {
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
        return { r, o, delay: 0, dur: 0 }
      })
      const xs = specs.map((s) => s.o.x)
      const minX = Math.min(...xs)
      const spanX = Math.max(...xs) - minX || 1
      for (const s of specs) {
        s.delay = ((s.o.x - minX) / spanX) * STAGGER
        s.dur = s.delay + ANIM
      }
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
        const t = now - t0
        let done = 0
        for (const s of specs) {
          if (t >= s.dur) {
            s.r.setAttribute("x", String(s.o.x))
            s.r.setAttribute("y", String(s.o.y))
            s.r.setAttribute("width", String(s.o.w))
            s.r.setAttribute("height", String(s.o.h))
            done++
            continue
          }
          const p = easeOut(clamp01((t - s.delay) / ANIM))
          const h = s.o.h * p
          s.r.setAttribute("x", String(s.o.x))
          s.r.setAttribute("width", String(s.o.w))
          s.r.setAttribute("height", h.toFixed(2))
          s.r.setAttribute("y", (s.o.y + s.o.h - h).toFixed(2))
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

      // Autoplay: advance every AUTOPLAY_MS, but skip a tick while the user is
      // hovering/dragging, the carousel is off-screen, the tab is hidden, or
      // reduced motion is requested. Manual nav calls restartAuto() to reset the
      // countdown so it never jumps right after an interaction.
      const AUTOPLAY_MS = 4500
      let autoTimer: ReturnType<typeof setInterval> | null = null
      let hoverPaused = false
      let dragPaused = false
      let offscreenPaused = false
      function tick() {
        if (reduceMotion || hoverPaused || dragPaused || offscreenPaused || document.hidden) return
        stepBy(1)
      }
      function stopAuto() {
        if (autoTimer) {
          clearInterval(autoTimer)
          autoTimer = null
        }
      }
      function startAuto() {
        if (reduceMotion) return
        stopAuto()
        autoTimer = setInterval(tick, AUTOPLAY_MS)
      }
      function restartAuto() {
        startAuto()
      }

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
          b.addEventListener("click", () => {
            goToLogical(i)
            restartAuto()
          })
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
        dragPaused = true
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
        // Reset the autoplay pause on every pointer release (mouse + touch).
        dragPaused = false
        restartAuto()
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
      const onPrev = () => {
        stepBy(-1)
        restartAuto()
      }
      const onNext = () => {
        stepBy(1)
        restartAuto()
      }
      prevBtn?.addEventListener("click", onPrev)
      nextBtn?.addEventListener("click", onNext)

      // Pause autoplay on hover (mouse over the whole carousel region), and on
      // visibility changes / scrolling off-screen.
      const region = track.parentElement
      const onEnter = () => {
        hoverPaused = true
      }
      const onLeave = () => {
        hoverPaused = false
      }
      region?.addEventListener("pointerenter", onEnter)
      region?.addEventListener("pointerleave", onLeave)
      const onVis = () => {
        if (!document.hidden) restartAuto()
      }
      document.addEventListener("visibilitychange", onVis)
      let io: IntersectionObserver | null = null
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(([e]) => { offscreenPaused = !e.isIntersecting }, { threshold: 0.12 })
        io.observe(track)
      }

      // Start centered on the first real card (the middle copy).
      track.scrollLeft = centerLeftFor(N)
      requestAnimationFrame(() => {
        update()
        syncUI()
      })
      startAuto()

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
        region?.removeEventListener("pointerenter", onEnter)
        region?.removeEventListener("pointerleave", onLeave)
        document.removeEventListener("visibilitychange", onVis)
        io?.disconnect()
        stopAuto()
        if (rafScroll) cancelAnimationFrame(rafScroll)
        if (tweenRaf) cancelAnimationFrame(tweenRaf)
        track.querySelectorAll(".live-card[data-clone]").forEach((n) => n.remove())
        dotsWrap?.replaceChildren()
      })
    }

    // ── booking modal + cal.com inline embed ─────────────────────────────────
    // Every [data-open-booking] CTA opens the in-page modal that hosts a cal.com
    // inline embed. The calendar is loaded lazily on first open (no cal.com JS on
    // page load), themed to match the design. Close on ✕, click-outside, or Esc.
    type CalApi = ((...args: unknown[]) => void) & {
      loaded?: boolean
      ns?: Record<string, CalApi>
      q?: unknown[][]
    }
    const calWindow = window as unknown as { Cal?: CalApi; document: Document }
    const CAL_LINK = "ctrlswing/15min"
    let calStarted = false
    let bkPrevOverflow: string | undefined

    const hideCalSkeleton = () => {
      const sk = document.getElementById("cal-skeleton")
      if (sk && sk.style.display !== "none") {
        sk.style.transition = "opacity .4s ease"
        sk.style.opacity = "0"
        setTimeout(() => {
          if (sk) sk.style.display = "none"
        }, 420)
      }
    }

    // Official cal.com inline-embed loader: stubs window.Cal as a command queue
    // and injects embed.js on first call (the real script drains the queue).
    const loadCalEmbed = () => {
      if (calWindow.Cal) return
      const w = calWindow
      const push = (a: CalApi, ar: unknown[]) => {
        a.q!.push(ar)
      }
      w.Cal = function (...ar: unknown[]) {
        const cal = w.Cal as CalApi
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          const s = w.document.createElement("script")
          s.src = "https://app.cal.com/embed/embed.js"
          w.document.head.appendChild(s)
          cal.loaded = true
        }
        if (ar[0] === "init") {
          const api = function (...a: unknown[]) {
            push(api as unknown as CalApi, a)
          } as unknown as CalApi
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === "string") {
            cal.ns![namespace] = cal.ns![namespace] || api
            push(cal.ns![namespace], ar)
            push(cal, ["initNamespace", namespace])
          } else {
            push(cal, ar)
          }
          return
        }
        push(cal, ar)
      } as CalApi
    }

    const initCal = () => {
      const el = document.getElementById("cal-embed")
      if (!el || calStarted) return
      loadCalEmbed()
      const Cal = calWindow.Cal
      if (!Cal) return
      calStarted = true
      el.replaceChildren() // clear without innerHTML
      Cal("init", { origin: "https://app.cal.com" })
      Cal("inline", { elementOrSelector: "#cal-embed", calLink: CAL_LINK, layout: "month_view", config: { theme: "dark" } })
      Cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          dark: { "cal-brand": "#cdfb45", "cal-bg": "#0b0b0c", "cal-bg-emphasis": "#141416", "cal-bg-muted": "#0f0f11" },
        },
      })
      Cal("on", { action: "*", callback: () => hideCalSkeleton() })
      setTimeout(hideCalSkeleton, 4500)
    }

    const closeBooking = () => {
      const ov = document.getElementById("book-modal-overlay")
      if (ov) ov.style.display = "none"
      document.body.style.overflow = bkPrevOverflow ?? ""
    }
    const openBooking = () => {
      const ov = document.getElementById("book-modal-overlay")
      if (!ov) return
      ov.style.display = "flex"
      ov.style.animation = "none"
      void ov.offsetWidth // force reflow so the entrance animation replays
      ov.style.animation = "ovIn .3s ease both"
      const card = document.getElementById("book-modal-card")
      if (card) {
        card.style.animation = "none"
        void card.offsetWidth
        card.style.animation = "mdIn .42s cubic-bezier(.2,.7,.2,1) both"
        card.scrollTop = 0
      }
      bkPrevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      initCal()
    }

    const setupBooking = () => {
      document.querySelectorAll<HTMLElement>("[data-open-booking]").forEach((t) => {
        const onClick = (e: Event) => {
          e.preventDefault()
          openBooking()
        }
        t.addEventListener("click", onClick)
        cleanups.push(() => t.removeEventListener("click", onClick))
      })
      const ov = document.getElementById("book-modal-overlay")
      if (ov) {
        const onOverlay = (e: MouseEvent) => {
          if (e.target === ov) closeBooking()
        }
        ov.addEventListener("click", onOverlay)
        cleanups.push(() => ov.removeEventListener("click", onOverlay))
      }
      const close = document.getElementById("close-modal")
      if (close) {
        const onClose = () => closeBooking()
        close.addEventListener("click", onClose)
        cleanups.push(() => close.removeEventListener("click", onClose))
      }
      const onEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeBooking()
      }
      document.addEventListener("keydown", onEsc)
      cleanups.push(() => {
        document.removeEventListener("keydown", onEsc)
        // restore scroll if we unmount while the modal is open
        if (bkPrevOverflow !== undefined) document.body.style.overflow = bkPrevOverflow
      })
    }

    setupGallery()
    setupCarousel()
    setupBooking()

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
