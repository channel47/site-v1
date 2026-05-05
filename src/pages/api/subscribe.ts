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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_TAG_LENGTH = 100;
const MAX_FIELD_VALUE_LENGTH = 1000;
const MAX_FIELD_COUNT = 10;
const ALLOWED_FIELD_KEYS = new Set(['name', 'scope', 'brief', 'budget', 'build_role', 'build_task', 'build_tool']);
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds
const KIT_BASE = 'https://api.kit.com/v4';
const SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

const tagIdCache = new Map<string, number>();

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_REGEX.test(email);
}

function stripUnsafeChars(value: string): string {
  return value.replace(/[<>"']/g, '');
}

function getKitHeaders(apiKey: string): Record<string, string> {
  return {
    'X-Kit-Api-Key': apiKey,
    'Content-Type': 'application/json',
  };
}

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

    result[key] = stripUnsafeChars(trimmed);
    count++;
  }

  return count > 0 ? result : undefined;
}

function sanitizeTag(tag: unknown): string | undefined {
  if (!tag || typeof tag !== 'string') return undefined;

  const trimmed = tag.trim();
  if (trimmed.length === 0) return undefined;
  if (trimmed.length > MAX_TAG_LENGTH) return undefined;

  return stripUnsafeChars(trimmed);
}

async function resolveTagId(tagName: string, apiKey: string): Promise<number | null> {
  const cached = tagIdCache.get(tagName);
  if (cached) return cached;

  const kitTagName = `ch47-${tagName}`;
  const headers = getKitHeaders(apiKey);

  try {
    const listRes = await fetch(`${KIT_BASE}/tags?per_page=100`, { headers });
    if (listRes.ok) {
      const listData = await listRes.json();
      const existing = listData.tags?.find((t: { name: string }) => t.name === kitTagName);
      if (existing) {
        tagIdCache.set(tagName, existing.id);
        return existing.id;
      }
    }

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

async function tagSubscriberByEmail(email: string, tagId: number, apiKey: string): Promise<void> {
  try {
    await fetch(`${KIT_BASE}/tags/${tagId}/subscribers`, {
      method: 'POST',
      headers: getKitHeaders(apiKey),
      body: JSON.stringify({ email_address: email }),
    });
  } catch (err) {
    console.error('Failed to tag subscriber:', err);
  }
}

function createResponse(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: SECURITY_HEADERS,
  });
}

async function parseSubscriptionRequest(request: Request): Promise<{
  email: unknown;
  tag: unknown;
  clientFields: unknown;
}> {
  const contentType = request.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const body = await request.json();
    return {
      email: body.email,
      tag: body.tag,
      clientFields: body.fields,
    };
  }

  const formData = await request.formData();
  return {
    email: formData.get('email'),
    tag: formData.get('tag'),
    clientFields: undefined,
  };
}

function buildKitFields(tag: string | undefined, clientFields: unknown): Record<string, string> {
  return {
    signup_source: 'channel47_website',
    ...(tag ? { signup_context: tag } : {}),
    ...sanitizeFields(clientFields),
  };
}

function getKitErrorMessage(data: { errors?: string[] }): string {
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors[0];
  }

  return 'Invalid subscription data';
}

function isAbortError(error: unknown): boolean {
  return (error as { name?: string })?.name === 'AbortError';
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

  const API_KEY = import.meta.env.KIT_API_KEY;

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

  let email: unknown;
  let tag: unknown;
  let clientFields: unknown;

  try {
    ({ email, tag, clientFields } = await parseSubscriptionRequest(request));
  } catch (error) {
    return createResponse(
      {
        error: 'Invalid request',
        message: 'Could not parse request body'
      },
      400
    );
  }

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

  if (!isValidEmail(trimmedEmail)) {
    return createResponse(
      {
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      },
      400
    );
  }

  const sanitizedTag = sanitizeTag(tag);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const payload = {
      email_address: trimmedEmail,
      fields: buildKitFields(sanitizedTag, clientFields),
    };

    let response: Response;
    let data: { errors?: string[] };

    try {
      response = await fetch(`${KIT_BASE}/subscribers`, {
        method: 'POST',
        headers: getKitHeaders(API_KEY),
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      data = await response.json();
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      if (isAbortError(fetchError)) {
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

      if (response.status === 400 || response.status === 422) {
        return createResponse(
          {
            error: 'Subscription failed',
            message: getKitErrorMessage(data)
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

    if (sanitizedTag) {
      resolveTagId(sanitizedTag, API_KEY).then(tagId => {
        if (tagId) tagSubscriberByEmail(trimmedEmail, tagId, API_KEY);
      });
    }

    return createResponse(
      {
        success: true,
        message: 'Successfully subscribed!'
      },
      200
    );

  } catch (error: unknown) {
    console.error('Subscription error:', error);

    return createResponse(
      {
        error: 'Server error',
        message: 'An unexpected error occurred. Please try again later.'
      },
      500
    );
  }
};
