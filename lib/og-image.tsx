import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { BLOCKS, MARK_VIEWBOX } from "@/components/site/mark-blocks"

/**
 * Shared renderer for every route's opengraph-image.tsx: notes, posts,
 * skills, connectors, workshops, and the site-wide default.
 * One card layout, one font load, so every route file stays a
 * thin `getX(slug) → renderOgImage(...)` call.
 *
 * Colours are hardcoded rather than imported from globals.css: Satori (the
 * renderer behind next/og) doesn't resolve CSS custom properties, so the
 * light-theme token values are copied here as literals.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

const PAGE = "#f5f5f2"
const INK = "#191a1c"
const BODY = "#65676c"

/** Light-scheme section inks; Satori requires literal colors. */
export const TYPE_ACCENTS = { project: "#264fd5", note: "#264fd5" } as const

let fonts: Awaited<ReturnType<typeof loadFonts>> | null = null

async function loadFonts() {
  const dir = join(process.cwd(), "assets/fonts")
  return [
    { name: "Geist", data: readFileSync(join(dir, "Geist-Regular.ttf")), weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: readFileSync(join(dir, "Geist-Bold.ttf")), weight: 700 as const, style: "normal" as const },
    { name: "Geist Mono", data: readFileSync(join(dir, "GeistMono-Medium.ttf")), weight: 500 as const, style: "normal" as const },
  ]
}

interface OgImageProps {
  /** Small label above the title, e.g. "Skill", "Post" — omitted on the site-wide default. */
  kicker?: string
  title: string
  description?: string
  /** Optional accent for the small content-type label. */
  accent?: string
}

export async function renderOgImage({ kicker, title, description, accent = INK }: OgImageProps) {
  fonts ??= await loadFonts()

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: PAGE, color: INK, padding: "44px 56px", fontFamily: "Geist" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width={54} height={27} viewBox={MARK_VIEWBOX} fill={INK}>
            {BLOCKS.map((b, i) => <rect key={i} {...b} />)}
          </svg>
        </div>
        <span style={{ fontFamily: "Geist Mono", fontSize: 17, color: accent }}>{kicker === "channel47" ? "Projects & notes" : kicker ?? "Projects & notes"}</span>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden", fontSize: title.length > 90 ? 54 : 64, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.12 }}>{title}</div>
          {description ? <div style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden", marginTop: 24, fontSize: 23, lineHeight: 1.45, color: BODY }}>{description}</div> : null}
        </div>

      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 22, fontFamily: "Geist Mono", fontSize: 17, color: BODY }}>
        <span>Jackson Dean</span><span>channel47.dev</span>
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  )
}
