import { readFile, writeFile } from "node:fs/promises"

// Native vector illustrations: the article supplies the facts; this file owns
// their presentation. Embed the site's fonts so SVGs also work in feeds.
const root = new URL("../", import.meta.url)
const font = async (name) => (await readFile(new URL(`app/fonts/instrument-${name}-latin.woff2`, root))).toString("base64")
const sans = await font("sans")
const serif = await font("serif")
const INK = "#191a1c", MUTED = "#65676c", LINE = "#d5d7d0"
const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;")
const text = (x, y, value, size = 28, color = INK, family = "DiagramSans") => `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}">${esc(value)}</text>`
const line = (x1, y1, x2, y2, color = LINE, width = 1.5) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`
async function save(name, title, desc, height, body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="660" height="${height}" viewBox="0 0 660 ${height}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(desc)}</desc><defs><style>@font-face{font-family:DiagramSans;src:url(data:font/woff2;base64,${sans}) format('woff2');font-weight:400}@font-face{font-family:DiagramSerif;src:url(data:font/woff2;base64,${serif}) format('woff2');font-weight:400}text{font-weight:400}</style></defs><rect width="660" height="${height}" fill="#f5f5f2"/>${body}</svg>\n`
  await writeFile(new URL(`public/posts/${name}.svg`, root), svg)
  console.log(`public/posts/${name}.svg`)
}

const bag = (x, y) => `<g transform="translate(${x} ${y})" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"><path d="M145 20V9q0-9 9-9h72q9 0 9 9v11"/><rect y="20" width="380" height="210" rx="25" fill="#e8e9e2"/><rect x="10" y="30" width="360" height="190" rx="18" fill="#f5f5f2" stroke="${LINE}"/><rect x="26" y="46" width="147" height="157" rx="13" fill="#c7d2c6"/><rect x="190" y="46" width="162" height="66" rx="12" fill="#9eb5a2"/><path d="M38 67H162m-124 5H162m40-9h137m-137 5h137" stroke="#536553" stroke-width="1"/><path d="M153 68v10m177-13v10" stroke="#536553"/></g>`
const cube = (x,y) => `<g transform="translate(${x} ${y})" stroke="#8d3b24" fill="#dc9779" stroke-width="1.5"><rect width="110" height="74" rx="12"/><path d="M12 18h86m-86 5h86m-10-4v10" fill="none"/></g>`
await save("customer-research-packing-storyboard-v2", "One night here. Everything else stays packed.", "Proposed storyboard, not a product demonstration. Frame one: three packing cubes inside an open bag. Frame two: the small overnight cube has been removed; the other two cubes stay in exactly the same positions.", 925,
  text(36, 46, "Proposed storyboard", 24, MUTED) + text(36, 108, "One night here.", 46, INK, "DiagramSerif") + bag(36,145) + cube(232,270) + line(354,306,461,306,"#8d3b24") + text(477,300,"Overnight",24) + text(477,332,"cube",24) +
  text(36,450,"Everything else",43,INK,"DiagramSerif") + text(36,497,"stays packed.",43,INK,"DiagramSerif") + bag(36,533) + `<rect x="232" y="658" width="110" height="74" rx="12" fill="none" stroke="#9aa497" stroke-width="1.5" stroke-dasharray="5 6"/>` + cube(496,631) + `<path d="M355 695C430 695 418 668 477 668m-10-8 10 8-10 8" stroke="#8d3b24" stroke-width="2" fill="none" stroke-linecap="round"/>` + text(36,830,"Same bag. Same remaining contents.",27) + text(36,883,"Illustration only. Verify with the actual product.",23,MUTED))
