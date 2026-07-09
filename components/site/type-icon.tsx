import type { ContentTypeKey } from "@/lib/site-content"

/** One 16×16 glyph per content type — shared by the mobile drawer, the Home
 * category rows, and the Browse filter chips so the same shapes carry the
 * same meaning everywhere they appear. */
const PATHS: Record<ContentTypeKey, string> = {
  posts: "M1 2.5h14v2H1zM1 7h14v2H1zM1 11.5h9v2H1z",
  skills: "M8 1l7 7-7 7-7-7z",
  connectors: "M1 4.5h5v7H1zM10 4.5h5v7h-5zM6 7h4v2H6z",
  workshops: "M4.5 2.5l9.5 5.5-9.5 5.5z",
}

export function TypeIcon({
  type,
  className,
}: {
  type: ContentTypeKey
  className?: string
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
      <path d={PATHS[type]} />
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
