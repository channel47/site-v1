import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue, Space_Grotesk, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/smooth-scroll"
import "./globals.css"

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
})
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
})
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://channel47.dev"),
  title: "channel47 — Turn customer research into landing pages that ship",
  description:
    "A practical Skills Lab for ecommerce marketers. Use AI skills to move from customer research, personas, and angles into swipe files, page strategy, and production-ready landing page drafts.",
  openGraph: {
    title: "channel47 — Turn customer research into landing pages that ship",
    description:
      "A practical Skills Lab for ecommerce marketers. Use AI skills to move from customer research, personas, and angles into swipe files, page strategy, and production-ready landing page drafts.",
    url: "https://channel47.dev",
    siteName: "Channel 47",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
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
    <html lang="en" className="dark bg-background">
      <body
        className={`${ibmPlexSans.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased overflow-x-hidden`}
      >
        <div className="noise-overlay" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
