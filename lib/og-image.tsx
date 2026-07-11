import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

/**
 * Shared renderer for every route's dynamic opengraph-image.tsx (docs/PLAN.md
 * content types: posts, skills, connectors, workshops, plus the site-wide
 * default). One card layout, one font load, so every route file stays a
 * thin `getX(slug) → renderOgImage(...)` call.
 *
 * Colours are hardcoded rather than imported from globals.css: Satori (the
 * renderer behind next/og) doesn't resolve CSS custom properties, so the
 * light-theme token values are copied here as literals.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

const PAGE = "#fdfdfc"
const INK = "#161718"
const BODY = "rgba(22, 23, 24, 0.55)"
const BRAND_MONO = "rgba(22, 23, 24, 0.55)"

/** Matches --c-skill/--c-connector/--c-post/--c-workshop in globals.css. */
export const TYPE_ACCENTS = {
  skill: "#bc6b62",
  connector: "#18998b",
  post: "#a27f30",
  workshop: "#ad6b9b",
} as const

/** Matches --gradient in globals.css — the site-wide default's top bar. */
const BRAND_GRADIENT = "linear-gradient(90deg, #bc6b62, #ad6b9b, #6583c4, #18998b, #699350, #938632)"

/** Same six blocks as components/site/mark-blocks.ts — the "47" mark. */
const MARK_BLOCKS = [
  { x: 0, y: 0, width: 7, height: 18 },
  { x: 7, y: 11, width: 7, height: 7 },
  { x: 14, y: 0, width: 7, height: 24 },
  { x: 27, y: 0, width: 14, height: 7 },
  { x: 41, y: 0, width: 7, height: 12 },
  { x: 34, y: 12, width: 7, height: 12 },
]

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
  /** A TYPE_ACCENTS value, or "gradient" for the site-wide default's brand bar. */
  accent?: string
}

export async function renderOgImage({ kicker, title, description, accent = "gradient" }: OgImageProps) {
  fonts ??= await loadFonts()
  const isGradient = accent === "gradient"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAGE,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", width: "100%", height: 10, background: isGradient ? BRAND_GRADIENT : accent }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-between",
            padding: "64px 76px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {kicker ? (
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist Mono",
                  fontWeight: 500,
                  fontSize: 22,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isGradient ? INK : accent,
                  marginBottom: 28,
                }}
              >
                {kicker}
              </div>
            ) : null}
            <div
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                fontWeight: 700,
                fontSize: 58,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              {title}
            </div>
            {description ? (
              <div
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  marginTop: 26,
                  fontWeight: 400,
                  fontSize: 27,
                  lineHeight: 1.5,
                  color: BODY,
                }}
              >
                {description}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 11,
                background: INK,
              }}
            >
              <svg width={24} height={12} viewBox="0 0 48 24" fill="white">
                {MARK_BLOCKS.map((b, i) => (
                  <rect key={i} x={b.x} y={b.y} width={b.width} height={b.height} />
                ))}
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Geist Mono",
                fontWeight: 500,
                fontSize: 22,
                letterSpacing: "0.02em",
                color: BRAND_MONO,
                marginLeft: 16,
              }}
            >
              channel47.dev
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}
