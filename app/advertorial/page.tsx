import type { Metadata } from "next"
import { AdvertorialContent } from "./advertorial-content"
import { PageRuntime } from "./page-runtime"

// The "Advertorials on Tap" flagship offer page — parked here unchanged while the
// studio home takes over `/`. AdvertorialContent is the server-rendered design
// tree; PageRuntime wires its interactive behaviors.
export const metadata: Metadata = {
  title: "Advertorials, on tap. — channel47",
  description:
    "The editorial presell page that closes the gap between your ad and your checkout — so cold traffic lands already sold. Productized advertorials by channel47.",
  openGraph: {
    title: "Advertorials, on tap. — channel47",
    description:
      "The editorial presell page that closes the gap between your ad and your checkout — so cold traffic lands already sold.",
    url: "https://channel47.dev/advertorial",
    siteName: "channel47",
    type: "website",
  },
}

export default function AdvertorialPage() {
  return (
    <>
      <AdvertorialContent />
      <PageRuntime />
    </>
  )
}
