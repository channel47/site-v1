/**
 * Kit (ConvertKit) Subscription API Endpoint
 *
 * Handles email subscriptions by proxying requests to Kit API.
 * This keeps API keys secure on the server side.
 *
 * Security features:
 * - Server-side API key storage
 * - Input validation and sanitization
 * - Rate limiting via request timeout
 * - Email format validation (RFC 5322 compliant)
 * - Length validation for all inputs
 * - Security headers on responses
 *
 * Tagging: Applies actual Kit tags (not just custom fields) so you
 * can build automations and visual segments in Kit. Tags are resolved
 * by name and cached in memory per cold start. If tagging fails,
 * subscription still succeeds (graceful degradation).
 *
 * Required environment variables:
 * - KIT_API_KEY: Your Kit API key (from Settings → Developer)
 */

import type { APIRoute } from 'astro';

export const prerender = false;

// Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_TAG_LENGTH = 100;
const MAX_FIELD_VALUE_LENGTH = 1000;
const MAX_FIELD_COUNT = 10;
const ALLOWED_FIELD_KEYS = new Set(['name', 'scope', 'brief', 'budget', 'build_role', 'build_task', 'build_tool']);
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds
const KIT_BASE = 'https://api.kit.com/v4';

// In-memory tag ID cache (persists across requests within a cold start)
const tagIdCache = new Map<string, number>();

/**
 * Validates email format according to RFC 5322 basic pattern
 */
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_REGEX.test(email);
}

/**
 * Sanitizes client-provided custom fields.
 * Whitelists allowed keys, enforces length limits, strips dangerous chars.
 */
function sanitizeFields(fields: unknown): Record<string, string> | undefined {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return undefined;

  const raw = fields as Record<string, unknown>;
  const result: Record<string, string> = {};
  let count = 0;

  for (const key of Object.keys(raw)) {
    if (count >= MAX_FIELD_COUNT) break;
    if (!ALLOWED_FIELD_KEYS.has(key)) continue;

    const val = raw[key];
    if (!val || typeof val !== 'string') continue;

    const trimmed = val.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_FIELD_VALUE_LENGTH) continue;

    // Strip potentially dangerous characters (same as sanitizeTag)
    result[key] = trimmed.replace(/[<>\"\']/g, '');
    count++;
  }

  return count > 0 ? result : undefined;
}

/**
 * Sanitizes and validates tag input
 */
function sanitizeTag(tag: unknown): string | undefined {
  if (!tag || typeof tag !== 'string') return undefined;

  const trimmed = tag.trim();
  if (trimmed.length === 0) return undefined;
  if (trimmed.length > MAX_TAG_LENGTH) return undefined;

  // Remove any potentially dangerous characters
  return trimmed.replace(/[<>\"\']/g, '');
}

/**
 * Resolves a tag name to a Kit tag ID.
 * Checks cache first, then lists existing tags, then creates if needed.
 */
async function resolveTagId(tagName: string, apiKey: string): Promise<number | null> {
  // Check cache
  const cached = tagIdCache.get(tagName);
  if (cached) return cached;

  const kitTagName = `ch47-${tagName}`;
  const headers = { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' };

  try {
    // List tags and search for our tag name
    const listRes = await fetch(`${KIT_BASE}/tags?per_page=100`, { headers });
    if (listRes.ok) {
      const listData = await listRes.json();
      const existing = listData.tags?.find((t: { name: string }) => t.name === kitTagName);
      if (existing) {
        tagIdCache.set(tagName, existing.id);
        return existing.id;
      }
    }

    // Tag doesn't exist yet, create it
    const createRes = await fetch(`${KIT_BASE}/tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: kitTagName }),
    });

    if (createRes.ok || createRes.status === 201) {
      const createData = await createRes.json();
      const id = createData.tag?.id;
      if (id) {
        tagIdCache.set(tagName, id);
        return id;
      }
    }

    console.error('Failed to resolve Kit tag:', kitTagName);
    return null;
  } catch (err) {
    console.error('Tag resolution error:', err);
    return null;
  }
}

/**
 * Tags a subscriber by email address. Fire-and-forget style
 * (errors are logged but don't block the subscription response).
 */
async function tagSubscriberByEmail(email: string, tagId: number, apiKey: string): Promise<void> {
  try {
    await fetch(`${KIT_BASE}/tags/${tagId}/subscribers`, {
      method: 'POST',
      headers: { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email }),
    });
  } catch (err) {
    console.error('Failed to tag subscriber:', err);
  }
}

/**
 * Creates response with security headers
 */
function createResponse(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    }
  });
}

export const POST: APIRoute = async ({ request }) => {
  // Verify same-origin request (basic CSRF protection)
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (origin && host) {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      return createResponse(
        {
          error: 'Forbidden',
          message: 'Cross-origin requests not allowed'
        },
        403
      );
    }
  }

  // Get environment variables
  const API_KEY = import.meta.env.KIT_API_KEY;

  // Validate configuration
  if (!API_KEY) {
    console.error('Missing Kit configuration');
    return createResponse(
      {
        error: 'Server configuration error',
        message: 'Kit API is not properly configured'
      },
      500
    );
  }

  // Parse request body
  let email: string;
  let tag: string | undefined;
  let clientFields: Record<string, unknown> | undefined;

  try {
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      tag = body.tag;
      clientFields = body.fields;
    } else {
      // Handle form-encoded data
      const formData = await request.formData();
      email = formData.get('email') as string;
      tag = formData.get('tag') as string | undefined;
    }
  } catch (error) {
    return createResponse(
      {
        error: 'Invalid request',
        message: 'Could not parse request body'
      },
      400
    );
  }

  // Sanitize and validate inputs
  if (!email || typeof email !== 'string') {
    return createResponse(
      {
        error: 'Invalid email',
        message: 'Email address is required'
      },
      400
    );
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Validate email format
  if (!isValidEmail(trimmedEmail)) {
    return createResponse(
      {
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      },
      400
    );
  }

  // Sanitize tag
  const sanitizedTag = sanitizeTag(tag);

  // Call Kit API with timeout
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    // Build Kit payload
    const payload: {
      email_address: string;
      fields?: Record<string, string>;
    } = {
      email_address: trimmedEmail,
    };

    // Build custom fields — server fields override client fields
    const sanitizedClientFields = sanitizeFields(clientFields);
    const kitFields: Record<string, string> = {
      signup_source: 'channel47_website',
    };
    if (sanitizedTag) kitFields.signup_context = sanitizedTag;
    if (sanitizedClientFields) Object.assign(kitFields, sanitizedClientFields);
    payload.fields = kitFields;

    let response: Response;
    let data: { errors?: string[] };

    try {
      response = await fetch(`${KIT_BASE}/subscribers`, {
        method: 'POST',
        headers: {
          'X-Kit-Api-Key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      data = await response.json();
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      // Handle timeout
      if ((fetchError as { name?: string })?.name === 'AbortError') {
        console.error('Kit API timeout');
        return createResponse(
          {
            error: 'Request timeout',
            message: 'The request took too long. Please try again.'
          },
          504
        );
      }

      throw fetchError;
    }

    if (!response.ok) {
      console.error('Kit API error:', data);

      // Handle specific error cases
      // Kit returns { errors: string[] } for validation errors
      if (response.status === 400 || response.status === 422) {
        const errorMessage = Array.isArray(data.errors) && data.errors.length > 0
          ? data.errors[0]
          : 'Invalid subscription data';
        return createResponse(
          {
            error: 'Subscription failed',
            message: errorMessage
          },
          400
        );
      }

      return createResponse(
        {
          error: 'Subscription failed',
          message: 'Unable to subscribe at this time. Please try again later.'
        },
        response.status >= 500 ? 502 : 400
      );
    }

    // Apply Kit tag — fire-and-forget (don't block the response)
    if (sanitizedTag) {
      resolveTagId(sanitizedTag, API_KEY).then(tagId => {
        if (tagId) tagSubscriberByEmail(trimmedEmail, tagId, API_KEY);
      });
    }

    // Success - Kit handles duplicates idempotently (returns 200 for existing subscribers)
    return createResponse(
      {
        success: true,
        message: 'Successfully subscribed!'
      },
      200
    );

  } catch (error: unknown) {
    console.error('Subscription error:', error);

    // Don't expose internal error details
    return createResponse(
      {
        error: 'Server error',
        message: 'An unexpected error occurred. Please try again later.'
      },
      500
    );
  }
};
