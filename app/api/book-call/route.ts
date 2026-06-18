import { type NextRequest, NextResponse } from "next/server"
import { isKitConfigured, isSameOrigin, sanitizeFields, subscribeToKit } from "@/lib/kit"
import { createBookingEvent, isCalendarConfigured, isSlotFree } from "@/lib/google-calendar"
import { generateSlots, isValidSlot } from "@/lib/slots"

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

  const data = (body ?? {}) as Record<string, unknown>

  const name = typeof data.name === "string" ? data.name.trim() : ""
  const email = typeof data.email === "string" ? data.email.trim() : ""
  const brandUrl = typeof data.brandUrl === "string" ? data.brandUrl.trim() : ""
  const product = typeof data.product === "string" ? data.product.trim() : ""
  const bottleneck = typeof data.bottleneck === "string" ? data.bottleneck.trim() : ""
  const slotStart = typeof data.slotStart === "string" ? data.slotStart.trim() : ""

  const errors: Record<string, string> = {}

  if (!name) errors.name = "Name is required."
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address."
  if (!product) errors.product = "Tell me what you're selling."
  if (!slotStart || !isValidSlot(slotStart)) errors.slot = "Pick an available time."

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 })
  }

  // isValidSlot guarantees slotStart is on-grid; derive the matching end.
  const startISO = new Date(slotStart).toISOString()
  const endISO = generateSlots(60).find((s) => s.startISO === startISO)?.endISO ?? startISO
  const cleanEmail = email.toLowerCase()
  // Always retained so neither a Kit nor a Calendar outage ever loses a booking.
  const lead = { name, email: cleanEmail, brandUrl, product, bottleneck, slotStart: startISO }

  // 1. Calendar: make the booking real. A taken slot is the one hard failure we surface.
  if (isCalendarConfigured()) {
    const free = await isSlotFree(startISO, endISO)
    if (!free) {
      return NextResponse.json(
        { ok: false, errors: { slot: "That time was just booked. Pick another." } },
        { status: 409 },
      )
    }
    const event = await createBookingEvent({ startISO, endISO, name, email: cleanEmail, product, brandUrl, bottleneck })
    if (!event.ok) {
      console.error("[book-call] calendar event creation failed, logging lead for manual follow-up:", lead)
    }
  } else {
    console.warn("[book-call] Google Calendar not configured — booking captured, no event created:", lead)
  }

  // 2. Kit: segment the lead. Best-effort; never blocks the booking.
  if (isKitConfigured()) {
    try {
      const result = await subscribeToKit(cleanEmail, {
        firstName: name,
        tag: "book-call",
        fields: sanitizeFields({
          signup_source: "channel47_website",
          signup_context: "advertorial-teardown",
          brand_url: brandUrl,
          product,
          bottleneck,
          booked_slot: startISO,
        }),
      })
      const incomplete =
        !result.ok || result.fieldsDropped || (Array.isArray(result.warnings) && result.warnings.length > 0)
      if (incomplete) {
        console.error("[kit] teardown — Kit capture incomplete, logging full lead:", { result, lead })
      }
    } catch (err) {
      console.error("[kit] teardown — Kit error, logging lead:", { err, lead })
    }
  } else {
    console.error("[kit] KIT_API_KEY not set — teardown booked, logging lead only:", lead)
  }

  return NextResponse.json({ ok: true, message: "You're booked. The calendar invite is on its way to your inbox." })
}
