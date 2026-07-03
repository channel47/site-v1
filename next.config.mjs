/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Stories became Posts in the taxonomy (docs/PLAN.md §2) — the old URLs
    // 301 to their new homes so inbound links and crawl equity carry over.
    return [
      { source: "/stories", destination: "/browse?type=posts", permanent: true },
      { source: "/stories/:slug", destination: "/posts/:slug", permanent: true },
    ]
  },
}

export default nextConfig
