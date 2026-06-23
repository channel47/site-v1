import type React from "react"
import type { Metadata } from "next"
import { Newsreader, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://channel47.dev"),
  title: "Channel 47 — Agentic systems for performance marketers",
  description:
    "A living library of agentic systems and tools for performance marketers. Built by an operator who's deployed them across $3M+ in ad spend.",
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
