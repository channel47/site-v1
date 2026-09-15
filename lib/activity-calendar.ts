/** Public activity only. Calendar dates use Jackson's local time. */
export const ACTIVITY_TIME_ZONE = "America/Los_Angeles";
export const ACTIVITY_ACCOUNTS = ["ctrlswing", "jackson4am"];

export type ActivitySource = {
  from: string;
  through: string;
  updatedAt: string;
  counts: Record<string, number>;
};
export type NewsletterActivity = {
  accounts: string[];
  github: ActivitySource;
  email: ActivitySource;
};
export type ActivityDay = { date: string; commits: number | null; emails: number | null; future: boolean };

export function localActivityDate(value: string | Date): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("Invalid activity date");
  return new Intl.DateTimeFormat("en-CA", { timeZone: ACTIVITY_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** Calendar arithmetic on date-only strings, independent of DST and browser zone. */
export function shiftActivityDate(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function activityRange(now = new Date()) {
  const through = localActivityDate(now);
  const weekday = new Date(`${through}T12:00:00Z`).getUTCDay();
  return { from: shiftActivityDate(through, -weekday - 77), through };
}

export function activityDays(activity: NewsletterActivity, today: string): ActivityDay[] {
  const { from } = activityRange(new Date(`${today}T12:00:00Z`));
  const count = (source: ActivitySource, date: string) =>
    date >= source.from && date <= source.through ? source.counts[date] ?? 0 : null;
  return Array.from({ length: 84 }, (_, index) => {
    const date = shiftActivityDate(from, index);
    return { date, commits: count(activity.github, date), emails: count(activity.email, date), future: date > today };
  });
}

export type PublicCommit = {
  sha: string;
  repository: { private: boolean };
  commit: { author: { date: string } };
};

export function countPublicCommits(items: PublicCommit[], from: string, through: string): Record<string, number> {
  const seen = new Set<string>();
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (item.repository.private !== false || seen.has(item.sha)) continue;
    const date = localActivityDate(item.commit.author.date);
    if (date < from || date > through) continue;
    seen.add(item.sha);
    counts[date] = (counts[date] ?? 0) + 1;
  }
  return counts;
}

export type CompletedBroadcast = { id: number; status: string; send_at: string | null };

export function countCompletedEmails(items: CompletedBroadcast[], through: string): Record<string, number> {
  const seen = new Set<number>();
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (item.status !== "completed" || !item.send_at || seen.has(item.id)) continue;
    const date = localActivityDate(item.send_at);
    if (date > through) continue;
    seen.add(item.id);
    counts[date] = (counts[date] ?? 0) + 1;
  }
  return counts;
}

export function activityLevel(commits: number | null): number {
  if (!commits) return 0;
  return commits < 3 ? 1 : commits < 6 ? 2 : commits < 10 ? 3 : 4;
}

export function activityDateLabel(date: string, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", ...options }).format(new Date(`${date}T12:00:00Z`));
}

export function activityDescription(day: ActivityDay): string {
  const commits = day.commits === null ? "Commit activity unavailable" : `${day.commits} public ${day.commits === 1 ? "commit" : "commits"}`;
  const emails = day.emails === null ? "email activity unavailable" : day.emails === 0 ? "no email" : `${day.emails} ${day.emails === 1 ? "email" : "emails"} sent`;
  return `${commits} · ${emails}`;
}
