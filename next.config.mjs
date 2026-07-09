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
    // Legacy URLs permanently redirect to their closest current homes so
    // inbound links and crawl equity carry over after the site taxonomy moved
    // to posts, skills, connectors, and workshops.
    return [
      { source: "/stories", destination: "/browse?type=posts", permanent: true },
      { source: "/stories/:slug", destination: "/posts/:slug", permanent: true },
      { source: "/guides", destination: "/browse?type=posts", permanent: true },
      { source: "/guides/claude-for-ppc", destination: "/posts/media-buyer", permanent: true },
      { source: "/labs", destination: "/workshops", permanent: true },
      { source: "/plugins/google-ads", destination: "/connectors/google-ads", permanent: true },
      { source: "/blog/gaql-queries-guide", destination: "/posts/gaql", permanent: true },
      { source: "/tools", destination: "/browse", permanent: true },
    ]
  },
}

export default nextConfig
