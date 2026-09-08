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
    // Preserve inbound links from retired indexes and the former Stories
    // taxonomy. Workshop detail pages remain at /workshops/:slug.
    return [
      // The former About page is now the homepage bio.
      { source: "/about", destination: "/", permanent: true },
      { source: "/stories", destination: "/browse?type=posts", permanent: true },
      { source: "/stories/:slug", destination: "/posts/:slug", permanent: true },
      { source: "/workshops", destination: "/browse?type=workshops", permanent: true },
      // The 12 removed posts redirect by known slug so future posts at new
      // slugs can still publish. Their old content remains in Git history.
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
