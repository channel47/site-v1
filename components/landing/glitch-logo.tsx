"use client"

import { useState } from "react"
import { BLOCKS } from "@/components/site/mark-blocks"
import { bitAnim } from "@/components/site/bit-anim"

/** Build-in accent per block — the four content-type colours, cycled. */
const BIT_COLORS = [
  "var(--c-post)",
  "var(--c-skill)",
  "var(--c-connector)",
  "var(--c-workshop)",
]

interface GlitchLogoProps {
  /** Play the block build-in once on mount. */
  autoPlay?: boolean
  /** Width in px (the mark keeps its 46:24 ratio). */
  width?: number
  className?: string
}

/**
 * Channel 47 logo: an SVG "47" whose blocks build in at staggered offsets,
 * each in a content-type colour, before settling to ink. Plays on mount
 * (Home) and replays on every click. It's a button, not a link — clicking
 * is a pure easter-egg replay and intentionally does nothing else (no
 * scroll, no navigation).
 */
export function GlitchLogo({
  autoPlay = false,
  width = 46,
  className,
}: GlitchLogoProps) {
  const [pulse, setPulse] = useState(0)
  const playing = autoPlay || pulse > 0

  return (
    <button
      type="button"
      aria-label="Channel 47 — replay logo animation"
      className={`gl-logo${className ? ` ${className}` : ""}`}
      style={{ width, height: (width * 24) / 46 }}
      onClick={() => setPulse((p) => p + 1)}
    >
      <svg
        className="gl gl-base"
        viewBox="0 0 46 24"
        fill="currentColor"
        style={{ width, height: (width * 24) / 46 }}
      >
        {BLOCKS.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.width}
            height={b.height}
            style={
              playing
                ? bitAnim(i, pulse, 0.05, BIT_COLORS[i % BIT_COLORS.length])
                : undefined
            }
          />
        ))}
      </svg>
    </button>
  )
}
