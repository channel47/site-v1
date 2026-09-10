import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import sharp from "sharp"
import { MARK_PATH, MARK_VIEWBOX } from "@/components/site/mark"

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
const artworkCache = new Map<string, Promise<string>>()

function loadArtwork(path: string) {
  let cached = artworkCache.get(path)
  if (!cached) {
    // Satori cannot decode WebP data URIs. Keep the collection's original file
    // and convert only the social-card input to a small PNG.
    cached = sharp(readFileSync(join(process.cwd(), "public", path)))
      .resize(440, 440, { fit: "inside", withoutEnlargement: true })
      .png().toBuffer().then((data) => `data:image/png;base64,${data.toString("base64")}`)
    artworkCache.set(path, cached)
  }
  return cached
}

async function loadFonts() {
  const dir = join(process.cwd(), "assets/fonts")
  return [
    { name: "Instrument Sans", data: readFileSync(join(dir, "InstrumentSans-Regular.ttf")), weight: 400 as const, style: "normal" as const },
    { name: "Instrument Serif", data: readFileSync(join(dir, "InstrumentSerif-Regular.ttf")), weight: 400 as const, style: "normal" as const },
  ]
}

interface OgImageProps {
  /** Small label above the title, e.g. "Skill", "Post" — omitted on the site-wide default. */
  kicker?: string
  title: string
  description?: string
  /** Optional accent for the small content-type label. */
  accent?: string
  /** A local collection cover, shared with the page's visual identity. */
  artwork?: string
}

export async function renderOgImage({ kicker, title, description, accent = INK, artwork }: OgImageProps) {
  fonts ??= await loadFonts()
  const art = artwork?.startsWith("/") && !artwork.startsWith("//") ? await loadArtwork(artwork) : undefined

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: art ? "#ffffff" : PAGE, color: INK, padding: "48px 56px", fontFamily: "Instrument Sans" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width={64} height={32} viewBox={MARK_VIEWBOX} fill={INK}>
            <path d={MARK_PATH} />
          </svg>
        </div>
        <span style={{ fontSize: 23, color: accent }}>{kicker === "channel47" ? "Projects & notes" : kicker ?? "Projects & notes"}</span>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", width: art ? 628 : "100%", flexShrink: 0 }}>
          <div style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4, overflow: "hidden", fontFamily: "Instrument Serif", maxWidth: art ? 628 : 900, fontSize: art ? (title.length > 90 ? 64 : 76) : 96, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.02 }}>{title}</div>
          {!art && description ? <div style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden", maxWidth: 930, marginTop: 28, fontSize: 25, lineHeight: 1.4, color: BODY }}>{description}</div> : null}
        </div>
        {art ? <img src={art} alt="" width={440} height={440} style={{ objectFit: "contain" }} /> : null}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: BODY }}>
        <span>Jackson Dean</span><span>channel47.dev</span>
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  )
}
