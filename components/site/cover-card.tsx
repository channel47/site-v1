import Link from "next/link"
import { CoverArt } from "./cover-art"
import type { ContentTypeKey } from "@/lib/site-content"

export interface Cover {
  title: string
  meta: string
  href: string
  type: ContentTypeKey
}

/**
 * A Home category row's open-state item — generative twinkle cover art in
 * the row's type colour (see cover-art.tsx), hashed from the title so every
 * piece gets a cover for free, over the tint field the design's round-3
 * covers sit on.
 */
export function CoverCard({ cover }: { cover: Cover }) {
  return (
    <Link href={cover.href} className="cover-card">
      <CoverArt title={cover.title} type={cover.type} />
      <span className="cover-card-name">{cover.title}</span>
      <span className="cover-card-meta">{cover.meta}</span>
    </Link>
  )
}
