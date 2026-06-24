// Regenerates app/vibe/vibe-content.tsx from the Claude Design source at
// design-import/Vibe Members.dc.html.
//
// Shared transforms live in scripts/lib/dc-build.mjs; this file is the per-page
// config (CTA rewrites). Interactivity lives in app/vibe/vibe-runtime.tsx (a 1:1
// port of the design's support.js). Re-run after pulling a new design version:
//
//   node scripts/build-vibe.mjs
//
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  emit,
  extractCss,
  extractHtml,
  readDesign,
  stripConditionals,
  stripTokens,
  wireBooking,
} from "./lib/dc-build.mjs"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = join(ROOT, "design-import", "Vibe Members.dc.html")
const OUT = join(ROOT, "app", "vibe", "vibe-content.tsx")

const raw = readDesign(SRC)
const css = extractCss(raw)

let html = extractHtml(raw)
html = stripConditionals(html) // showTopBanner defaults on
html = stripTokens(html) // strip any stray templating tokens

// Make CTAs real: booking opens cal.com; the studio links point at the canonical
// home `/` where the offer lives.
html = wireBooking(html)
html = html.split("Advertorials on Tap.dc.html").join("/")

emit({
  out: OUT,
  component: "VibeContent",
  css,
  html,
  source: "Vibe Members.dc.html",
  script: "build-vibe.mjs",
  runtime: "vibe-runtime.tsx",
})
