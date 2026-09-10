/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
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
      // Legacy indexes and the original Google Ads plugin URL still have homes.
      ...["", ".md", "/opengraph-image"].map((suffix) => ({
        source: `/plugins/google-ads${suffix}`,
        destination: `/projects/google-ads${suffix}`,
        permanent: true,
      })),
      { source: "/guides", destination: "/browse?type=notes", permanent: true },
      { source: "/labs", destination: "/browse?type=notes", permanent: true },
      { source: "/tools", destination: "/browse", permanent: true },
      // The Flow experiment and its Codex follow-up are one evolving workflow.
      ...["", ".md", "/opengraph-image"].map((suffix) => ({
        source: `/notes/google-flow-reference-led-product-imagery${suffix}`,
        destination: `/notes/codex-static-ads-google-flow${suffix}`,
        permanent: true,
      })),
      { source: "/md/notes/google-flow-reference-led-product-imagery", destination: "/notes/codex-static-ads-google-flow.md", permanent: true },
      // The build story and installable Google Ads tool are one piece.
      ...["", ".md", "/opengraph-image"].map((suffix) => ({
        source: `/notes/google-ads-mcp${suffix}`,
        destination: `/projects/google-ads${suffix}`,
        permanent: true,
      })),
      { source: "/md/notes/google-ads-mcp", destination: "/projects/google-ads.md", permanent: true },
      { source: "/projects", destination: "/browse?type=projects", permanent: true },
      { source: "/notes", destination: "/browse?type=notes", permanent: true },
      { source: "/skills", destination: "/browse?type=projects", permanent: true },
      { source: "/connectors", destination: "/browse?type=projects", permanent: true },
      { source: "/posts", destination: "/browse?type=notes", permanent: true },
      { source: "/stories", destination: "/browse?type=notes", permanent: true },
      { source: "/stories/:slug", destination: "/notes/:slug", permanent: true },
      { source: "/workshops", destination: "/browse?type=notes", permanent: true },
    ]
  },
}

export default nextConfig
