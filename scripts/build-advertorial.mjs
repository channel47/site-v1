// Regenerates app/_offer/advertorial-content.tsx from the Claude Design source
// at design-import/Advertorials on Tap.dc.html.
//
// Shared transforms live in scripts/lib/dc-build.mjs; this file is the per-page
// config (asset remaps + CTA rewrites). Interactivity stays in
// advertorial-runtime.tsx (a 1:1 port of the design's support.js). Re-run after
// pulling a new design version:
//
//   node scripts/build-advertorial.mjs
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
const SRC = join(ROOT, "design-import", "Advertorials on Tap.dc.html")
const OUT = join(ROOT, "app", "_offer", "advertorial-content.tsx")

// pasted-* design uploads → committed /public/uploads/work-*.png (same mockups).
// The headshot (083B4BB2…jpeg) maps to the committed /public/uploads/jackson.jpg.
const IMG = {
  "uploads/pasted-1781817173124-0.png": "/uploads/work-cookware.png",
  "uploads/pasted-1781817193058-0.png": "/uploads/work-wellness.png",
  "uploads/pasted-1781817203382-0.png": "/uploads/work-coaching.png",
  "uploads/pasted-1781817212345-0.png": "/uploads/work-hearing.png",
  "uploads/pasted-1781817221757-0.png": "/uploads/work-pet.png",
  "uploads/pasted-1781817230964-0.png": "/uploads/work-beauty.png",
  "uploads/083B4BB2-5D49-4CD5-A788-8B3C96667734.jpeg": "/uploads/jackson.jpg",
}

const raw = readDesign(SRC)
const css = extractCss(raw)

let html = extractHtml(raw)
html = stripConditionals(html) // showWorkshopBanner defaults on
html = html.replace(
  /\{\{\s*firstAdvertorialDate\s*\}\}/g,
  "<span data-first-advertorial-date>in a few days</span>",
)
html = stripTokens(html) // any other stray tokens
html = html.replace('<div id="page" ', '<div id="page" data-proof="on" ') // proofFirstLayout default true

// Remap design asset paths to the committed /public/uploads files.
for (const [from, to] of Object.entries(IMG)) html = html.split(from).join(to)

// Make CTAs real: booking opens the cal modal; the pricing buy button → email.
html = wireBooking(html)
html = html.replace(
  'href="#" style="display:flex;align-items:center;justify-content:center;gap:9px;text-align:center;background:#cdfb45;color:#0b0b0c;padding:18px',
  'href="mailto:jackson@channel47.dev?subject=Start%20an%20advertorial" style="display:flex;align-items:center;justify-content:center;gap:9px;text-align:center;background:#cdfb45;color:#0b0b0c;padding:18px',
)
html = html.split('jackson@channel47.co"').join('jackson@channel47.dev"') // fix .co typo

emit({
  out: OUT,
  component: "AdvertorialContent",
  css,
  html,
  source: "Advertorials on Tap.dc.html",
  script: "build-advertorial.mjs",
  runtime: "page-runtime.tsx",
})
