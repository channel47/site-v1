const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const vm = require('node:vm')
const ts = require('typescript')
const { execFileSync } = require('node:child_process')
const root = process.cwd()
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ch47-measurement-test-'))
async function main() {
try {
  execFileSync('pnpm', ['exec', 'tsc', 'lib/sharing.ts', 'lib/reading-activity.ts', '--outDir', temp, '--target', 'ES2022', '--module', 'commonjs', '--esModuleInterop', '--skipLibCheck'], { stdio: 'pipe' })
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir')
  const policy = require(path.join(temp, 'measurement.js'))
  const paths = ['/', '/newsletter', '/browse', '/notes/example', '/projects/tool']
  for (const channel of Object.keys(policy.SHARE_CHANNELS)) {
    const link = new URL(policy.taggedShareUrl('/notes/example', channel))
    const arrival = policy.arrivalAttribution(link, '', paths)
    assert.equal(arrival.source, channel)
    assert.equal(arrival.campaign, 'example')
  }
  assert.throws(() => policy.taggedShareUrl('https://outside.example', 'x'))
  assert.equal(policy.arrivalAttribution(new URL('https://channel47.dev/private/email@example.com'), '', paths), undefined)
  const clean = policy.arrivalAttribution(new URL('https://channel47.dev/notes/example?email=private@example.com&utm_source=unknown&utm_campaign=private@example.com'), 'https://private.example/secret?email=private@example.com', paths)
  assert.deepEqual(clean, { landing_path: '/notes/example', source: 'other', medium: 'referral', campaign: '' })
  assert(!JSON.stringify(clean).includes('private'))
  assert.deepEqual(policy.sanitizeAnalyticsEvent({ type: 'event', url: 'https://channel47.dev/notes/example?email=private@example.com#secret' }, paths), { type: 'event', url: 'https://channel47.dev/notes/example' })
  assert.equal(policy.sanitizeAnalyticsEvent({ url: 'https://channel47.dev/private' }, paths), null)
  assert.equal(policy.restoreAttribution({ ...clean, landing_path: '/private' }, paths), undefined)
  assert.deepEqual(policy.restoreAttribution({ ...clean, email: 'private@example.com' }, paths), clean)
  assert.equal(policy.measurementTier('channel47.dev', true, false), 'production')
  assert.equal(policy.measurementTier('localhost', true, false), undefined)
  assert.equal(policy.measurementTier('preview.vercel.app', true, false), undefined)
  assert.equal(policy.measurementTier('localhost', false, true), 'development')

  const reading = require(path.join(temp, 'reading-activity.js'))
  const state = reading.createReadingActivity()
  const activityEvents = []
  const emit = (event, details) => activityEvents.push({ event, details })
  reading.sampleReading(state, 0, true, true, emit)
  for (let t = 1000; t <= 80_000; t += 1000) reading.sampleReading(state, t, true, false, emit)
  assert.equal(state.activeMs, 60_000, 'Foreground idle time must stop after sixty seconds')
  assert.deepEqual(activityEvents, [{ event: 'content_active', details: { active_seconds: 30 } }])
  reading.sampleReading(state, 80_000, false, false, emit)
  for (let t = 81_000; t <= 180_000; t += 1000) reading.sampleReading(state, t, false, true, emit)
  assert.equal(state.activeMs, 60_000, 'Hidden or offscreen activity must not count')
  reading.sampleReading(state, 181_000, true, true, emit)
  for (let t = 182_000; t <= 211_000; t += 1000) reading.sampleReading(state, t, true, false, emit)
  assert.equal(state.activeMs, 90_000)
  assert.equal(activityEvents.length, 2, 'Milestones must fire once after resumed reading')
  reading.sampleReading(state, 400_000, true, true, emit)
  assert.equal(state.activeMs, 90_000, 'Laptop sleep or a suspended timer must not count')

  // Test the real DOM controller: scroll reach is separate from reading time,
  // duplicate setup retains milestones, and cleanup removes every listener.
  const originalGlobals = Object.fromEntries(['window', 'document', 'performance'].map(key => [key, global[key]]))
  const win = new EventTarget()
  const doc = new EventTarget()
  let now = 0
  let rect = { top: 0, bottom: 2000, height: 2000 }
  let bodyReady = false
  let lastSelector
  let interval
  Object.assign(win, { innerHeight: 800, setInterval: fn => { interval = fn; return 1 }, clearInterval: () => { interval = undefined } })
  Object.assign(doc, { visibilityState: 'visible', hasFocus: () => true, querySelector: selector => { lastSelector = selector; return bodyReady ? { getBoundingClientRect: () => rect } : null },
    querySelectorAll: () => [{ dataset: { capturePlacement: 'article_end' }, getBoundingClientRect: () => ({ top: 700, bottom: 900, height: 200 }) }] })
  Object.assign(global, { window: win, document: doc, performance: { now: () => now } })
  try {
    const controllerState = reading.createReadingActivity()
    const observed = []
    const record = (name, data) => observed.push({ name, data })
    let stop = reading.observeReading(controllerState, record, '/notes/example')
    assert.equal(lastSelector, '[data-reading-path="/notes/example"] > .st-prose')
    bodyReady = true
    rect = { top: -1200, bottom: 800, height: 2000 }
    win.dispatchEvent(new Event('scroll'))
    assert.equal(observed.filter(e => e.name === 'content_end').length, 1)
    assert.equal(observed.filter(e => e.name === 'content_depth').length, 2)
    assert.equal(observed.filter(e => e.name === 'content_active').length, 0, 'Jumping to the end is not active reading')
    assert.equal(observed.filter(e => e.name === 'newsletter_view').length, 1)
    stop()
    assert.equal(interval, undefined)
    const count = observed.length
    now = 40_000
    win.dispatchEvent(new Event('scroll'))
    assert.equal(observed.length, count)
    stop = reading.observeReading(controllerState, record, '/notes/example')
    assert.equal(observed.length, count, 'Effect replay must not repeat reaches or form impressions')
    stop()
  } finally { Object.assign(global, originalGlobals) }

  const sdkOptions = []
  const sdkEvents = []
  const transportExports = {}
  const transportContext = {
    exports: transportExports, process: { env: { NODE_ENV: 'production', NEXT_PUBLIC_STATSIG_CLIENT_KEY: 'client-test-only' } },
    window: { location: { hostname: 'channel47.dev' } }, navigator: {}, crypto: { randomUUID: () => 'test-page-session' },
    require: name => {
      if (name === './measurement') return policy
      if (name === '@statsig/js-client') return { StatsigClient: class {
        constructor(key, user, options) { sdkOptions.push({ key, user, options }) }
        initializeAsync() { return Promise.resolve() }
        logEvent(event) { sdkEvents.push(event) }
      } }
      throw Error(`Unexpected transport import ${name}`)
    },
  }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/reader-analytics.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, transportContext)
  transportContext.navigator.doNotTrack = '1'
  transportExports.sendReaderEvent('content_open', { page: '/notes/example' })
  assert.equal(sdkOptions.length, 0, 'Do Not Track must prevent SDK initialization')
  transportContext.navigator.doNotTrack = undefined
  transportContext.navigator.globalPrivacyControl = true
  transportExports.sendReaderEvent('content_open', { page: '/notes/example' })
  assert.equal(sdkOptions.length, 0)
  transportContext.navigator.globalPrivacyControl = false
  transportExports.sendReaderEvent('content_open', { page: '/notes/example' })
  transportExports.sendReaderEvent('content_active', { page: '/notes/example', active_seconds: 30 })
  assert.equal(sdkOptions.length, 1, 'Navigation and events share one client')
  assert.equal(sdkOptions[0].options.disableStableID, true)
  assert.equal(sdkOptions[0].options.disableStorage, true)
  assert.equal(sdkOptions[0].options.includeCurrentPageUrlWithEvents, false)
  assert.equal(sdkOptions[0].options.plugins, undefined)
  assert.equal(sdkEvents[1].metadata.active_seconds, '30')

  // Exercise the actual client module with mocked hooks, storage and analytics.
  // No browser, provider API, or real subscriber is used by this test.
  function client(storageDenied = false) {
    let pathname = '/notes/example'
    const events = []
    let providerFails = false
    const effects = []
    const refs = []; let refIndex = 0
    const storage = new Map()
    const window = { location: { href: policy.taggedShareUrl(pathname, 'newsletter'), pathname } }
    const exports = {}
    const context = {
      exports, URL, window, document: { referrer: '' },
      sessionStorage: {
        getItem: key => { if (storageDenied) throw Error('denied'); return storage.get(key) ?? null },
        setItem: (key, value) => { if (storageDenied) throw Error('denied'); storage.set(key, value) },
      },
      require: name => {
        if (name === 'react') return { useEffect: fn => effects.push(fn), useRef: value => refs[refIndex++] ?? (refs[refIndex - 1] = { current: value }) }
        if (name === 'next/navigation') return { usePathname: () => pathname }
        if (name === 'react/jsx-runtime') return { jsx: () => null }
        if (name === '@vercel/analytics/next') return { Analytics: () => null }
        if (name === '@/lib/reader-analytics') return { sendReaderEvent: (name, data) => { if (providerFails) throw Error('offline'); events.push({ name, data }) } }
        if (name === '@/lib/reading-activity') return { createReadingActivity: () => ({}), observeReading: () => () => {} }
        if (name === '@/lib/measurement') return policy
        throw Error(`Unexpected module ${name}`)
      },
    }
    const source = fs.readFileSync(path.join(root, 'components/site/measurement.tsx'), 'utf8')
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
    vm.runInNewContext(compiled, context)
    const render = async (next = pathname) => {
      refIndex = 0
      if (next !== pathname) { pathname = next; window.location = { pathname, href: 'https://channel47.dev' + pathname } }
      exports.SiteMeasurement({ paths })
      effects.splice(0).forEach(fn => fn())
      await new Promise(resolve => setImmediate(resolve))
    }
    return { exports, render, events, fail: () => { providerFails = true } }
  }
  for (const denied of [false, true]) {
    const app = client(denied)
    await app.render(); await app.render()
    assert.equal(app.events.filter(e => e.name === 'content_open').length, 1, 'Strict Mode must not double-count the opening')
    await app.render('/newsletter')
    app.exports.measure('newsletter_result', { placement: 'newsletter', status: 'accepted', email: 'private@example.com', target_path: '/private' })
    await new Promise(resolve => setImmediate(resolve))
    const event = app.events.at(-1)
    assert.equal(event.data.page, '/newsletter')
    assert.equal(event.data.landing_path, '/notes/example')
    assert.equal(event.data.last_content_path, '/notes/example')
    assert.equal(event.data.source, 'newsletter')
    assert.equal(event.data.status, 'accepted')
    assert.equal(event.data.email, undefined)
    assert.equal(event.data.target_path, undefined)
    await app.render('/private')
    const count = app.events.length
    app.exports.measure('install_copy')
    assert.equal(app.events.length, count)
    await app.render('/notes/example')
    assert.equal(app.events.filter(e => e.name === 'content_open').length, 2, 'Returning to an article is a new opening')
    app.fail()
    assert.doesNotThrow(() => app.exports.measure('prompt_copy'))
    await new Promise(resolve => setImmediate(resolve))
  }

  const sharing = require(path.join(temp, 'sharing.js'))
  const pack = sharing.buildSharePack('/notes/codex-static-ads-google-flow')
  assert(pack.email.includes('I attached two reference images'))
  assert(pack.email.includes('href="https://channel47.dev/notes/codex-static-ads-google-flow?'))
  assert(pack.email.includes('utm_source=newsletter'))
  assert(pack.email.startsWith('---\nsubject: From Google Flow to making whole ads in Codex'))
  fs.writeFileSync(path.join(temp, 'newsletter.html'), pack.email)
  execFileSync('python3', ['scripts/kit-broadcast.py', 'render', path.join(temp, 'newsletter.html'), '--output', path.join(temp, 'preview.html')], { cwd: root, stdio: 'pipe' })
  assert(!pack.email.includes('send_at:'))
  assert(pack.image.url.endsWith('/posts/codex-static-ads-native-pass.jpg'))
  assert.throws(() => sharing.buildSharePack('/notes/not-published'), /No published entry/)
  const project = sharing.buildSharePack('/projects/google-ads')
  assert(project.image.url.endsWith('/projects/google-ads/opengraph-image'))
  assert(project.email.includes('My first MCP'))
  assert.throws(() => sharing.buildSharePack('/notes/google-ads-mcp'), /No published entry/)
  assert(project.email.includes('Explore the project'))
  console.log('Passed: foreground and idle timing, suspended timers, streamed article bodies, route-scoped observation, cleanup, milestone deduplication, privacy and development guards, provider failure, attribution, navigation, and sharing output.')
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}

}
main().catch(error => { console.error(error); process.exitCode = 1 })
