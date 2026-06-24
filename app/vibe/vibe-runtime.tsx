"use client"

import { useEffect } from "react"

/**
 * Client-side behaviors for /vibe — a 1:1 port of the Claude Design "support.js"
 * (DCLogic) for the Vibe Members page:
 *  - style-hover / style-focus : apply the inline hover/focus declarations
 *  - brandmark   : SVG "build up" bar-scramble on load + hover (nav mark)
 *  - scroll reveal: IntersectionObserver fades sections/footer up (CSS .r-in)
 *  - vault forms : email-gated skill downloads POST to /api/subscribe (ch47-vibe)
 *  - archive     : drag + arrow carousel for the "built live" strip
 *
 * The markup is static (server-rendered, see vibe-content.tsx) and never
 * re-renders, so wiring the DOM directly here is safe. Torn down on unmount.
 *
 * The hero reveal is handled globally by globals.css (header > * { heroIn }), so
 * it is intentionally not duplicated here.
 */
export function VibeRuntime() {
  useEffect(() => {
    const reduceMotion = (() => {
      try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      } catch {
        return false
      }
    })()
    const cleanups: Array<() => void> = []

    // ── style-hover / style-focus ────────────────────────────────────────────
    const wireStateStyle = (attr: string, onEvt: string, offEvt: string) => {
      document.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((el) => {
        const extra = el.getAttribute(attr)
        if (!extra) return
        const base = el.getAttribute("style") || ""
        const on = () => el.setAttribute("style", base + ";" + extra)
        const off = () => el.setAttribute("style", base)
        el.addEventListener(onEvt, on)
        el.addEventListener(offEvt, off)
        cleanups.push(() => {
          el.removeEventListener(onEvt, on)
          el.removeEventListener(offEvt, off)
          el.setAttribute("style", base)
        })
      })
    }
    wireStateStyle("style-hover", "mouseenter", "mouseleave")
    wireStateStyle("style-focus", "focus", "blur")

    // ── brandmark scramble ("build up": each bar grows from baseline) ─────────
    const origRects = new WeakMap<SVGRectElement, { x: number; y: number; w: number; h: number }>()
    const cancelers = new WeakMap<SVGSVGElement, () => void>()
    const scramble = (svg: SVGSVGElement) => {
      const rects = Array.from(svg.querySelectorAll("rect"))
      if (!rects.length) return
      cancelers.get(svg)?.()
      const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
      const ANIM = 420
      const STAGGER = 260
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
    const brandWrap = document.getElementById("brand")
    const brandSvg = document.getElementById("brandmark") as unknown as SVGSVGElement | null
    let introTimer: ReturnType<typeof setTimeout> | undefined
    if (brandWrap && brandSvg) {
      const run = () => scramble(brandSvg)
      if (!reduceMotion) {
        brandWrap.addEventListener("mouseenter", run)
        cleanups.push(() => {
          brandWrap.removeEventListener("mouseenter", run)
          cancelers.get(brandSvg)?.()
        })
        introTimer = setTimeout(run, 280)
      }
    }

    // ── scroll reveal ────────────────────────────────────────────────────────
    let failsafe: ReturnType<typeof setTimeout> | undefined
    if (!reduceMotion) {
      const els = Array.from(document.querySelectorAll<HTMLElement>("section, footer"))
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
              setTimeout(() => show(el), Math.min(i, 8) * 75)
              i++
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

    // ── vault email forms → /api/subscribe (tag ch47-vibe) ───────────────────
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    document.querySelectorAll<HTMLFormElement>(".vault-form").forEach((form) => {
      const onSubmit = async (e: Event) => {
        e.preventDefault()
        const input = form.querySelector<HTMLInputElement>('input[name="email"]')
        const email = (input?.value || "").trim()
        if (!EMAIL_RE.test(email)) {
          if (input) {
            input.style.borderColor = "#e0533a"
            input.focus()
          }
          return
        }
        const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')
        const skill = form.getAttribute("data-skill") || ""
        if (btn) {
          btn.disabled = true
          btn.textContent = "Sending…"
          btn.style.opacity = "0.7"
        }
        let ok = false
        try {
          const res = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, source: "ch47-vibe", skill }),
          })
          ok = res.ok
        } catch {
          ok = false
        }
        if (ok) {
          form.innerHTML =
            '<div style="display:flex;align-items:center;gap:11px;background:rgba(205,251,69,0.07);border:1px solid rgba(205,251,69,0.28);border-radius:10px;padding:13px 15px">' +
            '<span style="flex:none;width:20px;height:20px;border-radius:6px;background:#cdfb45;color:#0b0b0c;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">✓</span>' +
            '<div style="font-size:13.5px;color:#f4f4ef;line-height:1.4">Sent. Check your inbox <span style="color:#74746e">— it’s on the way.</span></div>' +
            "</div>"
        } else if (btn) {
          btn.disabled = false
          btn.textContent = "Try again →"
          btn.style.opacity = "1"
        }
      }
      form.addEventListener("submit", onSubmit)
      cleanups.push(() => form.removeEventListener("submit", onSubmit))
    })

    // ── archive carousel (drag + arrows) ─────────────────────────────────────
    const track = document.getElementById("archiveTrack")
    if (track) {
      const cardWidth = () => {
        const c = track.querySelector<HTMLElement>(".arch-card")
        return c ? c.offsetWidth + 24 : 320
      }
      const tween = (target: number) => {
        const start = track.scrollLeft
        const delta = target - start
        if (Math.abs(delta) < 1) return
        if (reduceMotion) {
          track.scrollLeft = target
          return
        }
        const dur = 460
        const t0 = performance.now()
        const ease = (p: number) => 1 - Math.pow(1 - p, 3)
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / dur)
          track.scrollLeft = start + delta * ease(p)
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
      const prev = document.getElementById("archPrev")
      const next = document.getElementById("archNext")
      const onPrev = () => tween(track.scrollLeft - cardWidth())
      const onNext = () => tween(track.scrollLeft + cardWidth())
      prev?.addEventListener("click", onPrev)
      next?.addEventListener("click", onNext)

      let down = false
      let sx = 0
      let sl = 0
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return
        down = true
        sx = e.clientX
        sl = track.scrollLeft
        track.classList.add("dragging")
        try {
          track.setPointerCapture(e.pointerId)
        } catch {}
      }
      const onMove = (e: PointerEvent) => {
        if (down) track.scrollLeft = sl - (e.clientX - sx)
      }
      const onUp = (e: PointerEvent) => {
        if (!down) return
        down = false
        track.classList.remove("dragging")
        try {
          track.releasePointerCapture(e.pointerId)
        } catch {}
      }
      track.addEventListener("pointerdown", onDown)
      track.addEventListener("pointermove", onMove)
      track.addEventListener("pointerup", onUp)
      track.addEventListener("pointercancel", onUp)
      cleanups.push(() => {
        prev?.removeEventListener("click", onPrev)
        next?.removeEventListener("click", onNext)
        track.removeEventListener("pointerdown", onDown)
        track.removeEventListener("pointermove", onMove)
        track.removeEventListener("pointerup", onUp)
        track.removeEventListener("pointercancel", onUp)
      })
    }

    return () => {
      if (introTimer) clearTimeout(introTimer)
      if (failsafe) clearTimeout(failsafe)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return null
}
