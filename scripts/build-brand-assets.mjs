import { readFile, mkdir, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const { MARK_PATH, MARK_VIEWBOX } = createRequire(import.meta.url)("../components/site/mark.ts")

// Use the SVG rasterizer already installed by Next's image pipeline.
const requireNext = createRequire(import.meta.resolve("next/package.json"))
const sharp = requireNext("sharp")
const root = new URL("../", import.meta.url)
const tokens = await readFile(new URL("app/tokens.css", root), "utf8")
const color = (name) => {
  const value = tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`))?.[1]
  if (!value) throw new Error(`Missing brand color token: ${name}`)
  return value
}
const ink = color("ink")
const paper = color("page")
const accent = color("accent")
const svg = (body, viewBox = MARK_VIEWBOX, width = 48, height = 24) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" fill="none">${body}</svg>\n`
const mark = (fill) => `<path fill="${fill}" d="${MARK_PATH}"/>`
const tile = (background, foreground, size, markWidth, radius = 0) => {
  const x = (size - markWidth) / 2
  const y = (size - markWidth / 2) / 2
  return svg(`<rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/><g transform="translate(${x} ${y}) scale(${markWidth / 48})">${mark(foreground)}</g>`, `0 0 ${size} ${size}`, size, size)
}
const write = async (path, data) => {
  const url = new URL(path, root)
  await mkdir(new URL("./", url), { recursive: true })
  await writeFile(url, data)
  console.log(path)
}
const png = async (source, width) => sharp(Buffer.from(source)).resize({ width }).png().toBuffer()

for (const [name, fill] of [["ink", ink], ["white", "#ffffff"], ["cobalt", accent]]) {
  const source = svg(mark(fill))
  await write(`public/brand/channel47-mark-${name}.svg`, source)
  await write(`public/brand/channel47-mark-${name}.png`, await png(source, 1024))
}

// Explicit light defaults also work in SVG viewers with no color-scheme support.
await write("public/icon.svg", svg(`<style>.background{fill:${ink}}.foreground{fill:${paper}}@media(prefers-color-scheme:dark){.background{fill:${paper}}.foreground{fill:${ink}}}</style><rect class="background" width="180" height="180" rx="37"/><path class="foreground" transform="translate(24 57) scale(2.75)" d="${MARK_PATH}"/>`, "0 0 180 180", 180, 180))
await write("public/icon-light-32x32.png", await png(tile(ink, paper, 32, 28, 6), 32))
await write("public/icon-dark-32x32.png", await png(tile(paper, ink, 32, 28, 6), 32))
// Apple applies its own corner mask; supply a full-bleed square.
await write("public/apple-icon.png", await png(tile(ink, paper, 180, 132), 180))
await write("public/brand/channel47-avatar.png", await png(tile(ink, paper, 1024, 672), 1024))

// New filename preserves every logo embedded in an already-sent newsletter.
const email = svg(`<g transform="translate(2 2)"><path d="${MARK_PATH}" fill="${ink}" stroke="${paper}" stroke-width="1" paint-order="stroke fill"/></g>`, "0 0 52 28", 52, 28)
await write("public/email/channel47-mark-v3.png", await png(email, 156))
console.log(`Brand assets built from ${fileURLToPath(new URL("components/site/mark.ts", root))}`)
