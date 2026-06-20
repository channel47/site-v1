// Regenerates app/_offer/advertorial-content.tsx from the Claude Design
// source at design-import/Advertorials on Tap.dc.html.
//
// The design ships as static HTML with inline styles + a behavior script. We
// render its markup verbatim (server-side, fully crawlable) via
// dangerouslySetInnerHTML, with a handful of deterministic rewrites so it runs
// inside the Next app. Interactivity stays in advertorial-runtime.tsx (a 1:1 port of
// the design's support.js). Re-run after pulling a new design version:
//
//   node scripts/build-advertorial.mjs
//
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = join(ROOT, "design-import", "Advertorials on Tap.dc.html")
const OUT = join(ROOT, "app", "_offer", "advertorial-content.tsx")

// Headshot pulled from the design project via DesignSync get_file (base64 JSON).
const HEADSHOT_JSON =
  "/Users/jackson/.claude/projects/-Users-jackson-Documents-projects-ch47/1a2e2df4-6c32-40e3-a7b6-e3e9ad6846fa/tool-results/toolu_01FsGpX1XKFu61gT3euBMPm2.txt"
const HEADSHOT_OUT = join(ROOT, "public", "uploads", "jackson.jpg")

// pasted-* design uploads → existing /public/uploads/work-*.png (same mockups).
const IMG = {
  "uploads/pasted-1781817173124-0.png": "/uploads/work-cookware.png",
  "uploads/pasted-1781817193058-0.png": "/uploads/work-wellness.png",
  "uploads/pasted-1781817203382-0.png": "/uploads/work-coaching.png",
  "uploads/pasted-1781817212345-0.png": "/uploads/work-hearing.png",
  "uploads/pasted-1781817221757-0.png": "/uploads/work-pet.png",
  "uploads/pasted-1781817230964-0.png": "/uploads/work-beauty.png",
  "uploads/083B4BB2-5D49-4CD5-A788-8B3C96667734.jpeg": "/uploads/jackson.jpg",
}

// ── decode the headshot ──────────────────────────────────────────────────────
if (existsSync(HEADSHOT_JSON)) {
  try {
    const { content } = JSON.parse(readFileSync(HEADSHOT_JSON, "utf8"))
    mkdirSync(dirname(HEADSHOT_OUT), { recursive: true })
    writeFileSync(HEADSHOT_OUT, Buffer.from(content, "base64"))
    console.log("✓ headshot →", HEADSHOT_OUT)
  } catch (e) {
    console.warn("! could not decode headshot:", e.message)
  }
} else {
  console.warn("! headshot source not found, skipping (img will 404)")
}

// ── transform the design ─────────────────────────────────────────────────────
const raw = readFileSync(SRC, "utf8")

// 1. CSS from the <style> block, with fonts pinned to the Next next/font setup
//    (the design's :root hard-codes Archivo; the real default is Space).
let css = raw.slice(raw.indexOf("<style>") + 7, raw.indexOf("</style>"))
css = css.replace(
  /:root\{--font-display:[^}]*\}/,
  ":root{--font-display:var(--font-space-grotesk),'Space Grotesk',sans-serif;--font-body:var(--font-space-grotesk),'Space Grotesk',sans-serif;--font-mono:var(--font-space-mono),'Space Mono',monospace}",
)

// 2. Body = the #page tree (skips <helmet> and the trailing <script>).
let html = raw.slice(raw.indexOf('<div id="page"'), raw.indexOf("</x-dc>")).trim()

// 3. Resolve design directives / templating.
html = html.replace(/<sc-if[^>]*>/g, "").replace(/<\/sc-if>/g, "") // showWorkshopBanner defaults on
html = html.replace(/\{\{\s*firstAdvertorialDate\s*\}\}/g, "<span data-first-advertorial-date>in a few days</span>")
html = html.replace(/\{\{[^}]*\}\}/g, "") // any other stray tokens
html = html.replace('<div id="page" ', '<div id="page" data-proof="on" ') // proofFirstLayout default true

// 4. Remap assets.
for (const [from, to] of Object.entries(IMG)) html = html.split(from).join(to)

// 5. Make CTAs real: booking opens the cal modal; the pricing buy button + email.
html = html.split('href="Book a Call.dc.html"').join('href="https://cal.com/ctrlswing/15min"')
html = html.replace(
  'href="#" style="display:flex;align-items:center;justify-content:center;gap:9px;text-align:center;background:#cdfb45;color:#0b0b0c;padding:18px',
  'href="mailto:jackson@channel47.dev?subject=Start%20an%20advertorial" style="display:flex;align-items:center;justify-content:center;gap:9px;text-align:center;background:#cdfb45;color:#0b0b0c;padding:18px',
)
html = html.split("jackson@channel47.co\"").join("jackson@channel47.dev\"") // fix .co typo

// ── emit ─────────────────────────────────────────────────────────────────────
const file = `// AUTO-GENERATED from design-import/Advertorials on Tap.dc.html by
// scripts/build-advertorial.mjs — do NOT hand-edit. Re-run the script to regenerate.
// The design markup is rendered verbatim (server-side, crawlable); interactive
// behaviors live in page-runtime.tsx.
/* eslint-disable */
const CSS = ${JSON.stringify(css)}

const HTML = ${JSON.stringify(html)}

export function AdvertorialContent() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
    </>
  )
}
`
writeFileSync(OUT, file)
console.log("✓ wrote", OUT, `(${(file.length / 1024).toFixed(0)}KB)`)
