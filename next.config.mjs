/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The offer moved to the canonical home `/`. Preserve any inbound links to
      // the old path with a permanent (308) redirect.
      { source: "/advertorial", destination: "/", permanent: true },
    ]
  },
}

export default nextConfig
