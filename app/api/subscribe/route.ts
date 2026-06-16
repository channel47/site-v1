import { type NextRequest, NextResponse } from "next/server"
import { isKitConfigured, isSameOrigin, sanitizeFields, subscribeToKit } from "@/lib/kit"

export const runtime = "nodejs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  const { email, source } = (body ?? {}) as { email?: string; source?: string }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 422 })
  }

  const cleanEmail = email.trim().toLowerCase()
  const context = typeof source === "string" && source.trim() ? source.trim() : "diy-kit"

  if (!isKitConfigured()) {
    console.error("[kit] KIT_API_KEY is not set — cannot subscribe", { email: cleanEmail, source: context })
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Please try again shortly." },
      { status: 500 },
    )
  }

  try {
    const result = await subscribeToKit(cleanEmail, {
      tag: context,
      fields: sanitizeFields({ signup_source: "channel47_website", signup_context: context }),
    })

    if (!result.ok) {
      console.error("[kit] subscribe failed", { status: result.status, error: result.error, email: cleanEmail })
      return NextResponse.json({ ok: false, error: "We couldn't add you right now. Please try again." }, { status: 502 })
    }

    return NextResponse.json({ ok: true, message: "You're on the list. Check your inbox for the kit." })
  } catch (err) {
    console.error("[kit] subscribe error", err)
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
