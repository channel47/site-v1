import { type NextRequest, NextResponse } from "next/server"
import { isKitConfigured, isSameOrigin, sanitizeFields, subscribeToKit } from "@/lib/kit"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ALLOWED_PLATFORMS = ["Shopify", "WordPress", "Webflow", "Custom", "Not sure"]

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Cross-origin requests are not allowed." }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 })
  }

  const data = (body ?? {}) as Record<string, unknown>

  const name = typeof data.name === "string" ? data.name.trim() : ""
  const email = typeof data.email === "string" ? data.email.trim() : ""
  const brandUrl = typeof data.brandUrl === "string" ? data.brandUrl.trim() : ""
  const platform = typeof data.platform === "string" ? data.platform.trim() : ""
  const product = typeof data.product === "string" ? data.product.trim() : ""
  const need = typeof data.need === "string" ? data.need.trim() : ""
  const timeline = typeof data.timeline === "string" ? data.timeline.trim() : ""
  const budget = typeof data.budget === "string" ? data.budget.trim() : ""

  const errors: Record<string, string> = {}

  if (!name) errors.name = "Name is required."
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address."
  if (!product) errors.product = "Tell me what you're selling."
  if (platform && !ALLOWED_PLATFORMS.includes(platform)) errors.platform = "Pick a valid platform."

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 })
  }

  const cleanEmail = email.toLowerCase()
  // Always retained so a Kit outage never loses a high-value build lead.
  const lead = { name, email: cleanEmail, brandUrl, platform, product, need, timeline, budget }

  if (!isKitConfigured()) {
    console.error("[kit] KIT_API_KEY is not set — build request not sent to Kit, logging only:", lead)
    return NextResponse.json({
      ok: true,
      message: "Request received. I'll reply within two business days with next steps.",
    })
  }

  try {
    const result = await subscribeToKit(cleanEmail, {
      firstName: name,
      tag: "work-request",
      fields: sanitizeFields({
        signup_source: "channel47_website",
        signup_context: "work-request",
        brand_url: brandUrl,
        platform,
        product,
        brief: need,
        timeline,
        budget,
      }),
    })

    // Never lose a build lead: log the full payload whenever Kit didn't fully
    // capture it (request failed, custom fields stripped, or fields ignored).
    const incomplete =
      !result.ok || result.fieldsDropped || (Array.isArray(result.warnings) && result.warnings.length > 0)
    if (incomplete) {
      console.error("[kit] build request — Kit capture incomplete, logging full lead for follow-up:", {
        ok: result.ok,
        status: result.status,
        error: result.error,
        fieldsDropped: result.fieldsDropped,
        warnings: result.warnings,
        lead,
      })
    }
  } catch (err) {
    console.error("[kit] build request — Kit error, logging lead for follow-up:", { err, lead })
  }

  // The user always gets a success response once validation passes.
  return NextResponse.json({
    ok: true,
    message: "Request received. I'll reply within two business days with next steps.",
  })
}
