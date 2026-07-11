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
