"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { arrivalAttribution, restoreAttribution, safePath, sanitizeAnalyticsEvent, type Attribution, type MeasurementDetails, type MeasurementEvent } from "@/lib/measurement"
import { createReadingActivity, observeReading } from "@/lib/reading-activity"

const STORAGE_KEY = "ch47-attribution-v1"
let knownPaths: readonly string[] = []
let attribution: Attribution | undefined
let lastContentPath: string | undefined

/** Analytics failure must never interrupt navigation, copying, or signup. */
export function measure(event: MeasurementEvent, details: MeasurementDetails = {}) {
  try {
    const page = safePath(window.location.pathname, knownPaths)
    if (!page || !attribution) return
    const { target_path, placement, status, active_seconds, depth } = details
    const metadata = { page, ...attribution,
      ...(placement && ["home", "newsletter", "article_end", "workshop"].includes(placement) ? { placement } : {}),
      ...(status && ["accepted", "invalid", "unavailable", "failed", "network_error"].includes(status) ? { status } : {}),
      ...(lastContentPath && safePath(lastContentPath, knownPaths) ? { last_content_path: lastContentPath } : {}),
      ...(target_path && safePath(target_path, knownPaths) ? { target_path } : {}),
      ...(active_seconds && [30, 90, 180, 300].includes(active_seconds) ? { active_seconds } : {}),
      ...(depth && [50, 90].includes(depth) ? { depth } : {}) }
    void import("@/lib/reader-analytics").then(({ sendReaderEvent }) => sendReaderEvent(event, metadata)).catch(() => {})
  } catch { /* Measurement is best-effort and contains no form values. */ }
}

/** First arrival in this tab persists through internal navigation. A tagged
 * arrival starts a new attribution context. Storage denial falls back to memory. */
export function SiteMeasurement({ paths }: { paths: string[] }) {
  const pathname = usePathname()
  const lastPage = useRef<string | null>(null)
  const reading = useRef(createReadingActivity())
  useEffect(() => {
    knownPaths = paths
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
      reading.current = createReadingActivity()
      if (/^\/(notes|projects)\//.test(pathname) && safePath(pathname, paths)) {
        lastContentPath = pathname
        measure("content_open")
      }
    }
    return observeReading(reading.current, (event, details) => {
      // Cleanup after navigation must not attribute the old article to the new one.
      if (window.location.pathname === pathname) measure(event, details)
    }, pathname)
  }, [pathname, paths])
  return <Analytics beforeSend={(event) => sanitizeAnalyticsEvent(event, paths)} />
}
