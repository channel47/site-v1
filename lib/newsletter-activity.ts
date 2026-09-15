import snapshot from "@/data/newsletter-activity.json";
import {
  ACTIVITY_ACCOUNTS, activityRange, shiftActivityDate,
  countPublicCommits, countCompletedEmails,
  type ActivitySource, type NewsletterActivity, type PublicCommit, type CompletedBroadcast,
} from "./activity-calendar";

const REVALIDATE = 3600;

async function readJSON<T>(url: URL, headers: Record<string, string>): Promise<T> {
  const response = await fetch(url, { headers, next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Activity source returned ${response.status}`);
  return response.json() as Promise<T>;
}

export async function readPublicCommitActivity(now = new Date()): Promise<ActivitySource> {
  const { from, through } = activityRange(now);
  const items: PublicCommit[] = [];
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "channel47-site" };
  if (process.env.GITHUB_ACTIVITY_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_ACTIVITY_TOKEN}`;
  for (const account of ACTIVITY_ACCOUNTS) {
    // Query a one-day margin, then group exact timestamps in Los Angeles time.
    const query = `author:${account} is:public author-date:${shiftActivityDate(from, -1)}..${shiftActivityDate(through, 1)}`;
    for (let page = 1; page <= 10; page++) {
      const url = new URL("https://api.github.com/search/commits");
      url.search = new URLSearchParams({ q: query, per_page: "100", page: String(page), sort: "author-date", order: "desc" }).toString();
      const result = await readJSON<{ total_count: number; incomplete_results: boolean; items: PublicCommit[] }>(url, headers);
      if (result.incomplete_results || result.total_count > 1000 || !Array.isArray(result.items)) {
        throw new Error("GitHub returned incomplete activity");
      }
      items.push(...result.items);
      if (page * 100 >= result.total_count) break;
      if (!result.items.length) throw new Error("GitHub activity pagination ended early");
    }
  }
  return { from, through, updatedAt: now.toISOString(), counts: countPublicCommits(items, from, through) };
}

export async function readEmailActivity(now = new Date()): Promise<ActivitySource> {
  const key = process.env.KIT_API_KEY;
  if (!key) throw new Error("Email activity source is not configured");
  const { from, through } = activityRange(now);
  const broadcasts: CompletedBroadcast[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  for (let page = 0; page < 20; page++) {
    const url = new URL("https://api.kit.com/v4/broadcasts");
    url.search = new URLSearchParams({ status: "completed", per_page: "100", slim: "true", ...(cursor ? { after: cursor } : {}) }).toString();
    const result = await readJSON<{ broadcasts: CompletedBroadcast[]; pagination: { has_next_page: boolean; end_cursor: string } }>(url, { "X-Kit-Api-Key": key });
    if (!Array.isArray(result.broadcasts) || !result.pagination) throw new Error("Invalid email activity response");
    broadcasts.push(...result.broadcasts);
    if (!result.pagination.has_next_page) {
      return { from, through, updatedAt: now.toISOString(), counts: countCompletedEmails(broadcasts, through) };
    }
    cursor = result.pagination.end_cursor;
    if (!cursor || cursors.has(cursor)) throw new Error("Invalid email activity pagination");
    cursors.add(cursor);
  }
  throw new Error("Email activity exceeded its pagination limit");
}

/** Publish only daily totals. Keep the dated snapshot if a provider is unavailable. */
export async function getNewsletterActivity(now = new Date()): Promise<NewsletterActivity> {
  const [github, email] = await Promise.allSettled([readPublicCommitActivity(now), readEmailActivity(now)]);
  if (github.status === "rejected") console.warn("Newsletter GitHub activity is using its dated fallback.");
  if (email.status === "rejected") console.warn("Newsletter email activity is using its dated fallback.");
  return {
    accounts: ACTIVITY_ACCOUNTS,
    github: github.status === "fulfilled" ? github.value : snapshot.github,
    email: email.status === "fulfilled" ? email.value : snapshot.email,
  };
}
