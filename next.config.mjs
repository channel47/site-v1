/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Content routes serve HTML or a markdown twin depending on Accept
    // (see proxy.ts) — caches must key on it. Self-hosted `next start`
    // overrides Vary on HTML documents; Vercel's routing layer applies this
    // header in production, and the rewritten .md responses carry their own.
    return [
      {
        source: "/(posts|skills|connectors)/:slug",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ]
  },
  async redirects() {
    // Stories became Posts in the taxonomy (docs/PLAN.md §2) — the old URLs
    // 301 to their new homes so inbound links and crawl equity carry over.
    // Workshops' dedicated index folded into Browse as a type filter, same
    // as every other content type (docs/PLAN.md §5) — session detail pages
    // at /workshops/:slug are unaffected.
    return [
      { source: "/stories", destination: "/browse?type=posts", permanent: true },
      { source: "/stories/:slug", destination: "/posts/:slug", permanent: true },
      { source: "/workshops", destination: "/browse?type=workshops", permanent: true },
    ]
  },
}

export default nextConfig
