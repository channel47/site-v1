import type React from "react"
import type { Metadata } from "next"
import { Newsreader, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Load Newsreader as a variable font (no static `weight` array) and pull in its
// optical-size axis. With `opsz` available, `font-optical-sizing: auto` lets the
// browser render a refined display cut at headline sizes and a sturdier text cut
// at body sizes — the heart of the editorial feel. The full weight axis (200–800)
// means every 300/400/500/600 the page uses renders from one continuous font.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
})

// Space Grotesk as a variable font too — smoother, continuous weights for the
// sans labels, buttons and mono-style codes.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://channel47.dev"),
  title: "Channel 47 — Agentic systems for performance marketers",
  description:
    "A living library of agentic systems and tools for performance marketers. Built by an operator who’s deployed them across $3M+ in ad spend.",
  openGraph: {
    title: "Channel 47 — Agentic systems for performance marketers",
    description:
      "A living library of agentic systems and tools for performance marketers.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
