import { TYPE_SHINES, type ContentTypeKey } from "@/lib/site-content"
import { bitAnim } from "./bit-anim"

/** One 16×16 glyph per content type — three blocks arranged per type, shared
 * by the mobile drawer, the Home category rows, and the Browse filter chips
 * so the same shapes carry the same meaning everywhere they appear. Built
 * from rects (not a path) so the blocks can build in like the "47" mark. */
const BITS: Record<
  ContentTypeKey,
  ReadonlyArray<readonly [number, number, number, number]>
> = {
  notes: [
    [1, 1, 6, 14],
    [9, 1, 6, 6],
    [9, 9, 6, 6],
  ],
  posts: [
    [1, 1, 6, 14],
    [9, 1, 6, 6],
    [9, 9, 6, 6],
  ],
  skills: [
    [1, 1, 14, 6],
    [1, 9, 6, 6],
    [9, 9, 6, 6],
  ],
  connectors: [
    [1, 1, 6, 6],
    [9, 1, 6, 6],
    [1, 9, 14, 6],
  ],
  workshops: [
    [1, 1, 6, 6],
    [1, 9, 6, 6],
    [9, 1, 6, 14],
  ],
}

export function TypeIcon({
  type,
  className,
  pulse,
  delay = 0.05,
}: {
  type: ContentTypeKey
  className?: string
  /** When set, the blocks build in staggered (same treatment as the logo);
   * bump the value to replay. Omit for a static glyph. */
  pulse?: number
  /** Base delay in seconds before the build starts. */
  delay?: number
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {BITS[type].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          style={
            pulse !== undefined
              ? bitAnim(i, pulse, delay, TYPE_SHINES[type])
              : undefined
          }
        />
      ))}
    </svg>
  )
}

/** The "All" filter chip's icon — a four-square grid, not tied to any one
 * content type's colour. */
export function AllTypesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M1 1h6v6H1zM9 1h6v6H9zM1 9h6v6H1zM9 9h6v6H9z" />
    </svg>
  )
}
