"use client"

import { useEffect, useRef, type CSSProperties } from "react"

/**
 * craft-canvas — the structured generative motif layer for the early-access
 * pillar cards, ported from the "CH47 Early Access" Claude Design file (its
 * `craft-canvas.js` web component). Each card gets one distinct, calm geometric
 * animation, tinted to the card and screen-blended over the colour blobs and
 * grain. This is the layer that gives the top fold its texture and quiet life:
 *
 *   grid     – a lattice of dots with a slow diagonal brightness wave  (Skills)
 *   orbits   – concentric rings with nodes circling at different rates  (Agents)
 *   network  – a fixed constellation whose edges pulse with light   (Connectors)
 *   contours – parallel topographic ridgelines that slowly drift     (Playbooks)
 *
 * Each frame is cleared and redrawn (crisp, no trails), the loop pauses when the
 * card scrolls offscreen, and reduced-motion users get a single still frame.
 */

export type Motif = "grid" | "orbits" | "network" | "contours"

type Node = { x: number; y: number; ph: number }
type Edge = { a: number; b: number; ph: number; len: number }

// seeded RNG — mulberry32
function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// smooth value-noise wave for the contour ridgelines (seeded)
function makeWave(seed: number) {
  const rnd = mulberry32(seed)
  const N = 16
  const amp: { f: number; p: number; a: number }[] = []
  for (let i = 0; i < N; i++) amp.push({ f: 0.6 + i * 0.5, p: rnd() * Math.PI * 2, a: 1 / (i + 1) })
  return function (x: number, t: number) {
    let s = 0
    let norm = 0
    for (let i = 0; i < 4; i++) {
      const w = amp[i]
      s += Math.sin(x * w.f + t + w.p) * w.a
      norm += w.a
    }
    return s / norm
  }
}

export function CraftCanvas({
  tint,
  motif,
  seed,
  alpha = 0.55,
  blend = "screen",
  speed = 1,
}: {
  tint: string
  motif: Motif
  seed: number
  alpha?: number
  blend?: CSSProperties["mixBlendMode"]
  speed?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const wave = makeWave(seed)
    let w = 0
    let h = 0
    let t = 0
    let raf: number | null = null
    let nodes: Node[] | null = null
    let edges: Edge[] | null = null

    // ---- structured layouts that depend on size (built once per resize) -----
    const build = () => {
      const rnd = mulberry32(seed)
      if (motif === "network") {
        const cols = 4
        const rows = 4
        const ns: Node[] = []
        const mx = w * 0.16
        const my = h * 0.16
        const gw = (w - mx * 2) / (cols - 1)
        const gh = (h - my * 2) / (rows - 1)
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            ns.push({
              x: mx + i * gw + (rnd() - 0.5) * gw * 0.5,
              y: my + j * gh + (rnd() - 0.5) * gh * 0.5,
              ph: rnd() * Math.PI * 2,
            })
          }
        }
        const es: Edge[] = []
        const TH = Math.min(w, h) * 0.42
        for (let a = 0; a < ns.length; a++) {
          for (let b = a + 1; b < ns.length; b++) {
            const dx = ns[a].x - ns[b].x
            const dy = ns[a].y - ns[b].y
            const d = Math.hypot(dx, dy)
            if (d < TH) es.push({ a, b, ph: rnd() * Math.PI * 2, len: d })
          }
        }
        nodes = ns
        edges = es
      }
    }

    // ---- Skills: lattice with a diagonal brightness wave --------------------
    const grid = (time: number) => {
      const gap = 20
      const r0 = Math.min(w, h)
      ctx.fillStyle = tint
      for (let x = gap; x < w; x += gap) {
        for (let y = gap; y < h; y += gap) {
          const d = (x + y) / r0
          const b = (Math.sin(d * 5.2 - time * 1.4) + 1) / 2 // 0..1 wave
          const e = Math.pow(b, 2.4) // sharpen crests
          ctx.globalAlpha = 0.06 + e * 0.4
          const rad = 0.6 + e * 1.2
          ctx.beginPath()
          ctx.arc(x, y, rad, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // ---- Agents: concentric orbits, nodes circling at different rates -------
    const orbits = (time: number) => {
      const cx = w * 0.5
      const cy = h * 0.54
      const R = Math.min(w, h) * 0.46
      const rings = [0.34, 0.56, 0.78, 1.0]
      ctx.strokeStyle = tint
      ctx.fillStyle = tint
      ctx.lineWidth = 0.8
      rings.forEach((rr, i) => {
        const rad = R * rr
        ctx.globalAlpha = 0.09
        ctx.beginPath()
        ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.stroke()
        const dir = i % 2 ? -1 : 1
        const sp = 0.5 + i * 0.16
        const count = i + 1
        for (let k = 0; k < count; k++) {
          const ang = dir * time * sp + (k / count) * Math.PI * 2 + i * 0.7
          const nx = cx + Math.cos(ang) * rad
          const ny = cy + Math.sin(ang) * rad
          // faint leading arc
          ctx.globalAlpha = 0.11
          ctx.beginPath()
          ctx.arc(cx, cy, rad, ang - dir * 0.5, ang)
          ctx.stroke()
          ctx.globalAlpha = 0.5
          ctx.beginPath()
          ctx.arc(nx, ny, 1.7, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      ctx.globalAlpha = 0.36
      ctx.beginPath()
      ctx.arc(cx, cy, 2.0, 0, Math.PI * 2)
      ctx.fill()
    }

    // ---- Connectors: constellation with pulses traveling the edges ----------
    const network = (time: number) => {
      if (!edges || !nodes) return
      const N = nodes
      const E = edges
      ctx.strokeStyle = tint
      ctx.fillStyle = tint
      ctx.lineWidth = 0.8
      E.forEach((e) => {
        const a = N[e.a]
        const b = N[e.b]
        ctx.globalAlpha = 0.07
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
        // a light pulse sliding along the edge
        const u = (Math.sin(time * 0.9 + e.ph) + 1) / 2
        const px = a.x + (b.x - a.x) * u
        const py = a.y + (b.y - a.y) * u
        const glow = Math.pow(Math.sin(time * 0.9 + e.ph) * 0.5 + 0.5, 3)
        ctx.globalAlpha = 0.1 + glow * 0.32
        ctx.beginPath()
        ctx.arc(px, py, 1.4, 0, Math.PI * 2)
        ctx.fill()
      })
      N.forEach((n) => {
        const tw = (Math.sin(time * 1.3 + n.ph) + 1) / 2
        ctx.globalAlpha = 0.2 + tw * 0.34
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.6 + tw * 0.9, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // ---- Playbooks: parallel topographic ridgelines slowly drifting ---------
    const contours = (time: number) => {
      const lines = 9
      const step = Math.max(6, Math.floor(w / 60))
      ctx.strokeStyle = tint
      ctx.lineWidth = 0.9
      ctx.lineJoin = "round"
      for (let i = 0; i < lines; i++) {
        const baseY = (h * (i + 0.6)) / (lines + 0.2)
        const amp = h * 0.05
        ctx.globalAlpha = 0.06 + (i / lines) * 0.07
        ctx.beginPath()
        for (let x = -step; x <= w + step; x += step) {
          const y = baseY + wave((x / w) * 6 + i * 0.4, time * 0.5 + i * 0.3) * amp
          if (x <= -step) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }

    const motifs: Record<Motif, (time: number) => void> = { grid, orbits, network, contours }

    const frame = () => {
      if (!w || !h) return
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"
      ;(motifs[motif] || grid)(t)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(r.width * dpr)
      canvas.height = Math.round(r.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      if (reduceMotion) frame()
    }

    const play = () => {
      if (reduceMotion || raf !== null) return
      const loop = () => {
        t += 0.0072 * speed
        frame()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }
    const pause = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf)
        raf = null
      }
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) play()
        else pause()
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    resize()
    if (reduceMotion) frame()
    else play()

    return () => {
      pause()
      ro.disconnect()
      io.disconnect()
    }
  }, [tint, motif, seed, speed])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 1,
        mixBlendMode: blend,
        opacity: alpha,
        pointerEvents: "none",
      }}
    />
  )
}
