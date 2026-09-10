import { StatsigClient } from "@statsig/js-client"
import { measurementTier, type MeasurementEvent } from "./measurement"

let client: StatsigClient | undefined

/** Loaded only after hydration. No replay, autocapture, or persistent identity. */
export function sendReaderEvent(event: MeasurementEvent, metadata: Record<string, string | number>) {
  const key = process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY
  const tier = measurementTier(window.location.hostname, process.env.NODE_ENV === "production", process.env.NEXT_PUBLIC_MEASUREMENT_TEST === "1")
  if (!key || !tier || navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return
  if (!client) {
    client = new StatsigClient(key, { userID: crypto.randomUUID() }, {
      environment: { tier },
      disableStableID: true,
      disableStorage: true,
      includeCurrentPageUrlWithEvents: false,
    })
    // Events can queue during initialization; content never waits for it.
    void client.initializeAsync().catch(() => {})
  }
  client.logEvent({ eventName: event, value: metadata.page,
    metadata: Object.fromEntries(Object.entries(metadata).map(([key, value]) => [key, String(value)])) })
}
