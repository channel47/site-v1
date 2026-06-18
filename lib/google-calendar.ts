import "server-only"
import crypto from "node:crypto"

/**
 * Minimal, dependency-free Google Calendar client using a service account.
 *
 * Auth:  RS256 JWT (signed locally with the service-account private key),
 *        exchanged at Google's OAuth token endpoint for a bearer token.
 * Scope: https://www.googleapis.com/auth/calendar
 *
 * Setup (one time):
 *   1. Google Cloud → create a service account, enable the Calendar API.
 *   2. Create a JSON key; copy `client_email` and `private_key`.
 *   3. In Google Calendar, share your calendar with that client_email,
 *      permission "Make changes to events".
 *   4. Set env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
 *      (paste the key with literal \n or real newlines), GOOGLE_CALENDAR_ID
 *      (your calendar address, often your email).
 *
 * Every call fails safe: if unconfigured or Google errors, the caller still
 * captures the lead — a booking is never lost to a calendar outage.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const CAL_BASE = "https://www.googleapis.com/calendar/v3"
const SCOPE = "https://www.googleapis.com/auth/calendar"

let cachedToken: { token: string; expiresAt: number } | null = null

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID,
  )
}

function privateKey(): string {
  return (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n")
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  if (!email) return null

  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = base64url(
    JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  )
  const signingInput = `${header}.${claims}`

  let signature: string
  try {
    const signer = crypto.createSign("RSA-SHA256")
    signer.update(signingInput)
    signer.end()
    signature = base64url(signer.sign(privateKey()))
  } catch (err) {
    console.error("[gcal] failed to sign JWT (check GOOGLE_PRIVATE_KEY formatting)", err)
    return null
  }

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${signingInput}.${signature}`,
      }),
    })
    if (!res.ok) {
      console.error("[gcal] token exchange failed", { status: res.status, body: await res.text().catch(() => "") })
      return null
    }
    const data = (await res.json()) as { access_token?: string; expires_in?: number }
    if (!data.access_token) return null
    cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 }
    return cachedToken.token
  } catch (err) {
    console.error("[gcal] token request error", err)
    return null
  }
}

/** True if the window has no busy blocks. Fails OPEN (returns true) on any error. */
export async function isSlotFree(startISO: string, endISO: string): Promise<boolean> {
  const token = await getAccessToken()
  const calId = process.env.GOOGLE_CALENDAR_ID
  if (!token || !calId) return true
  try {
    const res = await fetch(`${CAL_BASE}/freeBusy`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ timeMin: startISO, timeMax: endISO, items: [{ id: calId }] }),
    })
    if (!res.ok) return true
    const data = (await res.json()) as { calendars?: Record<string, { busy?: unknown[] }> }
    const busy = data.calendars?.[calId]?.busy ?? []
    return busy.length === 0
  } catch (err) {
    console.error("[gcal] freeBusy error (allowing booking)", err)
    return true
  }
}

export type BookingDetails = {
  startISO: string
  endISO: string
  name: string
  email: string
  product: string
  brandUrl?: string
  bottleneck?: string
}

/** Create the teardown event and email the invite. Returns ok:false on failure. */
export async function createBookingEvent(details: BookingDetails): Promise<{ ok: boolean; htmlLink?: string }> {
  const token = await getAccessToken()
  const calId = process.env.GOOGLE_CALENDAR_ID
  if (!token || !calId) return { ok: false }

  const descriptionLines = [
    `Advertorial teardown with ${details.name}.`,
    details.brandUrl ? `Store: ${details.brandUrl}` : "",
    `Selling: ${details.product}`,
    details.bottleneck ? `Funnel notes: ${details.bottleneck}` : "",
  ].filter(Boolean)

  try {
    const res = await fetch(
      `${CAL_BASE}/calendars/${encodeURIComponent(calId)}/events?sendUpdates=all&conferenceDataVersion=0`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: `Advertorial teardown — ${details.name}`,
          description: descriptionLines.join("\n"),
          start: { dateTime: details.startISO },
          end: { dateTime: details.endISO },
          attendees: [{ email: details.email, displayName: details.name }],
          reminders: { useDefault: true },
        }),
      },
    )
    if (!res.ok) {
      console.error("[gcal] create event failed", { status: res.status, body: await res.text().catch(() => "") })
      return { ok: false }
    }
    const data = (await res.json()) as { htmlLink?: string }
    return { ok: true, htmlLink: data.htmlLink }
  } catch (err) {
    console.error("[gcal] create event error", err)
    return { ok: false }
  }
}
