import Link from "next/link"

const ART_LABEL = {
  notes: "cover",
  posts: "hero img",
  skills: "cover",
  connectors: "logo",
  workshops: "still",
} as const

export interface Cover {
  title: string
  meta: string
  href: string
  type: keyof typeof ART_LABEL
}

/**
 * A Home category row's open-state item — a riso-hatch card in the row's
 * type colour, corner-tagged with what kind of art would live there once
 * a real asset exists (cover, logo, hero image, session still).
 */
export function CoverCard({ cover }: { cover: Cover }) {
  return (
    <Link href={cover.href} className="cover-card">
      <span className="cover-card-art" aria-hidden>
        <span className="cover-card-tag mono">{ART_LABEL[cover.type]}</span>
      </span>
      <span className="cover-card-name">{cover.title}</span>
      <span className="cover-card-meta">{cover.meta}</span>
    </Link>
  )
}
