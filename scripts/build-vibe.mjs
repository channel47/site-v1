// Regenerates app/vibe/vibe-content.tsx from the Claude Design source at
// design-import/Vibe Members.dc.html.
//
// Same approach as build-advertorial.mjs: render the design's markup verbatim
// (server-side, crawlable) via dangerouslySetInnerHTML, with a few deterministic
// rewrites so it runs inside the Next app. Interactivity lives in
// app/vibe/vibe-runtime.tsx (a 1:1 port of the design's support.js). Re-run after
// pulling a new design version:
//
//   node scripts/build-vibe.mjs
//
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = join(ROOT, "design-import", "Vibe Members.dc.html")
const OUT = join(ROOT, "app", "vibe", "vibe-content.tsx")

// ── transform the design ─────────────────────────────────────────────────────
const raw = readFileSync(SRC, "utf8")

// 1. CSS from the <style> block, with fonts pinned to the Next next/font setup
//    (the design's :root hard-codes the family name; the real default is the
//    next/font CSS variable).
let css = raw.slice(raw.indexOf("<style>") + 7, raw.indexOf("</style>"))
css = css.replace(
  /:root\{--font-display:[^}]*\}/,
  ":root{--font-display:var(--font-space-grotesk),'Space Grotesk',sans-serif;--font-body:var(--font-space-grotesk),'Space Grotesk',sans-serif;--font-mono:var(--font-space-mono),'Space Mono',monospace}",
)

// 2. Body = the #page tree (skips <helmet> and the trailing behavior comment).
let html = raw.slice(raw.indexOf('<div id="page"'), raw.indexOf("</x-dc>")).trim()

// 3. Resolve design directives / templating.
html = html.replace(/<sc-if[^>]*>/g, "").replace(/<\/sc-if>/g, "") // showTopBanner defaults on
html = html.replace(/\{\{[^}]*\}\}/g, "") // strip any stray templating tokens

// 4. Make CTAs real: booking opens cal.com directly (same as the advertorial),
//    and the studio links point at the canonical home `/` where the offer lives.
html = html.split('href="Book a Call.dc.html"').join('href="https://cal.com/ctrlswing/15min"')
html = html.split("Advertorials on Tap.dc.html").join("/")

// ── emit ─────────────────────────────────────────────────────────────────────
const file = `// AUTO-GENERATED from design-import/Vibe Members.dc.html by
// scripts/build-vibe.mjs — do NOT hand-edit. Re-run the script to regenerate.
// The design markup is rendered verbatim (server-side, crawlable); interactive
// behaviors live in vibe-runtime.tsx.
/* eslint-disable */
const CSS = ${JSON.stringify(css)}

const HTML = ${JSON.stringify(html)}

export function VibeContent() {
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
