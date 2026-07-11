import Link from "next/link"
import {
  BLOCKS,
  MARK_HEIGHT,
  MARK_VIEWBOX,
  MARK_WIDTH,
} from "@/components/site/mark-blocks"

/**
 * Static "47" mark that links home. The landing page's GlitchLogo is a
 * replay-on-click button by design; on inner pages the mark's job flips to
 * navigation, so this renders the same geometry as a plain link — no client
 * JS, no animation.
 */
export function MarkLink() {
  return (
    <Link href="/" aria-label="channel47 — home" className="st-mark">
      <svg
        viewBox={MARK_VIEWBOX}
        width={MARK_WIDTH}
        height={MARK_HEIGHT}
        fill="currentColor"
        aria-hidden
      >
        {BLOCKS.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.width} height={b.height} />
        ))}
      </svg>
    </Link>
  )
}
