"use client"

import { useState } from "react"
import {
  BLOCKS,
  MARK_HEIGHT,
  MARK_VIEWBOX,
  MARK_WIDTH,
} from "@/components/site/mark-blocks"
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
  /** Width in px (the mark keeps its 48:24 ratio). */
  width?: number
  className?: string
}

/**
 * channel47 logo: an SVG "47" whose blocks build in at staggered offsets,
 * each in a content-type colour, before settling to ink. Plays on mount
 * (Home) and replays on every click. It's a button, not a link — clicking
 * is a pure easter-egg replay and intentionally does nothing else (no
 * scroll, no navigation).
 */
export function GlitchLogo({
  autoPlay = false,
  width = MARK_WIDTH,
  className,
}: GlitchLogoProps) {
  const [pulse, setPulse] = useState(0)
  const playing = autoPlay || pulse > 0
  const height = (width * MARK_HEIGHT) / MARK_WIDTH

  return (
    <button
      type="button"
      aria-label="channel47 — replay logo animation"
      className={`gl-logo${className ? ` ${className}` : ""}`}
      style={{ width, height }}
      onClick={() => setPulse((p) => p + 1)}
    >
      <svg
        className="gl gl-base"
        viewBox={MARK_VIEWBOX}
        fill="currentColor"
        style={{ width, height }}
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
