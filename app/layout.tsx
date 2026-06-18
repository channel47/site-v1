import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans, IBM_Plex_Mono, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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
// Direction A display face — typography is the product.
const dmSans = DM_Sans({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "channel47",
  description: "Practical AI workflows and creative strategy systems for ecommerce marketers.",
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
    <html lang="en" className="bg-background">
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${dmSans.variable} font-sans antialiased overflow-x-hidden`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
