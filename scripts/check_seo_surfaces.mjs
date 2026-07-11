import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const registryPath = path.join(root, "lib", "discovery.ts")

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8")
}

function fail(message) {
  console.error(`SEO surface check failed: ${message}`)
  process.exitCode = 1
}

if (!fs.existsSync(registryPath)) {
  fail("missing lib/discovery.ts shared registry")
  process.exit()
}

const registry = fs.readFileSync(registryPath, "utf8")
const publicPagesBlock =
  registry.match(/export const PUBLIC_PAGES = \[([\s\S]*?)\] as const/)?.[1] ?? ""
const registeredPaths = new Set(
  [...publicPagesBlock.matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]),
)
const contentBasePaths = [
  ...registry.matchAll(/basePath:\s*"([^"]+)"/g),
].map((match) => match[1])

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return [full]
  })
}

const staticPages = walk(path.join(root, "app"))
  .filter((file) => file.endsWith(`${path.sep}page.tsx`))
  .filter((file) => !file.includes("["))
  .map((file) => {
    const relative = path.relative(path.join(root, "app"), path.dirname(file))
    return relative === "" ? "/" : `/${relative}`
  })
  .sort()

for (const page of staticPages) {
  if (!registeredPaths.has(page)) {
    fail(`${page} is a static page but is not listed in PUBLIC_PAGES`)
  }
}

for (const page of registeredPaths) {
  const pageFile =
    page === "/"
      ? path.join(root, "app", "page.tsx")
      : path.join(root, "app", page.slice(1), "page.tsx")
  if (!fs.existsSync(pageFile)) {
    fail(`${page} is listed in PUBLIC_PAGES but has no matching app page`)
  }
}

const requiredConsumers = [
  "app/api/route.ts",
  "app/api/search/route.ts",
  "app/llms.txt/route.ts",
  "app/md/[section]/[slug]/route.ts",
  "app/rss.xml/route.ts",
  "app/sitemap.md/route.ts",
  "app/sitemap.ts",
  "proxy.ts",
]

for (const file of requiredConsumers) {
  if (!read(file).includes("@/lib/discovery")) {
    fail(`${file} does not import the shared discovery registry`)
  }
}

const proxy = read("proxy.ts")
for (const basePath of contentBasePaths) {
  const matcher = `"${basePath}/:slug*"`
  if (!proxy.includes(matcher)) {
    fail(`proxy matcher is missing ${matcher}`)
  }
}

// --- Metadata completeness: every page ships a matching openGraph block and
// a canonical URL, either by construction (pageMetadata()/assetMetadata()
// from lib/seo.ts) or, for a hand-rolled object, by having both fields
// present. Catches the class of bug where a page sets title/description but
// silently inherits the parent's OG card when shared on social. ---
const HOME_PAGE = path.join(root, "app", "page.tsx")
const allPageFiles = walk(path.join(root, "app")).filter((file) => file.endsWith(`${path.sep}page.tsx`))

for (const file of allPageFiles) {
  const relative = path.relative(root, file)
  const source = read(relative)
  const usesSharedHelper = /\b(?:pageMetadata|assetMetadata)\(/.test(source)

  if (/export async function generateMetadata/.test(source)) {
    if (!usesSharedHelper) {
      fail(`${relative} defines generateMetadata without calling pageMetadata()/assetMetadata() from lib/seo.ts`)
    }
    continue
  }

  if (file === HOME_PAGE) continue // home inherits title/description/OG from the root layout by design
  if (!/export const metadata/.test(source)) continue

  const hasOpenGraph = /openGraph\s*:/.test(source)
  const hasCanonical = /alternates\s*:\s*{\s*canonical/.test(source)
  if (!usesSharedHelper && !(hasOpenGraph && hasCanonical)) {
    fail(`${relative} exports metadata without openGraph + alternates.canonical (use pageMetadata() from lib/seo.ts)`)
  }
}

// --- Brand consistency: the canonical spelling is lowercase "channel47"
// (site design rule + lib/seo.ts SITE_NAME). lib/seo.ts itself is the one
// sanctioned place capitalized historical spellings may appear, as
// schema.org alternateName variants for entity matching — everywhere else
// on the metadata surface must go through SITE_NAME rather than a hand-typed
// literal, or the title/schema/OG brand string silently drifts apart again. ---
const BRAND_DRIFT_PATTERN = /Channel ?47/
const brandCheckFiles = [
  ...walk(path.join(root, "app")).filter((file) =>
    /(?:^|\/)(page|layout|opengraph-image)\.tsx$/.test(file.replace(/\\/g, "/")),
  ),
  path.join(root, "lib", "discovery.ts"),
]

for (const file of brandCheckFiles) {
  const source = fs.readFileSync(file, "utf8")
  if (BRAND_DRIFT_PATTERN.test(source)) {
    fail(
      `${path.relative(root, file)} has a capitalized "Channel 47"/"Channel47" literal — import SITE_NAME from lib/seo.ts instead (canonical spelling is lowercase "channel47")`,
    )
  }
}
