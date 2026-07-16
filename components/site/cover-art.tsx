import type { CSSProperties } from "react"
import { TYPE_SHINES, type ContentTypeKey } from "@/lib/site-content"

/**
 * Generative cover art for the Home category rows — the "Twinkle" direction
 * from the Cover Art Directions design file (3a): the dissolve grammar at
 * tint saturation. A coarse 14×3 grid of small cells, hashed from the
 * title, densest away from the text; most cells fade in and out on slow
 * offset cycles (`c47-cover-twinkle` in globals.css), so the fingerprint is
 * always quietly shifting.
 *
 * Deterministic per title — the hash-seeded rng below, never Math.random —
 * so the server and client render identical art, and each new piece gets a
 * cover for free. The negative animation delays start every cell mid-cycle.
 */

/** FNV-1a seed → xorshift32, ported verbatim from the design file's rng(). */
function rng(seed: string): () => number {
  let h = 2166136261
  for (let k = 0; k < seed.length; k++) {
    h ^= seed.charCodeAt(k)
    h = Math.imul(h, 16777619) >>> 0
  }
  return () => {
    h ^= h << 13
    h >>>= 0
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return h / 4294967296
  }
}

interface Cell {
  x: number
  y: number
  /** Tint strength as a color-mix percentage; "shine" cells render in the
   * type's brighter shine twin at full strength. */
  tint: number | "shine"
  /** Twinkle cycle, or null for the ~10% of cells that hold still. */
  anim: { duration: string; delay: string } | null
}

/** The design file's tint alphas ("40"/"5c"/"78") as color-mix percentages. */
const TINTS = [25, 36, 47]

/** Twinkle composition, ported from the design file's twinkle(): 3×3 cells
 * on a 4-unit pitch across the 56×24 canvas, density rising toward the
 * right and thinning row by row so the text zone stays quiet. */
function twinkle(title: string): Cell[] {
  const rnd = rng(`${title}:i`)
  const pick = <T,>(a: readonly T[]): T => a[Math.floor(rnd() * a.length)]
  const cells: Cell[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 14; col++) {
      if (rnd() >= (col / 13) * 0.85 - row * 0.06) continue
      const tint = rnd() < 0.15 ? ("shine" as const) : pick(TINTS)
      const anim =
        rnd() < 0.9
          ? {
              duration: `${(2.5 + rnd() * 3).toFixed(1)}s`,
              delay: `${(-rnd() * 6).toFixed(1)}s`,
            }
          : null
      cells.push({ x: col * 4 + 0.5, y: row * 4 + 0.5, tint, anim })
    }
  }
  return cells
}

export function CoverArt({
  title,
  type,
}: {
  title: string
  type: ContentTypeKey
}) {
  return (
    <svg className="cover-card-art" viewBox="0 0 56 24" aria-hidden>
      {twinkle(title).map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={3}
          height={3}
          style={
            {
              color:
                c.tint === "shine"
                  ? TYPE_SHINES[type]
                  : `color-mix(in srgb, var(--type-color) ${c.tint}%, transparent)`,
              ...(c.anim
                ? {
                    animation: `c47-cover-twinkle ${c.anim.duration} ease-in-out ${c.anim.delay} infinite`,
                  }
                : {}),
            } as CSSProperties
          }
        />
      ))}
    </svg>
  )
}
