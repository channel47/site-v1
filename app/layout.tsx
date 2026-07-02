import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Geist as a variable font (full 100–900 weight axis) carries both the display
// headings and the body copy — the design's "sans" typeface. One continuous
// font renders every weight the page uses (400 body → 600 headline) with no
// static cuts to swap between.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

// Space Grotesk carries the labels, helper text and form codes — the design's
// monospace-feel "label" face, kept distinct from the Geist body.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#2b2b28" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://channel47.dev"),
  title: "Channel 47 — Become an agentic operator",
  description:
    "Channel 47 teaches ecommerce operators to run growth as a system of AI agents, skills, and connectors — drawn from years inside real ad accounts.",
  openGraph: {
    title: "Channel 47 — Become an agentic operator",
    description:
      "Learn to run your brand's growth as a system of AI agents, skills, and connectors. From an operator who's deployed them across $3M+ in ad spend.",
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
      className={`${geist.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
