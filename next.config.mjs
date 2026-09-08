/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Content routes serve HTML or a markdown twin depending on Accept
    // (see proxy.ts) — caches must key on it. Self-hosted `next start`
    // overrides Vary on HTML documents; Vercel's routing layer applies this
    // header in production, and the rewritten .md responses carry their own.
    return [
      {
        source: "/(projects|notes)/:slug",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ]
  },
  async redirects() {
    // Preserve inbound links from retired indexes and the former Stories
    // taxonomy. Legacy detail URLs are handled by proxy.ts.
    return [
      { source: "/projects", destination: "/browse?type=projects", permanent: true },
      { source: "/notes", destination: "/browse?type=notes", permanent: true },
      { source: "/skills", destination: "/browse?type=projects", permanent: true },
      { source: "/connectors", destination: "/browse?type=projects", permanent: true },
      { source: "/posts", destination: "/browse?type=notes", permanent: true },
      // The former About page is now the homepage bio.
      { source: "/about", destination: "/", permanent: true },
      { source: "/stories", destination: "/browse?type=notes", permanent: true },
      { source: "/stories/:slug", destination: "/notes/:slug", permanent: true },
      { source: "/workshops", destination: "/browse?type=notes", permanent: true },
      // The 12 removed posts redirect by known slug so future posts at new
      // slugs can still publish. Their old content remains in Git history.
      { source: "/posts/content-miner", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/creative-strategist", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/gaql", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/kit-newsletter", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/media-buyer", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/twitter-algorithm-optimizer", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/bing-ads-mcp", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/google-ads-mcp", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/linkedin-ads-mcp", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/meta-ads-mcp", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/pinterest-ads-mcp", destination: "/browse?type=notes", permanent: true },
      { source: "/posts/tiktok-ads-mcp", destination: "/browse?type=notes", permanent: true },
    ]
  },
}

export default nextConfig
