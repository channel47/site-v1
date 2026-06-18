/**
 * Booking availability — the single source of truth for when a teardown can be
 * booked: Tuesdays and Thursdays, 2:00–4:00pm America/Los_Angeles, in 30-minute
 * slots. Shared by the client widget (to render slots) and the API route (to
 * validate a submitted slot), so the two can never drift.
 *
 * All times are anchored to America/Los_Angeles wall-clock and converted to a
 * real UTC instant (DST-aware), so "2pm PT" is correct in winter and summer and
 * renders correctly in any visitor's timezone.
 */

export const BOOKING_TZ = "America/Los_Angeles"
const AVAILABLE_WEEKDAYS = [2, 4] // Tue, Thu (0 = Sun)
const SLOT_TIMES = ["14:00", "14:30", "15:00", "15:30"] as const
const SLOT_MINUTES = 30

export type Slot = {
  /** Stable identity + payload: UTC ISO instant of the slot start. */
  startISO: string
  endISO: string
}

/** Offset, in ms, of America/Los_Angeles from UTC at the given instant (DST-aware). */
function laOffsetMs(at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  const parts = dtf.formatToParts(at)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  // Reinterpret the LA wall-clock reading as if it were UTC, then diff.
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") === 24 ? 0 : get("hour"), get("minute"), get("second"))
  return asUTC - at.getTime()
}

/** Convert an LA wall-clock (Y-M-D H:M) to the real UTC instant. */
function laWallClockToUTC(year: number, month: number, day: number, hour: number, minute: number): Date {
  const guess = Date.UTC(year, month, day, hour, minute)
  const offset = laOffsetMs(new Date(guess))
  return new Date(guess - offset)
}

/** The LA calendar date (Y, M, D) for a given instant. */
function laDateParts(at: Date): { year: number; month: number; day: number; weekday: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  })
  const parts = dtf.formatToParts(at)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: weekdayMap[get("weekday")] ?? -1,
  }
}

/**
 * Generate bookable slots starting from `from`, scanning `days` ahead. Only
 * slots strictly in the future are returned. `from` defaults to now.
 */
export function generateSlots(days = 21, from: Date = new Date()): Slot[] {
  const slots: Slot[] = []
  const now = from.getTime()

  for (let offset = 0; offset <= days; offset++) {
    const cursor = new Date(now + offset * 24 * 60 * 60 * 1000)
    const { year, month, day, weekday } = laDateParts(cursor)
    if (!AVAILABLE_WEEKDAYS.includes(weekday)) continue

    for (const time of SLOT_TIMES) {
      const [h, m] = time.split(":").map(Number)
      const start = laWallClockToUTC(year, month - 1, day, h, m)
      if (start.getTime() <= now) continue
      const end = new Date(start.getTime() + SLOT_MINUTES * 60 * 1000)
      slots.push({ startISO: start.toISOString(), endISO: end.toISOString() })
    }
  }

  return slots
}

/**
 * Server-side guard: is this ISO start a real, future, on-grid slot? Scans a
 * wide window so a valid booking a few weeks out still passes.
 */
export function isValidSlot(startISO: string): boolean {
  const start = new Date(startISO)
  if (Number.isNaN(start.getTime())) return false
  return generateSlots(60).some((s) => s.startISO === start.toISOString())
}
