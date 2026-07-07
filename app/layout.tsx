import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { JsonLd } from "@/components/site/json-ld"
import { PostHogAnalytics } from "@/components/site/posthog"
import { baseGraph } from "@/lib/seo"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://channel47.dev"),
  title: "Channel 47 — Skills, connectors, and agents for marketers",
  description:
    "Skills, connectors, and agents for marketers — built in real ad accounts by a working operator. Free to grab, live sessions monthly.",
  openGraph: {
    title: "Channel 47 — Skills, connectors, and agents for marketers",
    description:
      "Skills, connectors, and agents for marketers — built in real ad accounts by a working operator.",
    url: "https://channel47.dev",
    siteName: "Channel 47",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

// Reads the persisted scheme choice before paint so the toggle never flashes.
// `color-scheme` on <html> defaults to `light dark` (system) in globals.css;
// this only overrides it once the visitor has explicitly picked a mode (see
// components/site/theme-toggle.tsx).
const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem("ch47-theme");if(m==="light"||m==="dark"){document.documentElement.style.colorScheme=m;document.documentElement.setAttribute("data-theme",m)}}catch(e){}})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {/* Rendered here (not via `metadata.alternates`, which page-level
            canonicals would replace wholesale) — React hoists it to <head>. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Channel 47"
          href="/rss.xml"
        />
        {/* Site-wide entity graph (Organization + Person + WebSite) — see lib/seo.ts. */}
        <JsonLd data={baseGraph()} />
        {children}
        <PostHogAnalytics />
        <Analytics />
      </body>
    </html>
  )
}
