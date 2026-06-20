// Shared transforms for compiling Claude Design `*.dc.html` exports into the
// Next app. Each `build-<page>.mjs` is a thin per-page config that composes
// these helpers; anything page-specific (asset remaps, CTA rewrites) stays in
// the per-page script.
//
// The design ships as static HTML with inline styles + a behavior script. We
// render its markup verbatim (server-side, fully crawlable) via
// dangerouslySetInnerHTML; interactivity is hand-ported into each page's
// `*-runtime.tsx`.
import { readFileSync, writeFileSync } from "node:fs"

// Booking CTAs across the site point at one cal.com inline embed.
export const CAL_LINK = "https://cal.com/ctrlswing/15min"

// The design's :root hard-codes its own font families; pin them to the
// next/font CSS variables so exports always render in the canonical type system
// (Space Grotesk / Space Mono) regardless of what the design file declares.
const FONT_PIN =
  ":root{--font-display:var(--font-space-grotesk),'Space Grotesk',sans-serif;--font-body:var(--font-space-grotesk),'Space Grotesk',sans-serif;--font-mono:var(--font-space-mono),'Space Mono',monospace}"

export function readDesign(src) {
  return readFileSync(src, "utf8")
}

// CSS = the <style> block, with fonts pinned to the next/font setup.
export function extractCss(raw) {
  const css = raw.slice(raw.indexOf("<style>") + 7, raw.indexOf("</style>"))
  return css.replace(/:root\{--font-display:[^}]*\}/, FONT_PIN)
}

// HTML = the #page tree (skips <helmet> and the trailing <script>/comment).
export function extractHtml(raw) {
  return raw.slice(raw.indexOf('<div id="page"'), raw.indexOf("</x-dc>")).trim()
}

// Strip the design tool's <sc-if> conditional wrappers (default branch ships).
export function stripConditionals(html) {
  return html.replace(/<sc-if[^>]*>/g, "").replace(/<\/sc-if>/g, "")
}

// Strip any leftover {{ templating }} tokens.
export function stripTokens(html) {
  return html.replace(/\{\{[^}]*\}\}/g, "")
}

// Booking CTAs in the design link to a local "Book a Call" page; wire them
// straight to the cal.com inline embed instead.
export function wireBooking(html) {
  return html.split('href="Book a Call.dc.html"').join(`href="${CAL_LINK}"`)
}

// Emit the auto-generated content component.
export function emit({ out, component, css, html, source, script, runtime }) {
  const file = `// AUTO-GENERATED from design-import/${source} by
// scripts/${script} — do NOT hand-edit. Re-run the script to regenerate.
// The design markup is rendered verbatim (server-side, crawlable); interactive
// behaviors live in ${runtime}.
/* eslint-disable */
const CSS = ${JSON.stringify(css)}

const HTML = ${JSON.stringify(html)}

export function ${component}() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
    </>
  )
}
`
  writeFileSync(out, file)
  console.log("✓ wrote", out, `(${(file.length / 1024).toFixed(0)}KB)`)
}
