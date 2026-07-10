"use client"

import { useEffect, useRef } from "react"
import { BLOCKS } from "@/components/site/mark-blocks"

interface GlitchLogoProps {
  /** Replay the scatter-assemble animation once on mount. */
  autoPlay?: boolean
  /** Width in px (the mark keeps its 46:24 ratio). */
  width?: number
  className?: string
}

/**
 * Channel 47 logo: an SVG "47" whose blocks scatter in and cycle the brand
 * palette before settling to ink. Plays on mount (nav) and replays on every
 * click. It's a button, not a link — clicking is a pure easter-egg replay
 * and intentionally does nothing else (no scroll, no navigation).
 */
export function GlitchLogo({
  autoPlay = false,
  width = 46,
  className,
}: GlitchLogoProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const play = () => {
    const el = ref.current
    if (!el) return
    el.classList.remove("gl-play")
    // Force reflow so the animation can restart from the top.
    void el.offsetWidth
    el.classList.add("gl-play")
  }

  useEffect(() => {
    if (!autoPlay) return
    const t = setTimeout(play, 90)
    return () => clearTimeout(t)
  }, [autoPlay])

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Channel 47 — replay logo animation"
      className={`gl-logo${className ? ` ${className}` : ""}`}
      style={{ width, height: (width * 24) / 46 }}
      onClick={play}
    >
      <svg
        className="gl gl-base"
        viewBox="0 0 46 24"
        fill="currentColor"
        style={{ width, height: (width * 24) / 46 }}
      >
        {BLOCKS.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.width} height={b.height} />
        ))}
      </svg>
    </button>
  )
}
