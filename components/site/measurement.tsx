"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { inject, track } from "@vercel/analytics"
import { Analytics } from "@vercel/analytics/next"
import { arrivalAttribution, restoreAttribution, safePath, sanitizeAnalyticsEvent, type Attribution, type CapturePlacement, type MeasurementEvent } from "@/lib/measurement"

const STORAGE_KEY = "ch47-attribution-v1"
let knownPaths: readonly string[] = []
let attribution: Attribution | undefined
let lastContentPath: string | undefined

/** Analytics failure must never interrupt navigation, copying, or signup. */
export function measure(event: MeasurementEvent, details: {
  placement?: CapturePlacement
  target_path?: string
  status?: "accepted" | "invalid" | "unavailable" | "failed" | "network_error"
} = {}) {
  try {
    const page = safePath(window.location.pathname, knownPaths)
    if (!page || !attribution) return
    const { target_path, placement, status } = details
    track(event, { page, ...attribution,
      ...(placement && ["home", "newsletter", "article_end", "workshop"].includes(placement) ? { placement } : {}),
      ...(status && ["accepted", "invalid", "unavailable", "failed", "network_error"].includes(status) ? { status } : {}),
      ...(lastContentPath && safePath(lastContentPath, knownPaths) ? { last_content_path: lastContentPath } : {}),
      ...(target_path && safePath(target_path, knownPaths) ? { target_path } : {}) })
  } catch { /* Measurement is best-effort and contains no form values. */ }
}

/** First arrival in this tab persists through internal navigation. A tagged
 * arrival starts a new attribution context. Storage denial falls back to memory. */
export function SiteMeasurement({ paths }: { paths: string[] }) {
  const pathname = usePathname()
  const lastPage = useRef<string | null>(null)
  useEffect(() => {
    knownPaths = paths
    // Initialize the SDK queue before the first custom event, even if Next's
    // pageview component is still hydrating its Suspense boundary.
    inject({ framework: "next", disableAutoTrack: true, beforeSend: (event) => sanitizeAnalyticsEvent(event, paths) })
    const url = new URL(window.location.href)
    if (!attribution) {
      try { attribution = restoreAttribution(JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null"), paths) } catch { /* Optional storage. */ }
    }
    if (!attribution || url.searchParams.has("utm_source")) {
      attribution = arrivalAttribution(url, document.referrer, paths)
    }
    if (attribution) {
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution)) } catch { /* Memory still works. */ }
    }
    if (lastPage.current !== pathname) {
      lastPage.current = pathname
      if (/^\/(notes|projects)\//.test(pathname) && safePath(pathname, paths)) {
        lastContentPath = pathname
        measure("content_open")
      }
    }
  }, [pathname, paths])
  return <Analytics beforeSend={(event) => sanitizeAnalyticsEvent(event, paths)} />
}
