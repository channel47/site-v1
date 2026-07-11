/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Content routes serve HTML or a markdown twin depending on Accept
    // (see proxy.ts) — caches must key on it. Self-hosted `next start`
    // overrides Vary on HTML documents; Vercel's routing layer applies this
    // header in production, and the rewritten .md responses carry their own.
    return [
      {
        source: "/(posts|skills|connectors|workshops)/:slug",
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
      // /about retired in the v2 repositioning — content folded into the
      // home hero/bio; nothing else replaces it (docs/PLAN.md).
      { source: "/about", destination: "/", permanent: true },
      { source: "/stories", destination: "/browse?type=posts", permanent: true },
      { source: "/stories/:slug", destination: "/posts/:slug", permanent: true },
      { source: "/workshops", destination: "/browse?type=workshops", permanent: true },
      // All 12 posts unpublished (moved to content/_unpublished/posts/) — an
      // explicit list per known slug, not a blanket /posts/:slug rule, so a
      // future post at a fresh slug isn't shadowed by this takedown.
      { source: "/posts/content-miner", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/creative-strategist", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/gaql", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/kit-newsletter", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/media-buyer", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/twitter-algorithm-optimizer", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/bing-ads-mcp", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/google-ads-mcp", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/linkedin-ads-mcp", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/meta-ads-mcp", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/pinterest-ads-mcp", destination: "/browse?type=posts", permanent: true },
      { source: "/posts/tiktok-ads-mcp", destination: "/browse?type=posts", permanent: true },
    ]
  },
}

export default nextConfig
