import "server-only"

/**
 * Server-only Kit (ConvertKit) V4 API client.
 *
 * Auth:  X-Kit-Api-Key header, from the KIT_API_KEY env var.
 * Base:  https://api.kit.com/v4
 * Docs:  Kit dashboard → Settings → Developer (V4 API key).
 *
 * Subscribers are upserted by email (no duplicates) and segmented with a
 * `ch47-*` tag. Tags and custom fields are resolved by name (created on first
 * use) and cached in memory per server instance. Tagging is best-effort — a
 * tagging failure never fails the subscription.
 *
 * Custom fields: Kit only stores a field value if a custom field with that key
 * already exists. Kit does NOT reject an unknown field key — it returns 2xx and
 * silently drops it (surfacing it in a `warnings` array). So we proactively
 * ensure the fields exist (`ensureCustomFields`) and also report drops, rather
 * than relying on an error to tell us a value was lost.
 */

const KIT_BASE = "https://api.kit.com/v4"
const TAG_PREFIX = "ch47-"
const REQUEST_TIMEOUT_MS = 10_000
const MAX_FIELD_VALUE_LENGTH = 1000
const MAX_NAME_LENGTH = 100

// Caches persist across warm invocations on the same server instance.
const tagIdCache = new Map<string, number>() // `ch47-<name>` → tag id
const knownFieldKeys = new Set<string>() // custom-field keys known to exist in Kit
let customFieldsListed = false

export function isKitConfigured(): boolean {
  return (process.env.KIT_API_KEY ?? "").trim().length > 0
}

function kitHeaders(): Record<string, string> {
  return {
    "X-Kit-Api-Key": (process.env.KIT_API_KEY ?? "").trim(),
    "Content-Type": "application/json",
    Accept: "application/json",
  }
}

function stripUnsafeChars(value: string): string {
  return value.replace(/[<>"']/g, "")
}

/** Coerce an arbitrary record into trimmed, length-capped, sanitized string fields. */
export function sanitizeFields(fields: Record<string, unknown> | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!fields) return out
  for (const [key, val] of Object.entries(fields)) {
    if (typeof val !== "string") continue
    const trimmed = val.trim()
    if (!trimmed) continue
    out[key] = stripUnsafeChars(trimmed).slice(0, MAX_FIELD_VALUE_LENGTH)
  }
  return out
}

/** Basic CSRF guard: reject cross-origin browser requests. Non-browser callers (no Origin) pass. */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin")
  const host = req.headers.get("host")
  if (!origin || !host) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

async function kitFetch(path: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(`${KIT_BASE}${path}`, { ...init, headers: kitHeaders(), signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

// ── Custom fields ────────────────────────────────────────────────────────────

async function listCustomFieldKeys(): Promise<void> {
  let after: string | null = null
  for (let page = 0; page < 5; page++) {
    const qs = new URLSearchParams({ per_page: "500" })
    if (after) qs.set("after", after)
    const res = await kitFetch(`/custom_fields?${qs.toString()}`, { method: "GET" })
    if (!res.ok) return
    const data = (await res.json()) as {
      custom_fields?: Array<{ key?: string }>
      pagination?: { has_next_page?: boolean; end_cursor?: string | null }
    }
    for (const f of data.custom_fields ?? []) {
      if (f?.key) knownFieldKeys.add(f.key)
    }
    if (data.pagination?.has_next_page && data.pagination.end_cursor) {
      after = data.pagination.end_cursor
    } else {
      break
    }
  }
  customFieldsListed = true
}

/**
 * Best-effort: ensure each field key exists in Kit so its value isn't silently
 * dropped on upsert. Idempotent and cached — after the fields exist in the
 * account, later cold starts only pay one list call. Never throws.
 */
export async function ensureCustomFields(keys: string[]): Promise<void> {
  const wanted = Array.from(new Set(keys.filter(Boolean)))
  if (!wanted.length) return
  try {
    if (!customFieldsListed) await listCustomFieldKeys()
    const missing = wanted.filter((k) => !knownFieldKeys.has(k))
    for (const key of missing) {
      // Kit derives a snake_case `key` from the label; our keys are already
      // snake_case, so label === key in practice. We verify the returned key.
      const res = await kitFetch("/custom_fields", { method: "POST", body: JSON.stringify({ label: key }) })
      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { custom_field?: { key?: string } }
        const createdKey = data.custom_field?.key
        if (createdKey) {
          knownFieldKeys.add(createdKey)
          if (createdKey !== key) {
            console.warn(`[kit] custom field "${key}" was created with key "${createdKey}" — its values may not persist`)
          }
        }
      } else {
        console.warn(`[kit] could not ensure custom field "${key}"`, { status: res.status })
      }
    }
  } catch (err) {
    console.error("[kit] ensureCustomFields error (continuing)", err)
  }
}

// ── Subscribers ──────────────────────────────────────────────────────────────

export type KitResult = {
  ok: boolean
  status: number
  error?: string
  /** True when the email-only fallback ran, i.e. custom fields were not stored. */
  fieldsDropped?: boolean
  /** Field keys Kit ignored because they don't exist as custom fields. */
  warnings?: string[]
}

/**
 * Create or update a subscriber by email (Kit upserts — no duplicates).
 *
 * Kit ignores unknown custom-field keys (2xx + a `warnings` array) rather than
 * erroring, so the success path inspects `warnings`. The 422/400 retry below is
 * a defensive fallback for genuine validation errors — call `ensureCustomFields`
 * first if you need the field values to persist.
 */
export async function upsertSubscriber(
  email: string,
  opts: { firstName?: string; fields?: Record<string, string> } = {},
): Promise<KitResult> {
  const hasFields = !!opts.fields && Object.keys(opts.fields).length > 0

  const attempt = (includeFields: boolean) => {
    const body: Record<string, unknown> = { email_address: email }
    if (opts.firstName) body.first_name = opts.firstName.slice(0, MAX_NAME_LENGTH)
    if (includeFields && hasFields) body.fields = opts.fields
    return kitFetch("/subscribers", { method: "POST", body: JSON.stringify(body) })
  }

  let res = await attempt(true)
  let fieldsDropped = false
  if (!res.ok && (res.status === 422 || res.status === 400) && hasFields) {
    console.warn("[kit] subscriber upsert rejected with custom fields; retrying without them", { status: res.status })
    res = await attempt(false)
    fieldsDropped = res.ok
  }

  if (res.ok) {
    let warnings: string[] | undefined
    try {
      const data = (await res.json()) as { warnings?: unknown }
      if (Array.isArray(data?.warnings) && data.warnings.length) {
        warnings = data.warnings.map(String)
        console.warn("[kit] subscriber upsert ignored some fields", { warnings, email })
      }
    } catch {
      // ignore non-JSON success bodies
    }
    return { ok: true, status: res.status, fieldsDropped, warnings }
  }

  let error = "Subscription failed"
  try {
    const data = (await res.json()) as { errors?: unknown }
    if (Array.isArray(data?.errors) && data.errors.length) error = String(data.errors[0])
  } catch {
    // ignore non-JSON error bodies
  }
  return { ok: false, status: res.status, error }
}

// ── Tags ─────────────────────────────────────────────────────────────────────

/** Resolve a `ch47-<name>` tag to its id, creating it if it doesn't exist. */
async function resolveTagId(tagName: string): Promise<number | null> {
  const full = `${TAG_PREFIX}${tagName}`
  const cached = tagIdCache.get(full)
  if (cached) return cached

  // Search existing tags (paginate defensively — there are normally only a handful of ch47-* tags).
  let after: string | null = null
  for (let page = 0; page < 5; page++) {
    const qs = new URLSearchParams({ per_page: "500" })
    if (after) qs.set("after", after)
    const res = await kitFetch(`/tags?${qs.toString()}`, { method: "GET" })
    if (!res.ok) break
    const data = (await res.json()) as {
      tags?: Array<{ id: number; name: string }>
      pagination?: { has_next_page?: boolean; end_cursor?: string | null }
    }
    const match = data.tags?.find((t) => t.name === full)
    if (match?.id) {
      tagIdCache.set(full, match.id)
      return match.id
    }
    if (data.pagination?.has_next_page && data.pagination.end_cursor) {
      after = data.pagination.end_cursor
    } else {
      break
    }
  }

  // Not found — create it.
  const createRes = await kitFetch("/tags", { method: "POST", body: JSON.stringify({ name: full }) })
  if (createRes.ok) {
    const data = (await createRes.json().catch(() => ({}))) as { tag?: { id?: number } }
    const id = data.tag?.id
    if (id) {
      tagIdCache.set(full, id)
      return id
    }
  }
  return null
}

/** Apply a `ch47-<name>` tag to a subscriber by email. Best-effort. */
export async function tagSubscriber(email: string, tagName: string): Promise<boolean> {
  try {
    const tagId = await resolveTagId(tagName)
    if (!tagId) return false
    const res = await kitFetch(`/tags/${tagId}/subscribers`, {
      method: "POST",
      body: JSON.stringify({ email_address: email }),
    })
    return res.ok
  } catch (err) {
    console.error("[kit] failed to tag subscriber", err)
    return false
  }
}

/**
 * Ensure the custom fields exist, upsert the subscriber, and apply a `ch47-<tag>`
 * tag. The subscription is the source of truth; tagging is awaited but never
 * fails the operation. The returned result carries `fieldsDropped`/`warnings`
 * so callers can detect (and log) incomplete capture.
 */
export async function subscribeToKit(
  email: string,
  opts: { firstName?: string; tag: string; fields?: Record<string, string> },
): Promise<KitResult> {
  if (opts.fields && Object.keys(opts.fields).length) {
    await ensureCustomFields(Object.keys(opts.fields))
  }
  const result = await upsertSubscriber(email, { firstName: opts.firstName, fields: opts.fields })
  if (!result.ok) return result
  await tagSubscriber(email, opts.tag)
  return result
}
