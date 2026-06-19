import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Space_Mono } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Matches the Claude Design "Neo-grotesk — Space" font system (the design's default).
const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://channel47.dev"),
  title: "Advertorials, on tap. — channel47",
  description:
    "The editorial presell page that closes the gap between your ad and your checkout — so cold traffic lands already sold. Productized advertorials by channel47.",
  openGraph: {
    title: "Advertorials, on tap. — channel47",
    description:
      "The editorial presell page that closes the gap between your ad and your checkout — so cold traffic lands already sold.",
    url: "https://channel47.dev",
    siteName: "channel47",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body>
        {/* Flag JS before paint so scroll-reveal targets start hidden (html.jsr).
            No-JS or reduced-motion keeps them visible. */}
        <Script id="jsr-flag" strategy="beforeInteractive">
          {`try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('jsr')}catch(e){}`}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
