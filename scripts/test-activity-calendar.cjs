const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, globals = {}) {
  const exports = {};
  const compiled = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(compiled, { exports, Date, Intl, URL, URLSearchParams, AbortSignal, ...globals });
  return exports;
}
const model = load('lib/activity-calendar.ts');
const plain = value => JSON.parse(JSON.stringify(value));
const now = new Date('2026-09-15T04:00:00Z');
const range = model.activityRange(now);
assert.deepEqual(plain(range), { from: '2026-06-28', through: '2026-09-14' });
assert.equal(model.localActivityDate('2026-09-15T06:59:59Z'), '2026-09-14');
assert.equal(model.localActivityDate('2026-09-15T07:00:00Z'), '2026-09-15');
assert.equal(model.localActivityDate('2026-11-01T09:30:00Z'), '2026-11-01');
assert.equal(model.shiftActivityDate('2026-03-08', 1), '2026-03-09');
assert.equal(model.shiftActivityDate('2026-01-01', -1), '2025-12-31');

const commit = (sha, date, privateRepo = false) => ({ sha, repository: { private: privateRepo }, commit: { author: { date } } });
const commits = [
  commit('shared-sha', '2026-09-15T01:00:00Z'),
  commit('shared-sha', '2026-09-15T01:00:00Z'),
  commit('private', '2026-09-14T12:00:00Z', true),
  commit('before-window', '2026-06-28T06:59:59Z'),
  commit('after-window', '2026-09-15T07:00:00Z'),
  commit('first-day', '2026-06-28T07:00:00Z'),
];
assert.deepEqual(plain(model.countPublicCommits(commits, range.from, range.through)), { '2026-09-14': 1, '2026-06-28': 1 });
const emails = [
  { id: 1, status: 'completed', send_at: '2026-07-19T02:00:00Z', subject: 'Not for publication', content: 'Private content' },
  { id: 1, status: 'completed', send_at: '2026-07-19T02:00:00Z' },
  { id: 2, status: 'scheduled', send_at: '2026-07-19T02:00:00Z' },
  { id: 3, status: 'draft', send_at: null },
  { id: 4, status: 'aborted', send_at: '2026-07-19T02:00:00Z' },
  { id: 5, status: 'completed', send_at: null, published_at: '2026-07-19T02:00:00Z' },
  { id: 6, status: 'completed', send_at: '2026-09-16T12:00:00Z' },
];
assert.deepEqual(plain(model.countCompletedEmails(emails, range.through)), { '2026-07-18': 1 });
assert.doesNotMatch(JSON.stringify(model.countCompletedEmails(emails, range.through)), /subject|content|Not for publication/);
const source = { from: range.from, through: '2026-09-13', updatedAt: '2026-09-14T01:00:00Z', counts: {} };
const days = model.activityDays({ accounts: [], github: source, email: source }, range.through);
assert.equal(days.length, 84);
assert.equal(new Date(days[0].date).getUTCDay(), 0);
assert.equal(days.find(day => day.date === '2026-09-13').commits, 0);
assert.equal(days.find(day => day.date === '2026-09-14').commits, null, 'A stale source must not turn an unknown day into zero');
assert.equal(days.at(-1).future, true);
assert.match(model.activityDescription(days.find(day => day.date === '2026-09-14')), /unavailable/);

async function verifySources() {
  const snapshot = { accounts: model.ACTIVITY_ACCOUNTS, github: source, email: source };
  const requests = [];
  const fixture = { broadcasts: [emails[0]], pagination: { has_next_page: true, end_cursor: 'next-page' } };
  let broken = false;
  const service = load('lib/newsletter-activity.ts', {
    require: name => name === './activity-calendar' ? model : snapshot,
    process: { env: { KIT_API_KEY: 'test-only' } },
    console: { warn() {} },
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (broken) return { ok: false, status: 503 };
      if (url.hostname === 'api.github.com') {
        assert.match(url.searchParams.get('q'), /is:public/);
        return { ok: true, json: async () => ({ total_count: 2, incomplete_results: false, items: commits.slice(0, 2) }) };
      }
      assert.equal(url.searchParams.get('status'), 'completed');
      assert.equal(url.searchParams.get('slim'), 'true');
      return { ok: true, json: async () => url.searchParams.has('after') ? { broadcasts: [emails[1]], pagination: { has_next_page: false } } : fixture };
    },
  });
  const fresh = await service.getNewsletterActivity(now);
  assert.deepEqual(plain(fresh.github.counts), { '2026-09-14': 1 }, 'The same commit found through both accounts or forks counts once');
  assert.deepEqual(plain(fresh.email.counts), { '2026-07-18': 1 });
  assert.equal(requests.filter(r => r.url.hostname === 'api.kit.com').length, 2);
  assert.ok(requests.every(r => r.options.next.revalidate === 3600));
  broken = true;
  const fallback = await service.getNewsletterActivity(now);
  assert.deepEqual(plain(fallback.github), source);
  assert.deepEqual(plain(fallback.email), source);
  console.log('Activity calendar passed: Los Angeles dates, DST, range boundaries, public-only commits, deduplication, completed sends, metadata stripping, pagination, hourly cache, and dated outage fallback.');
}
verifySources().catch(error => { console.error(error); process.exitCode = 1; });
