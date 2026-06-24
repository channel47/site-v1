/**
 * Warm-lead capture endpoint.
 *
 * Env-gated Kit (ConvertKit) V4 integration. It only does real work when the
 * Kit credentials are present; without them it returns `{ ok:false,
 * code:"unconfigured" }` and stores nothing — we never fake a "subscribed"
 * state to the visitor.
 *
 * To activate, set in the Vercel project (or .env.local):
 *   KIT_API_KEY        — required. Kit V4 API key.
 *   KIT_FORM_ID        — recommended. Adds the subscriber to a form (handles
 *                        double opt-in / confirmation per the form's settings).
 *   KIT_WARM_TAG_ID    — optional. Tag applied to warm (not-yet-member) leads.
 *   KIT_MEMBER_TAG_ID  — optional. Tag applied to code-redeeming members.
 *
 * Kit V4 reference: POST https://api.kit.com/v4/{subscribers|forms/:id/subscribers|tags/:id/subscribers}
 * with header `X-Kit-Api-Key`. Verify endpoints/IDs against the live account.
 */

const KIT_BASE = "https://api.kit.com/v4"
const EMAIL_RE = /.+@.+\..+/

export async function POST(req: Request) {
  let body: { email?: unknown; intent?: unknown }
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false, code: "bad-request" }, { status: 400 })
  }

  const email = typeof body.email === "string" ? body.email.trim() : ""
  const intent = body.intent === "member" ? "member" : "warm"
  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, code: "bad-email" }, { status: 400 })
  }

  const apiKey = process.env.KIT_API_KEY
  if (!apiKey) {
    // Dormant by design — surfaced honestly in the UI, not faked as success.
    console.warn(
      "[/api/subscribe] KIT_API_KEY unset — capture dormant; email not stored.",
    )
    return Response.json({ ok: false, code: "unconfigured" }, { status: 200 })
  }

  const headers = {
    "content-type": "application/json",
    "x-kit-api-key": apiKey,
  }

  try {
    // 1. Upsert the subscriber.
    const sub = await fetch(`${KIT_BASE}/subscribers`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email_address: email }),
    })
    if (!sub.ok) {
      console.error(
        "[/api/subscribe] Kit subscriber upsert failed",
        sub.status,
        await sub.text().catch(() => ""),
      )
      return Response.json({ ok: false, code: "provider-error" }, { status: 502 })
    }

    // 2. Add to the form (opt-in flow) when configured. Best-effort.
    const formId = process.env.KIT_FORM_ID
    if (formId) {
      await fetch(`${KIT_BASE}/forms/${formId}/subscribers`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email_address: email }),
      }).catch((e) => console.error("[/api/subscribe] form add failed", e))
    }

    // 3. Tag by intent when configured. Best-effort.
    const tagId =
      intent === "member"
        ? process.env.KIT_MEMBER_TAG_ID
        : process.env.KIT_WARM_TAG_ID
    if (tagId) {
      await fetch(`${KIT_BASE}/tags/${tagId}/subscribers`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email_address: email }),
      }).catch((e) => console.error("[/api/subscribe] tag failed", e))
    }

    return Response.json({ ok: true })
  } catch (e) {
    console.error("[/api/subscribe] unexpected error", e)
    return Response.json({ ok: false, code: "error" }, { status: 502 })
  }
}
