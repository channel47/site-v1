import Link from "next/link"
import {
  MARK_PATH,
  MARK_HEIGHT,
  MARK_VIEWBOX,
  MARK_WIDTH,
} from "@/components/site/mark"

/**
 * Static "47" mark that links home. The landing page's GlitchLogo is a
 * replay-on-click button by design; on inner pages the mark's job flips to
 * navigation, so this renders the same geometry as a plain link — no client
 * JS, no animation.
 */
export function MarkLink({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" aria-label="Channel47 — home" className={`st-mark${small ? " st-mark-small" : ""}`}>
      <svg
        viewBox={MARK_VIEWBOX}
        width={MARK_WIDTH}
        height={MARK_HEIGHT}
        fill="currentColor"
        aria-hidden
      >
        <path d={MARK_PATH} />
      </svg>
    </Link>
  )
}
