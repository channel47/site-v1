/** Shared, bounded attribution vocabulary. Never retain email, full referrers,
 * arbitrary query parameters, or visitor identifiers in custom events. */
export const SHARE_CHANNELS = {
  x: { source: "x", medium: "social" },
  linkedin: { source: "linkedin", medium: "social" },
  newsletter: { source: "newsletter", medium: "email" },
  github: { source: "github", medium: "referral" },
} as const

export type ShareChannel = keyof typeof SHARE_CHANNELS
export type CapturePlacement = "home" | "newsletter" | "article_end" | "workshop"
export type MeasurementEvent = "content_open" | "related_click" | "repository_click" | "install_copy" | "page_copy" | "link_copy" | "newsletter_submit" | "newsletter_result"
export type Source = ShareChannel | "direct" | "google" | "bing" | "duckduckgo" | "other"
export interface Attribution {
  landing_path: string
  source: Source
  medium: "social" | "email" | "referral" | "search" | "direct"
  campaign: string
}

const sources = new Set(["x", "linkedin", "newsletter", "github", "direct", "google", "bing", "duckduckgo", "other"])
const media = new Set(["social", "email", "referral", "search", "direct"])

export function safePath(path: string, paths: readonly string[]): string | undefined {
  return paths.includes(path) ? path : undefined
}

/** Apply to the analytics envelope too, not only to custom properties. */
export function sanitizeAnalyticsEvent<T extends { url: string }>(event: T, paths: readonly string[]): T | null {
  try {
    const url = new URL(event.url, "https://channel47.dev")
    if (!safePath(url.pathname, paths)) return null
    url.search = ""
    url.hash = ""
    return { ...event, url: url.toString() }
  } catch { return null }
}

function safeCampaign(value: string | null, paths: readonly string[]): string {
  return value && paths.some((path) => /^\/(notes|projects)\//.test(path) && path.split("/").pop() === value) ? value : ""
}

/** Revalidate stored data as strictly as a new arrival. */
export function restoreAttribution(value: unknown, paths: readonly string[]): Attribution | undefined {
  if (!value || typeof value !== "object") return undefined
  const data = value as Record<string, unknown>
  if (typeof data.landing_path !== "string" || !safePath(data.landing_path, paths)
    || typeof data.source !== "string" || !sources.has(data.source)
    || typeof data.medium !== "string" || !media.has(data.medium)) return undefined
  return { landing_path: data.landing_path, source: data.source as Source,
    medium: data.medium as Attribution["medium"], campaign: safeCampaign(typeof data.campaign === "string" ? data.campaign : null, paths) }
}

export function arrivalAttribution(url: URL, referrer: string, paths: readonly string[]): Attribution | undefined {
  const landing_path = safePath(url.pathname, paths)
  if (!landing_path) return undefined
  const campaign = safeCampaign(url.searchParams.get("utm_campaign"), paths)
  const channel = url.searchParams.get("utm_source")
  if (channel && Object.hasOwn(SHARE_CHANNELS, channel)) {
    return { landing_path, ...SHARE_CHANNELS[channel as ShareChannel], campaign }
  }
  let source: Source = "direct"
  let medium: Attribution["medium"] = "direct"
  try {
    const previous = new URL(referrer)
    if (previous.origin !== url.origin) {
      const host = previous.hostname.replace(/^www\./, "")
      source = host === "github.com" ? "github"
        : ["x.com", "twitter.com", "t.co"].includes(host) ? "x"
        : ["linkedin.com", "lnkd.in"].includes(host) ? "linkedin"
        : /(^|\.)google\.com$/.test(host) ? "google"
        : host === "bing.com" ? "bing"
        : host === "duckduckgo.com" ? "duckduckgo" : "other"
      medium = ["google", "bing", "duckduckgo"].includes(source) ? "search"
        : ["x", "linkedin"].includes(source) ? "social" : "referral"
    }
  } catch { /* Missing or invalid referrers are direct arrivals. */ }
  return { landing_path, source, medium, campaign }
}

export function taggedShareUrl(path: string, channel: ShareChannel): string {
  if (!/^\/(notes|projects)\/[a-z0-9-]+$/.test(path)) throw new Error("Expected a canonical project or note path")
  const url = new URL(path, "https://channel47.dev")
  url.searchParams.set("utm_source", SHARE_CHANNELS[channel].source)
  url.searchParams.set("utm_medium", SHARE_CHANNELS[channel].medium)
  url.searchParams.set("utm_campaign", path.split("/").pop()!)
  return url.toString()
}
