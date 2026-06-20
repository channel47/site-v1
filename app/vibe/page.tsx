import type { Metadata } from "next"
import { VibeContent } from "./vibe-content"
import { VibeRuntime } from "./vibe-runtime"

// The /vibe members back-door for The Vibe Marketers community. VibeContent is the
// server-rendered design tree (generated from design-import/Vibe Members.dc.html);
// VibeRuntime wires its interactive behaviors.
export const metadata: Metadata = {
  title: "For The Vibe Marketers — channel47",
  description:
    "Every skill I demo in the Skills Lab, free to grab and run — plus the done-for-you version and a members' rate. The channel47 back door for The Vibe Marketers.",
  openGraph: {
    title: "For The Vibe Marketers — channel47",
    description:
      "Free skills from the Skills Lab, real work built live, and a members' rate. The channel47 back door for The Vibe Marketers.",
    url: "https://channel47.dev/vibe",
    siteName: "channel47",
    type: "website",
  },
}

export default function VibePage() {
  return (
    <>
      <VibeContent />
      <VibeRuntime />
    </>
  )
}
